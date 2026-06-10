import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import admin_only
from app.models.payment import PaymentStatus
from app.schemas.payment import (
    PaymentCreateRequest,
    PaymentUpdateStatusRequest,
    PaymentResponse,
    PaymentListResponse,
)
from app.services import payment_service
from app.core.vnpay import vnpay_helper
from datetime import datetime, timezone
from fastapi import Request

router = APIRouter(prefix="/admin/payments", tags=["Admin - Payment Management"])


@router.get("", response_model=PaymentListResponse, dependencies=[Depends(admin_only)])
async def get_payments(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[PaymentStatus] = None,
    owner_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
):
    """Danh sách thanh toán"""
    return await payment_service.list_payments(db, page, limit, status, owner_id)


@router.post("", response_model=PaymentResponse, dependencies=[Depends(admin_only)], status_code=201)
async def create_payment(
    data: PaymentCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Tạo thanh toán mới"""
    return await payment_service.create_payment(db, data)


@router.patch("/{payment_id}/status", response_model=PaymentResponse, dependencies=[Depends(admin_only)])
async def update_payment_status(
    payment_id: uuid.UUID,
    data: PaymentUpdateStatusRequest,
    db: AsyncSession = Depends(get_db),
):
    """Cập nhật trạng thái thanh toán"""
    return await payment_service.update_payment_status(db, payment_id, data)


@router.post("/{payment_id}/vnpay-url", dependencies=[Depends(admin_only)])
async def generate_vnpay_url(
    payment_id: uuid.UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Tạo URL thanh toán VNPay"""
    payment = await payment_service.get_payment_by_id(db, payment_id)
    if not payment:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Thanh toán không tồn tại")
        
    amount_vnd = int(payment.amount)
    
    # VNPay requires order_id to be a string. We can use string representation of UUID
    # or a part of it if length is restricted. UUID is 36 chars, VNPay allows max 100 chars.
    order_id = str(payment.id)
    
    # Client IP
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    vnp_params = {
        "vnp_Amount": amount_vnd * 100, # VNPay requires amount * 100
        "vnp_CreateDate": datetime.now().strftime("%Y%m%d%H%M%S"),
        "vnp_CurrCode": "VND",
        "vnp_IpAddr": client_ip,
        "vnp_Locale": "vn",
        "vnp_OrderInfo": f"Thanh toan hoa don {order_id[:8]}",
        "vnp_OrderType": "billpayment",
        "vnp_TxnRef": f"{order_id}_{int(datetime.now().timestamp())}", # Make TxnRef unique per generation
    }
    
    payment_url = vnpay_helper.get_payment_url(vnp_params)
    return {"paymentUrl": payment_url}


@router.get("/vnpay-ipn")
async def vnpay_ipn(request: Request, db: AsyncSession = Depends(get_db)):
    """Webhook IPN từ VNPay"""
    query_params = dict(request.query_params)
    
    if not vnpay_helper.validate_response(query_params.copy()):
        return {"RspCode": "97", "Message": "Invalid Checksum"}
        
    try:
        txn_ref = query_params.get("vnp_TxnRef")
        if not txn_ref:
            return {"RspCode": "01", "Message": "Order not found"}
            
        # Extract original payment_id from TxnRef (format: payment_id_timestamp)
        payment_id_str = txn_ref.split('_')[0]
        payment_id = uuid.UUID(payment_id_str)
        
        payment = await payment_service.get_payment_by_id(db, payment_id)
        if not payment:
            return {"RspCode": "01", "Message": "Order not found"}
            
        amount = int(query_params.get("vnp_Amount", 0)) / 100
        if int(payment.amount) != amount:
            return {"RspCode": "04", "Message": "Invalid amount"}
            
        if payment.status == PaymentStatus.paid:
            return {"RspCode": "02", "Message": "Order already confirmed"}
            
        rsp_code = query_params.get("vnp_ResponseCode")
        if rsp_code == "00":
            # Success
            update_data = PaymentUpdateStatusRequest(
                status=PaymentStatus.paid,
                transaction_id=query_params.get("vnp_TransactionNo")
            )
            await payment_service.update_payment_status(db, payment.id, update_data)
            return {"RspCode": "00", "Message": "Confirm Success"}
        else:
            # Failed
            return {"RspCode": "00", "Message": "Payment failed"}
            
    except Exception as e:
        print(f"IPN Error: {e}")
        return {"RspCode": "99", "Message": "Unknown error"}


@router.get("/{payment_id}", response_model=PaymentResponse, dependencies=[Depends(admin_only)])
async def get_payment(
    payment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Lấy chi tiết thanh toán (Dùng cho frontend polling)"""
    payment = await payment_service.get_payment_by_id(db, payment_id)
    if not payment:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Thanh toán không tồn tại")
    return payment
