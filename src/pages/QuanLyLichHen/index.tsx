import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import '../TrangChu/components/style.less'; // Inherit base dashboard layout
import HeaderProfile from '@/components/HeaderProfile';
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
	const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [filterForm] = Form.useForm();

	const [currentMonth, setCurrentMonth] = useState(10);
	const [selectedDay, setSelectedDay] = useState(11);

	// Các filter state
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState('Tất cả');
	const [serviceFilter, setServiceFilter] = useState('Tất cả');
	const [vetFilter, setVetFilter] = useState('Tất cả');

	const TABS = ['Tất cả', 'Sáng', 'Chiều'];

	const handleAddAppointment = (values: any) => {
		const newAppointment = {
			id: String(appointments.length + 1),
			petName: values.petName,
			petBreed: values.petBreed || 'Chưa xác định',
			petAvatar: `https://images.unsplash.com/photo-${[
				'1543466835-00a7907e9de1',
				'1514888286974-6c03e2ca1dba',
				'1583511655857-d19b40a7a54e',
				'1605568427561-40dd23c2acea'
			][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=150`,
			ownerName: values.ownerName,
			vetName: values.vetName,
			service: values.service,
			time: values.time,
			status: 'pending',
			statusText: 'Chờ xác nhận',
		};
		setAppointments([newAppointment, ...appointments]);
		setIsModalOpen(false);
		form.resetFields();
		message.success('Thêm lịch hẹn mới thành công!');
	};

	const handleConfirmAppointment = (id: string) => {
		setAppointments(appointments.map(ap => ap.id === id ? { ...ap, status: 'confirmed', statusText: 'Đã xác nhận' } : ap));
		message.success('Đã xác nhận lịch hẹn thành công!');
	};

	const handleCancelAppointment = (id: string) => {
		setAppointments(appointments.map(ap => ap.id === id ? { ...ap, status: 'cancelled', statusText: 'Hủy' } : ap));
		message.success('Đã hủy lịch hẹn!');
	};

	const handlePlaceholder = (featureName: string) => {
		message.info(`Chức năng "${featureName}" đang được phát triển.`);
	};

	const handleApplyFilters = (values: any) => {
		setStatusFilter(values.status || 'Tất cả');
		setServiceFilter(values.service || 'Tất cả');
		setVetFilter(values.vetName || 'Tất cả');
		setIsFilterModalOpen(false);
		message.success('Đã áp dụng bộ lọc!');
	};

	const handleResetFilters = () => {
		filterForm.resetFields();
		setStatusFilter('Tất cả');
		setServiceFilter('Tất cả');
		setVetFilter('Tất cả');
		setIsFilterModalOpen(false);
		message.info('Đã xóa tất cả bộ lọc');
	};

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
						<input 
							type="text" 
							placeholder="Tìm kiếm lịch hẹn..." 
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
					</div>
				</div>
				<div className="pc-header-actions">
					<HeaderProfile />
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
						<button 
							className={`btn-outline ${(statusFilter !== 'Tất cả' || serviceFilter !== 'Tất cả' || vetFilter !== 'Tất cả') ? 'active-filter' : ''}`}
							onClick={() => setIsFilterModalOpen(true)}
							style={{
								borderColor: (statusFilter !== 'Tất cả' || serviceFilter !== 'Tất cả' || vetFilter !== 'Tất cả') ? '#8B7355' : undefined,
								background: (statusFilter !== 'Tất cả' || serviceFilter !== 'Tất cả' || vetFilter !== 'Tất cả') ? '#F5F0E8' : undefined
							}}
						>
							<Filter size={16} />
							Lọc lịch hẹn {(statusFilter !== 'Tất cả' || serviceFilter !== 'Tất cả' || vetFilter !== 'Tất cả') && '•'}
						</button>
						<button className="btn-primary" onClick={() => setIsModalOpen(true)}>
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
							<span className="stat-value">{appointments.length}</span>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon icon-teal">
							<Clock size={24} />
						</div>
						<div className="stat-info">
							<span className="stat-label">ĐANG CHỜ</span>
							<span className="stat-value">{appointments.filter(a => a.status === 'pending').length}</span>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon icon-pink">
							<CheckCircle size={24} />
						</div>
						<div className="stat-info">
							<span className="stat-label">ĐÃ HOÀN THÀNH</span>
							<span className="stat-value">{appointments.filter(a => a.status === 'completed' || a.status === 'confirmed').length}</span>
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
										{appointments.filter(item => {
											// 1. Lọc theo tab Sáng/Chiều
											if (activeTab !== 'Tất cả') {
												const isPm = item.time.toLowerCase().includes('pm');
												if (activeTab === 'Sáng' && isPm) return false;
												if (activeTab === 'Chiều' && !isPm) return false;
											}

											// 2. Lọc theo thanh tìm kiếm (tên thú cưng, giống thú cưng, tên chủ nuôi)
											if (searchText) {
												const query = searchText.toLowerCase();
												const matchesPet = item.petName.toLowerCase().includes(query);
												const matchesBreed = item.petBreed.toLowerCase().includes(query);
												const matchesOwner = item.ownerName.toLowerCase().includes(query);
												if (!matchesPet && !matchesBreed && !matchesOwner) return false;
											}

											// 3. Lọc theo trạng thái
											if (statusFilter !== 'Tất cả' && item.status !== statusFilter) return false;

											// 4. Lọc theo dịch vụ
											if (serviceFilter !== 'Tất cả' && item.service !== serviceFilter) return false;

											// 5. Lọc theo bác sĩ
											if (vetFilter !== 'Tất cả' && item.vetName !== vetFilter) return false;

											return true;
										}).map(item => (
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
																<button className="btn-action btn-confirm" onClick={() => handleConfirmAppointment(item.id)}>Xác nhận</button>
																<button className="btn-action btn-text" onClick={() => handlePlaceholder('Sửa lịch hẹn')}>Sửa</button>
																<button className="btn-action btn-text" style={{ color: '#E11D48' }} onClick={() => handleCancelAppointment(item.id)}>Hủy</button>
															</>
														) : (
															<>
																<button className="btn-action btn-text" onClick={() => handlePlaceholder('Chi tiết lịch hẹn')}>Chi tiết</button>
																{item.status === 'confirmed' && (
																	<button className="btn-action btn-text" style={{ color: '#E11D48' }} onClick={() => handleCancelAppointment(item.id)}>Hủy</button>
																)}
															</>
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
								<h3>Tháng {currentMonth}, 2023</h3>
								<div className="calendar-nav">
									<button onClick={() => setCurrentMonth(prev => prev === 1 ? 12 : prev - 1)}>&lt;</button>
									<button onClick={() => setCurrentMonth(prev => prev === 12 ? 1 : prev + 1)}>&gt;</button>
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
								
								{/* Dynamic days */}
								{Array(3).fill(null).map((_, i) => (
									<div key={`empty-${i}`} className="cal-day empty"></div>
								))}
								{Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
									<div 
										key={day} 
										className={`cal-day ${selectedDay === day ? 'active' : ''}`}
										onClick={() => { 
											setSelectedDay(day); 
											message.info(`Đã chọn ngày ${day} tháng ${currentMonth}`); 
										}}
									>
										{day}
									</div>
								))}
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

			{/* Modal Thêm lịch hẹn mới */}
			<Modal
				title={<h3>Thêm lịch hẹn mới 📅</h3>}
				visible={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				okText="Lưu lại"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical" onFinish={handleAddAppointment}>
					<Form.Item
						name="petName"
						label="Tên thú cưng"
						rules={[{ required: true, message: 'Vui lòng nhập tên thú cưng!' }]}
					>
						<Input placeholder="Ví dụ: Buddy, Luna" />
					</Form.Item>
					<Form.Item
						name="petBreed"
						label="Giống / Loài"
						rules={[{ required: true, message: 'Vui lòng nhập giống hoặc loài!' }]}
					>
						<Input placeholder="Ví dụ: Golden Retriever, Mèo Anh lông ngắn" />
					</Form.Item>
					<Form.Item
						name="ownerName"
						label="Họ và tên chủ nuôi"
						rules={[{ required: true, message: 'Vui lòng nhập họ tên chủ nuôi!' }]}
					>
						<Input placeholder="Ví dụ: Nguyễn Văn An" />
					</Form.Item>
					<Form.Item
						name="vetName"
						label="Bác sĩ phụ trách"
						rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}
						initialValue="Bs. Hoàng Nam"
					>
						<Select>
							<Select.Option value="Bs. Hoàng Nam">Bs. Hoàng Nam</Select.Option>
							<Select.Option value="Bs. Thanh Hằng">Bs. Thanh Hằng</Select.Option>
							<Select.Option value="Bs. Quốc Bảo">Bs. Quốc Bảo</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="service"
						label="Dịch vụ"
						rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
						initialValue="Checkup"
					>
						<Select>
							<Select.Option value="Checkup">Khám tổng quát (Checkup)</Select.Option>
							<Select.Option value="Grooming">Làm đẹp & Tắm rửa (Grooming)</Select.Option>
							<Select.Option value="Vaccination">Tiêm phòng (Vaccination)</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="time"
						label="Thời gian (Giờ hẹn)"
						rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập giờ hẹn!' }]}
						initialValue="09:00 AM"
					>
						<Select>
							<Select.Option value="09:00 AM">09:00 AM (Sáng)</Select.Option>
							<Select.Option value="10:30 AM">10:30 AM (Sáng)</Select.Option>
							<Select.Option value="02:15 PM">02:15 PM (Chiều)</Select.Option>
							<Select.Option value="04:00 PM">04:00 PM (Chiều)</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal Lọc lịch hẹn */}
			<Modal
				title={<h3>Bộ lọc lịch hẹn 🔍</h3>}
				visible={isFilterModalOpen}
				onCancel={() => setIsFilterModalOpen(false)}
				footer={[
					<Button key="reset" onClick={handleResetFilters}>
						Xóa bộ lọc
					</Button>,
					<Button key="submit" type="primary" onClick={() => filterForm.submit()}>
						Áp dụng
					</Button>
				]}
				destroyOnClose
			>
				<Form 
					form={filterForm} 
					layout="vertical" 
					onFinish={handleApplyFilters}
					initialValues={{
						status: statusFilter,
						service: serviceFilter,
						vetName: vetFilter
					}}
				>
					<Form.Item name="status" label="Trạng thái lịch hẹn">
						<Select>
							<Select.Option value="Tất cả">Tất cả</Select.Option>
							<Select.Option value="pending">Chờ xác nhận (Pending)</Select.Option>
							<Select.Option value="confirmed">Đã xác nhận (Confirmed)</Select.Option>
							<Select.Option value="completed">Hoàn thành (Completed)</Select.Option>
							<Select.Option value="cancelled">Đã hủy (Cancelled)</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name="service" label="Loại dịch vụ">
						<Select>
							<Select.Option value="Tất cả">Tất cả</Select.Option>
							<Select.Option value="Checkup">Khám tổng quát (Checkup)</Select.Option>
							<Select.Option value="Grooming">Làm đẹp (Grooming)</Select.Option>
							<Select.Option value="Vaccination">Tiêm phòng (Vaccination)</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name="vetName" label="Bác sĩ phụ trách">
						<Select>
							<Select.Option value="Tất cả">Tất cả</Select.Option>
							<Select.Option value="Bs. Hoàng Nam">Bs. Hoàng Nam</Select.Option>
							<Select.Option value="Bs. Thanh Hằng">Bs. Thanh Hằng</Select.Option>
							<Select.Option value="Bs. Quốc Bảo">Bs. Quốc Bảo</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyLichHen;
