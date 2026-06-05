"""
Pydantic schemas cho Doctor — Thống kê cá nhân.
"""
from typing import List, Optional
from pydantic import BaseModel


class ServiceStatItem(BaseModel):
    """Thống kê 1 dịch vụ."""
    service_name: str
    count: int


class AppointmentStatusCount(BaseModel):
    """Số lượng lịch hẹn theo trạng thái."""
    pending: int = 0
    confirmed: int = 0
    completed: int = 0
    cancelled: int = 0


class DoctorStatsResponse(BaseModel):
    """Thống kê tổng hợp cho bác sĩ."""
    # Tổng quan
    total_appointments: int
    appointments_by_status: AppointmentStatusCount
    # Khoảng thời gian
    appointments_this_week: int
    appointments_this_month: int
    # Bệnh nhân
    total_unique_pets: int
    total_medical_records: int
    # Doanh thu
    total_revenue: float
    revenue_this_month: float
    # Top dịch vụ
    top_services: List[ServiceStatItem]
