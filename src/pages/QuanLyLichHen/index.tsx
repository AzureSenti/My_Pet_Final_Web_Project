import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import '../TrangChu/components/style.less'; // Inherit base dashboard layout
import './style.less';

const MOCK_APPOINTMENTS = [
	{
		id: '1',
		petName: 'Buddy',
		petBreed: 'Golden Retriever',
		petAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150',
		ownerName: 'Nguyễn Văn An',
		vetName: 'Bs. Hoàng Nam',
		service: 'Checkup',
		time: '09:00 AM',
		status: 'confirmed',
		statusText: 'Đã xác nhận',
	},
	{
		id: '2',
		petName: 'Luna',
		petBreed: 'Mèo Anh Lông Ngắn',
		petAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150',
		ownerName: 'Trần Thị Bé',
		vetName: 'Bs. Thanh Hằng',
		service: 'Grooming',
		time: '10:30 AM',
		status: 'pending',
		statusText: 'Chờ xác nhận',
	},
	{
		id: '3',
		petName: 'Milo',
		petBreed: 'Poodle',
		petAvatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150',
		ownerName: 'Lê Minh Tâm',
		vetName: 'Bs. Quốc Bảo',
		service: 'Vaccination',
		time: '02:15 PM',
		status: 'completed',
		statusText: 'Hoàn thành',
	},
	{
		id: '4',
		petName: 'Oscar',
		petBreed: 'Mèo Xiêm',
		petAvatar: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=150',
		ownerName: 'Nguyễn Thúy Chi',
		vetName: 'Bs. Thanh Hằng',
		service: 'Checkup',
		time: '04:00 PM',
		status: 'cancelled',
		statusText: 'Hủy',
	},
];

const QuanLyLichHen: React.FC = () => {
	const [activeTab, setActiveTab] = useState('Tất cả');
	const TABS = ['Tất cả', 'Sáng', 'Chiều'];

	const getStatusBadge = (status: string, text: string) => {
		switch (status) {
			case 'confirmed': return <span className="status-badge badge-confirmed">{text}</span>;
			case 'pending': return <span className="status-badge badge-pending">{text}</span>;
			case 'completed': return <span className="status-badge badge-completed">{text}</span>;
			case 'cancelled': return <span className="status-badge badge-cancelled">{text}</span>;
			default: return <span className="status-badge badge-cancelled">{text}</span>;
		}
	};

	return (
		<div className="petcare-dashboard appointment-dashboard">
			{/* Top Bar matching dashboard */}
			<div className="pc-header">
				<div className="pc-header-left"></div>
				<div className="pc-header-center">
					<div className="pc-header-search">
						<Search size={18} strokeWidth={1.75} className="search-icon" />
						<input type="text" placeholder="Tìm kiếm lịch hẹn..." />
					</div>
				</div>
				<div className="pc-header-actions">
					<div className="pc-user-profile">
						<div className="pc-user-avatar">
							<img src="https://i.pravatar.cc/150?img=9" alt="User" />
						</div>
						<div className="pc-user-info">
							<span className="pc-user-name">Admin Sarah</span>
							<span className="pc-user-role">Manager</span>
						</div>
					</div>
				</div>
			</div>

			<div className="appointment-content">
				{/* Header Section */}
				<div className="ap-header-row">
					<div className="ap-title-area">
						<h1>Lịch hẹn chăm sóc</h1>
						<p>Theo dõi và điều phối các lượt thăm khám trong ngày hôm nay.</p>
					</div>
					<div className="ap-action-area">
						<button className="btn-outline">
							<Filter size={16} />
							Lọc lịch hẹn
						</button>
						<button className="btn-primary">
							<Plus size={16} />
							Thêm lịch hẹn mới
						</button>
					</div>
				</div>

				{/* Stat Cards */}
				<div className="ap-stats-row">
					<div className="stat-card">
						<div className="stat-icon icon-yellow">
							<CalendarIcon size={24} />
						</div>
						<div className="stat-info">
							<span className="stat-label">TỔNG LỊCH HẸN HÔM NAY</span>
							<span className="stat-value">24</span>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon icon-teal">
							<Clock size={24} />
						</div>
						<div className="stat-info">
							<span className="stat-label">ĐANG CHỜ</span>
							<span className="stat-value">08</span>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon icon-pink">
							<CheckCircle size={24} />
						</div>
						<div className="stat-info">
							<span className="stat-label">ĐÃ HOÀN THÀNH</span>
							<span className="stat-value">16</span>
						</div>
					</div>
				</div>

				{/* Layout 2 Columns */}
				<div className="ap-layout">
					{/* Left Column (70%) */}
					<div className="ap-col-left">
						<div className="table-card">
							<div className="table-tabs">
								{TABS.map(tab => (
									<button 
										key={tab} 
										className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
										onClick={() => setActiveTab(tab)}
									>
										{tab}
									</button>
								))}
							</div>

							<div className="table-wrapper">
								<table className="ap-table">
									<thead>
										<tr>
											<th>THÚ CƯNG</th>
											<th>CHỦ SỞ HỮU</th>
											<th>BÁC SĨ</th>
											<th>DỊCH VỤ / GIỜ</th>
											<th>TRẠNG THÁI</th>
											<th>THAO TÁC</th>
										</tr>
									</thead>
									<tbody>
										{MOCK_APPOINTMENTS.map(item => (
											<tr key={item.id}>
												<td>
													<div className="cell-pet">
														<img src={item.petAvatar} alt={item.petName} />
														<div>
															<div className="pet-name">{item.petName}</div>
															<div className="pet-breed">{item.petBreed}</div>
														</div>
													</div>
												</td>
												<td>
													<span className="cell-text">{item.ownerName}</span>
												</td>
												<td>
													<span className="cell-text">{item.vetName}</span>
												</td>
												<td>
													<div className="cell-service">
														<div className="service-name">{item.service}</div>
														<div className="service-time">{item.time}</div>
													</div>
												</td>
												<td>
													<div className="cell-status">
														{getStatusBadge(item.status, item.statusText)}
														{item.status === 'cancelled' && (
															<span className="status-note">Lịch hẹn đã...</span>
														)}
													</div>
												</td>
												<td>
													<div className="cell-actions">
														{item.status === 'pending' ? (
															<>
																<button className="btn-action btn-confirm">Xác nhận</button>
																<button className="btn-action btn-text">Sửa</button>
															</>
														) : (
															<button className="btn-action btn-text">Chi tiết</button>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Right Column (30%) */}
					<div className="ap-col-right">
						{/* Widget 1: Mini Calendar */}
						<div className="widget-card">
							<div className="calendar-header">
								<h3>Tháng 10, 2023</h3>
								<div className="calendar-nav">
									<button>&lt;</button>
									<button>&gt;</button>
								</div>
							</div>
							<div className="calendar-grid">
								<div className="cal-day-header">T2</div>
								<div className="cal-day-header">T3</div>
								<div className="cal-day-header">T4</div>
								<div className="cal-day-header">T5</div>
								<div className="cal-day-header">T6</div>
								<div className="cal-day-header">T7</div>
								<div className="cal-day-header">CN</div>
								
								{/* Placeholder days */}
								<div className="cal-day empty"></div>
								<div className="cal-day empty"></div>
								<div className="cal-day empty"></div>
								<div className="cal-day">1</div>
								<div className="cal-day">2</div>
								<div className="cal-day">3</div>
								<div className="cal-day">4</div>
								
								<div className="cal-day">5</div>
								<div className="cal-day">6</div>
								<div className="cal-day">7</div>
								<div className="cal-day">8</div>
								<div className="cal-day">9</div>
								<div className="cal-day">10</div>
								<div className="cal-day active">11</div>
								
								<div className="cal-day">12</div>
								<div className="cal-day">13</div>
								<div className="cal-day">14</div>
								<div className="cal-day">15</div>
								<div className="cal-day">16</div>
								<div className="cal-day">17</div>
								<div className="cal-day">18</div>
							</div>
						</div>

						{/* Widget 2: Tip of the day */}
						<div className="widget-card tip-card">
							<h3>Mẹo hôm nay 🐾</h3>
							<p>
								"Sắp xếp lịch tiêm chủng vào buổi sáng giúp bác sĩ có nhiều
								thời gian theo dõi phản ứng sau tiêm hơn."
							</p>
							<a href="#">Xem thêm gợi ý &rarr;</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuanLyLichHen;
