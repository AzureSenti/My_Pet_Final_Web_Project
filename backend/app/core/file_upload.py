"""
Tiện ích upload file cho hệ thống nhắn tin.
Lưu file vào thư mục uploads/messages/ trên server.
"""
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

# ─────────────── Cấu hình ───────────────

# Thư mục lưu file upload — tính từ root project (backend/app)
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads" / "messages"

# File types được chấp nhận
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOC_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_DOC_TYPES

# Giới hạn kích thước: 10 MB
MAX_FILE_SIZE = 10 * 1024 * 1024  # bytes


# ─────────────── Functions ───────────────

def _ensure_upload_dir() -> None:
    """Tạo thư mục upload nếu chưa tồn tại."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _get_content_type_category(content_type: str) -> str:
    """Phân loại file: 'image' hoặc 'file'."""
    if content_type in ALLOWED_IMAGE_TYPES:
        return "image"
    return "file"


async def save_upload_file(upload_file: UploadFile) -> dict:
    """
    Lưu file upload và trả về metadata.

    Returns:
        dict với keys: file_url, file_name, file_type, file_size, message_type
    """
    # Validate content type
    if upload_file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loại file không được hỗ trợ: {upload_file.content_type}. "
                   f"Chấp nhận: jpg, png, gif, webp, pdf, doc, docx, xls, xlsx",
        )

    # Đọc nội dung file để kiểm tra kích thước
    content = await upload_file.read()
    file_size = len(content)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File quá lớn ({file_size / 1024 / 1024:.1f} MB). Giới hạn: 10 MB.",
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File rỗng.",
        )

    # Tạo tên file unique để tránh trùng
    ext = Path(upload_file.filename).suffix if upload_file.filename else ""
    unique_name = f"{uuid.uuid4().hex}{ext}"

    _ensure_upload_dir()

    # Ghi file
    file_path = UPLOAD_DIR / unique_name
    with open(file_path, "wb") as f:
        f.write(content)

    # URL tương đối — sẽ serve qua StaticFiles
    file_url = f"/uploads/messages/{unique_name}"

    return {
        "file_url": file_url,
        "file_name": upload_file.filename or unique_name,
        "file_type": upload_file.content_type,
        "file_size": file_size,
        "message_type": _get_content_type_category(upload_file.content_type),
    }
