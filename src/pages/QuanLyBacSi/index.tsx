import React from 'react';
import {
	DeleteOutlined
} from '@ant-design/icons';
import { 
	Search, 
	ClipboardList, 
	Clock, 
	ShieldCheck, 
	Asterisk, 
	Filter, 
	Calendar,
	Award,
	GraduationCap,
	UserPlus,
	Stethoscope,
	Plus
} from 'lucide-react';
import '../TrangChu/components/style.less'; // Import pc-header styles
import './style.less';

const QuanLyBacSi: React.FC = () => {
	return (
		<div className="petcare-dashboard">
			{/* Header giống trang tổng quan */}
			<div className="pc-header">
				<div className="pc-header-left">
				</div>
				<div className="pc-header-center">
					<div className="pc-header-search">
						<Search size={18} strokeWidth={1.75} className="search-icon" />
						<input type="text" placeholder="Tìm kiếm bác sĩ, hồ sơ..." />
					</div>
				</div>
				<div className="pc-header-actions">
					<div className="pc-user-profile">
						<div className="pc-user-avatar">
							<img src="https://i.pravatar.cc/150?img=12" alt="User Avatar" />
						</div>
						<div className="pc-user-info">
							<span className="pc-user-name">Nguyễn Văn A</span>
							<span className="pc-user-role">Administrator</span>
						</div>
					</div>
				</div>
			</div>

			<div className="doc-page-content">
				{/* Page Header */}
				<div className="pet-title-row">
					<div className="pet-title-left">
						<div className="pet-title-icon">
							<Stethoscope size={22} strokeWidth={2.5} />
						</div>
						<div>
							<h1>Quản lý bác sĩ</h1>
							<p className="pet-subtitle">
								Thêm mới, cập nhật hồ sơ chuyên môn, theo dõi trạng thái hoạt động và quản lý chứng chỉ hành nghề của đội ngũ bác sĩ.
							</p>
						</div>
					</div>
					<div className="pet-filter-pills">
						<button className="um-add-btn">
							<Plus size={18} strokeWidth={2.5} /> Thêm bác sĩ mới
						</button>
					</div>
				</div>

				{/* Toolbar Row */}
				<div className="toolbar-row">
					<button className="toolbar-btn filter">
						<Filter size={18} /> Bộ lọc bác sĩ
					</button>
					<button className="toolbar-btn schedule">
						<Calendar size={18} /> Lịch trình tổng quát
					</button>
				</div>

				{/* 1. Khu vực Thống kê (Metrics Row) */}
				<div className="metrics-row">
					<div className="metric-card applications">
						<div className="content-left">
							<h2>Hồ Sơ Ứng Tuyển Mới</h2>
							<p>4 bác sĩ thú y đang chờ duyệt hồ sơ</p>
							<button className="btn-olive">Duyệt Ngay</button>
						</div>
						<div className="icon-right" style={{ position: 'relative' }}>
							<ClipboardList size={48} strokeWidth={1.5} color="#F59E0B" />
							<Clock size={24} color="#D97706" style={{ position: 'absolute', bottom: -5, right: -5, background: '#FFF', borderRadius: '50%' }} />
						</div>
					</div>
					
					<div className="metric-card active-doctors">
						<div className="icon-top" style={{ color: '#10B981', background: '#D1FAE5', padding: '8px', borderRadius: '50%', display: 'inline-flex' }}>
							<ShieldCheck size={24} />
						</div>
						<h1>42</h1>
						<p>Bác Sĩ Đang Hoạt Động</p>
					</div>

					<div className="metric-card on-duty">
						<div className="icon-top" style={{ color: '#EF4444', background: '#FEE2E2', padding: '8px', borderRadius: '50%', display: 'inline-flex' }}>
							<Asterisk size={24} />
						</div>
						<h1>12</h1>
						<p>Đang Trực Hôm Nay</p>
					</div>
				</div>

				{/* 2. Lưới danh sách Bác sĩ (Doctor Cards Grid) */}
				<div className="doctor-grid">
					{/* THẺ 1: Bác sĩ đã kích hoạt */}
					<div className="doctor-card">
						<div className="card-header">
							<div className="avatar-wrapper">
								<img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="avatar-img" />
							</div>
							<div className="info">
								<h3>Dr. Elena Rodriguez</h3>
								<p className="specialty" style={{ color: '#E11D48' }}>Feline Specialist</p>
							</div>
							<div style={{ position: 'absolute', top: 0, right: 0 }}>
								<span className="badge" style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
									Active
								</span>
							</div>
						</div>

						<div className="card-body">
							<div className="info-row">
								<Award size={18} className="icon" />
								<span>8 năm kinh nghiệm</span>
							</div>
							<div className="info-row">
								<Calendar size={18} className="icon" />
								<span>Thứ 2, 4, 6 (9am - 5pm)</span>
							</div>
							<div className="badges" style={{ marginTop: '8px' }}>
								<span className="badge">Phẫu thuật</span>
								<span className="badge">Dinh dưỡng</span>
							</div>
						</div>

						<div className="card-footer" style={{ gap: '12px' }}>
							<button className="btn-schedule" style={{ flex: '0 0 85%' }}>
								Quản lý lịch trình
							</button>
							<button className="btn-icon danger" style={{ flex: '1' }}>
								<DeleteOutlined />
							</button>
						</div>
					</div>

					{/* THẺ 2: Hồ sơ đang chờ duyệt */}
					<div className="doctor-card pending">
						<div className="card-header">
							<div className="avatar-wrapper">
								<img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="avatar-img" />
							</div>
							<div className="info">
								<h3>Dr. Julian Moore</h3>
								<p className="specialty" style={{ color: '#6B7280' }}>Exotic Pets Expert</p>
							</div>
						</div>

						<div className="card-body">
							<div className="info-row">
								<Award size={18} className="icon" />
								<span>3 năm kinh nghiệm</span>
							</div>
							<div className="info-row">
								<GraduationCap size={18} className="icon" />
								<span>Đại học Thú y UC Davis</span>
							</div>
						</div>

						<div className="card-footer" style={{ flexDirection: 'column', gap: '0' }}>
							<button className="btn-approve">
								Duyệt hồ sơ
							</button>
							<span className="pending-link">
								Xem toàn bộ hồ sơ
							</span>
						</div>
					</div>

					{/* THẺ 3: Thẻ mời bác sĩ mới */}
					<div className="doctor-card invite-card">
						<div className="invite-icon">
							<UserPlus size={32} />
						</div>
						<h3>Mời bác sĩ thú y</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuanLyBacSi;
