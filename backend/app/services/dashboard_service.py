from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from app.models.pet import Pet
from app.models.veterinarian import Veterinarian
from app.models.appointment import Appointment, AppointmentStatus
from app.models.payment import Payment, PaymentStatus
from app.models.service import Service

async def get_dashboard_stats(db: AsyncSession, period: str = "7 days"):
    # Đếm tổng số lượng cơ bản
    count_users = await db.scalar(select(func.count()).select_from(User))
    count_vets = await db.scalar(select(func.count()).select_from(Veterinarian))
    count_pets = await db.scalar(select(func.count()).select_from(Pet))
    count_owners = await db.scalar(
        select(func.count()).select_from(User).where(User.role == UserRole.owner)
    )
    count_services = await db.scalar(
        select(func.count()).select_from(Service).where(Service.is_active == True)
    )

    # Thống kê lịch hẹn
    count_appointments = await db.scalar(select(func.count()).select_from(Appointment))
    count_pending = await db.scalar(
        select(func.count()).select_from(Appointment)
        .where(Appointment.status == AppointmentStatus.pending)
    )
    count_confirmed = await db.scalar(
        select(func.count()).select_from(Appointment)
        .where(Appointment.status == AppointmentStatus.confirmed)
    )
    count_completed = await db.scalar(
        select(func.count()).select_from(Appointment)
        .where(Appointment.status == AppointmentStatus.completed)
    )
    count_cancelled = await db.scalar(
        select(func.count()).select_from(Appointment)
        .where(Appointment.status == AppointmentStatus.cancelled)
    )

    # Thống kê thanh toán
    total_revenue = await db.scalar(
        select(func.sum(Payment.amount))
        .where(Payment.status == PaymentStatus.paid)
    )
    count_payments_pending = await db.scalar(
        select(func.count()).select_from(Payment)
        .where(Payment.status == PaymentStatus.pending)
    )

    # Thống kê time-series (Lịch hẹn)
    today = datetime.now(timezone.utc).date()
    app_series = {}
    categories = []
    start_date_app = None

    if period == "30 days":
        date_range = [today - timedelta(days=i) for i in range(29, -1, -1)]
        app_series = {str(d): 0 for d in date_range}
        categories = [d.strftime('%d/%m') for d in date_range]
        start_date_app = datetime.combine(date_range[0], datetime.min.time()).replace(tzinfo=timezone.utc)
    elif period == "3 months":
        # last 12 weeks
        date_range = [today - timedelta(days=i*7) for i in range(11, -1, -1)]
        for dt in date_range:
            y, w, _ = dt.isocalendar()
            key = f"{y}-W{w:02d}"
            app_series[key] = 0
            categories.append(f"Tuần {w}")
        start_date_app = datetime.combine(date_range[0] - timedelta(days=date_range[0].weekday()), datetime.min.time()).replace(tzinfo=timezone.utc)
    elif period == "1 year":
        # last 12 months
        current_month = today.replace(day=1)
        last_12_months = []
        for _ in range(12):
            last_12_months.insert(0, current_month)
            prev_month_day = current_month - timedelta(days=1)
            current_month = prev_month_day.replace(day=1)
        app_series = {m.strftime('%Y-%m'): 0 for m in last_12_months}
        categories = [m.strftime('Th%m') for m in last_12_months]
        start_date_app = datetime.combine(last_12_months[0], datetime.min.time()).replace(tzinfo=timezone.utc)
    else: # 7 days
        date_range = [today - timedelta(days=i) for i in range(6, -1, -1)]
        app_series = {str(d): 0 for d in date_range}
        categories = [d.strftime('%d/%m') for d in date_range]
        start_date_app = datetime.combine(date_range[0], datetime.min.time()).replace(tzinfo=timezone.utc)

    stmt_app = select(Appointment.created_at).where(Appointment.created_at >= start_date_app)
    res_app = await db.execute(stmt_app)
    for row in res_app.all():
        if row[0]:
            if period in ["7 days", "30 days"]:
                key = str(row[0].date())
            elif period == "3 months":
                y, w, _ = row[0].isocalendar()
                key = f"{y}-W{w:02d}"
            elif period == "1 year":
                key = row[0].strftime('%Y-%m')
            else:
                key = str(row[0].date())
                
            if key in app_series:
                app_series[key] += 1
                
    # Thống kê time-series (Tăng trưởng khách hàng 6 tháng qua)
    current_month = today.replace(day=1)
    last_6_months = []
    for _ in range(6):
        last_6_months.insert(0, current_month)
        prev_month_day = current_month - timedelta(days=1)
        current_month = prev_month_day.replace(day=1)
        
    growth_series = {m.strftime('%Y-%m'): 0 for m in last_6_months}
    start_month = datetime.combine(last_6_months[0], datetime.min.time()).replace(tzinfo=timezone.utc)
    stmt_users = select(User.created_at).where(User.role == UserRole.owner).where(User.created_at >= start_month)
    res_users = await db.execute(stmt_users)
    for row in res_users.all():
        if row[0]:
            month_str = row[0].strftime('%Y-%m')
            if month_str in growth_series:
                growth_series[month_str] += 1

    return {
        "total_users": count_users or 0,
        "total_vets": count_vets or 0,
        "total_pets": count_pets or 0,
        "total_owners": count_owners or 0,
        "total_services": count_services or 0,
        # Lịch hẹn
        "total_appointments": count_appointments or 0,
        "appointments_pending": count_pending or 0,
        "appointments_confirmed": count_confirmed or 0,
        "appointments_completed": count_completed or 0,
        "appointments_cancelled": count_cancelled or 0,
        # Doanh thu
        "total_revenue": float(total_revenue) if total_revenue else 0,
        "payments_pending": count_payments_pending or 0,
        # KPI cards
        "recent_stats": [
            {"label": "Người dùng", "value": count_users or 0},
            {"label": "Thú cưng", "value": count_pets or 0},
            {"label": "Bác sĩ", "value": count_vets or 0},
            {"label": "Lịch hẹn", "value": count_appointments or 0},
        ],
        # Charts Data
        "appointment_chart": {
            "categories": categories,
            "data": list(app_series.values())
        },
        "growth_chart": {
            "categories": [m.strftime('Th%m') for m in last_6_months],
            "data": list(growth_series.values())
        }
    }
