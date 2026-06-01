"""
API routes — Doctor: Thống kê cá nhân.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import vet_or_admin
from app.models.user import User
from app.schemas.doctor_stats import DoctorStatsResponse
from app.services import doctor_stats_service

router = APIRouter(prefix="/doctor/stats", tags=["Doctor - Statistics"])


@router.get(
    "",
    response_model=DoctorStatsResponse,
    summary="Thống kê tổng hợp cá nhân",
)
async def get_my_stats(
    current_user: User = Depends(vet_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """Lấy dữ liệu thống kê cá nhân cho bác sĩ:
    - Tổng số lịch hẹn (theo trạng thái)
    - Lịch hẹn tuần này / tháng này
    - Số pet duy nhất đã khám
    - Tổng bệnh án
    - Doanh thu tổng / tháng này
    - Top 5 dịch vụ phổ biến
    """
    return await doctor_stats_service.get_doctor_stats(db, current_user)
