import React, { useState } from 'react';
import { Table, Progress, Modal, Form, Input, Select, message } from 'antd';
import { Search, Plus, MoreVertical, ChevronRight, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import '../TrangChu/components/style.less';
import HeaderProfile from '@/components/HeaderProfile';
import './style.less';

const MOCK_USERS = [
	{
		key: '1',
		id: '#PC-9021',
		name: 'James Wilson',
		type: 'Chủ nuôi',
		email: 'james.w@email.com',
		phone: '+1 (555) 123-4567',
		status: 'Hoạt động',
		joined: 'Oct 12, 2023',
		avatar: 'JW'
	},
	{
		key: '2',
		id: '#PC-4421',
		name: 'Dr. Emily Chen',
		type: 'Bác sĩ thú y',
		email: 'dr.chen@petcare.com',
		phone: '+1 (555) 987-6543',
		status: 'Hoạt động',
		joined: 'Jun 05, 2023',
		avatar: 'EC'
	},
	{
		key: '3',
		id: '#PC-1122',
		name: 'Michael Scott',
		type: 'Nhân viên',
		email: 'm.scott@office.com',
		phone: '+1 (555) 234-5678',
		status: 'Đình chỉ',
		joined: 'Jan 15, 2024',
		avatar: 'MS'
	},
	{
		key: '4',
		id: '#PC-7788',
		name: 'Sarah Miller',
		type: 'Chủ nuôi',
		email: 'sarah.m@gmail.com',
		phone: '+1 (555) 345-6789',
		status: 'Chờ duyệt',
		joined: 'Feb 28, 2024',
		avatar: 'SM'
	}
];

const FILTERS = ['Tất cả', 'Chủ nuôi', 'Bác sĩ thú y', 'Nhân viên', 'Chờ duyệt'];

const UserManagement: React.FC = () => {
	const [activeFilter, setActiveFilter] = useState('Tất cả');
	const [users, setUsers] = useState(MOCK_USERS);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const handleAddUser = (values: any) => {
		const newUser = {
			key: String(users.length + 1),
			id: `#PC-${Math.floor(1000 + Math.random() * 9000)}`,
			name: values.name,
			type: values.type,
			email: values.email,
			phone: values.phone || 'N/A',
			status: values.status || 'Hoạt động',
			joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
			avatar: values.name.trim().split(/\s+/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
		};
		setUsers([newUser, ...users]);
		setIsModalOpen(false);
		form.resetFields();
		message.success('Thêm người dùng mới thành công!');
	};

	const columns = [
		{
			title: 'Hồ sơ người dùng',
			dataIndex: 'name',
			key: 'name',
			render: (_: any, record: any) => (
				<div className="cell-user-profile">
					<div className="avatar">{record.avatar}</div>
					<div className="info">
						<span className="name">{record.name}</span>
						<span className="id">Member ID: {record.id}</span>
					</div>
				</div>
			)
		},
		{
			title: 'Loại tài khoản',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => {
				let typeClass = 'pet-owner';
				if (type === 'Bác sĩ thú y') typeClass = 'veterinarian';
				if (type === 'Nhân viên') typeClass = 'staff';
				return <span className={`cell-user-type ${typeClass}`}>{type}</span>;
			}
		},
		{
			title: 'Thông tin liên hệ',
			key: 'contact',
			render: (_: any, record: any) => (
				<div className="cell-contact">
					<span>{record.email}</span>
					<span>{record.phone}</span>
				</div>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => {
				let statusClass = 'active';
				if (status === 'Đình chỉ') statusClass = 'suspended';
				if (status === 'Chờ duyệt') statusClass = 'pending';
				return (
					<div className="cell-status">
						<div className={`dot ${statusClass}`} />
						<span>{status}</span>
					</div>
				);
			}
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'joined',
			key: 'joined',
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 80,
			align: 'center' as const,
			render: () => (
				<div className="cell-actions">
					<MoreVertical size={18} />
				</div>
			)
		}
	];

	const displayedUsers = users.filter(user => {
		if (activeFilter === 'Tất cả') return true;
		if (activeFilter === 'Chủ nuôi') return user.type === 'Chủ nuôi';
		if (activeFilter === 'Bác sĩ thú y') return user.type === 'Bác sĩ thú y';
		if (activeFilter === 'Nhân viên') return user.type === 'Nhân viên';
		if (activeFilter === 'Chờ duyệt') return user.status === 'Chờ duyệt';
		return true;
	});

	return (
		<div className="user-management-container petcare-dashboard">
			{/* Top Bar */}
			<div className="pc-header">
				<div className="pc-header-left" />
				<div className="pc-header-center">
					<div className="pc-header-search">
						<Search size={18} strokeWidth={1.75} className="search-icon" />
						<input type="text" placeholder="Tìm kiếm người dùng..." />
					</div>
				</div>
				<div className="pc-header-actions">
					<HeaderProfile />
				</div>
			</div>

			<div className="um-page-content">
				{/* Page Header */}
				<div className="um-header-row">
					<div className="um-title-left">
						<div className="um-title-icon">
							<Users size={22} strokeWidth={2.5} />
						</div>
						<div>
							<h1>Quản lý người dùng</h1>
							<p className="um-subtitle">
								Quản lý cộng đồng chủ nuôi, bác sĩ thú y và nhân viên tại một trung tâm duy nhất.
							</p>
						</div>
					</div>
					<div className="um-header-actions">
						<button className="um-add-btn" onClick={() => setIsModalOpen(true)}>
							<Plus size={18} strokeWidth={2.5} /> Thêm người dùng mới
						</button>
					</div>
				</div>

			{/* Filter Pills */}
			<div className="um-filters">
				{FILTERS.map(filter => (
					<div 
						key={filter} 
						className={`um-filter-pill ${activeFilter === filter ? 'active' : ''}`}
						onClick={() => setActiveFilter(filter)}
					>
						{filter}
					</div>
				))}
			</div>

			{/* Data Table */}
			<div className="um-table-container">
				<Table 
					columns={columns} 
					dataSource={displayedUsers} 
					pagination={false}
					rowKey="id"
				/>
				
				{/* Custom Pagination Footer */}
				<div className="um-pagination">
					<div className="um-pagination-info">
						Hiển thị 1 đến {displayedUsers.length} trong số {users.length} người dùng
					</div>
					<div className="um-pagination-controls">
						<button className="page-btn active">1</button>
						<button className="page-btn">2</button>
						<button className="page-btn">3</button>
						<span style={{ color: '#5A5550', margin: '0 4px' }}>...</span>
						<button className="page-btn">32</button>
						<button className="page-btn">
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			</div>

			{/* Dashboard Footer */}
			<div className="um-dashboard-footer">
				<div className="um-footer-card um-card-left">
					<div className="um-card-radial">
						<Progress 
							type="circle" 
							percent={75} 
							strokeColor="#A16207" // Dark yellow/olive
							trailColor="#FEF08A" 
							format={percent => <span className="radial-text">{percent}%</span>}
							width={100}
							strokeWidth={8}
						/>
						<span className="radial-subtext">ĐÃ XÁC THỰC</span>
					</div>
					<div className="um-card-content">
						<h3>Xu hướng Xác thực Người dùng</h3>
						<p>
							Kể từ khi áp dụng Huy hiệu Chuyên gia PetCare, tỷ lệ xác thực người dùng đã tăng 15.4% trong quý này. Xác thực cao giúp tăng lượng đặt lịch lên 2.4 lần.
						</p>
						<a href="#" className="um-card-link">
							Xem chi tiết phân tích <ArrowRight size={16} />
						</a>
					</div>
				</div>

				<div className="um-footer-card um-card-right">
					<div className="um-card-right-top">
						<div className="shield-icon-wrapper">
							<ShieldCheck size={20} className="shield-icon" strokeWidth={2.5} />
						</div>
						<div className="shield-title-wrapper">
							<h3>Bảo mật Tài khoản</h3>
							<span>Tỷ lệ Áp dụng 2FA</span>
						</div>
					</div>
					<div className="um-card-right-middle">
						<Progress 
							percent={62} 
							strokeColor="#047857" // Dark green
							trailColor="#A7F3D0" // Light teal trail
							showInfo={false}
							strokeWidth={8}
						/>
					</div>
					<div className="um-card-right-bottom">
						<i>62% người dùng của bạn đã bật bảo mật 2 lớp (2FA) để tăng cường an toàn.</i>
					</div>
				</div>
			</div>
			</div>

			{/* Modal Thêm người dùng mới */}
			<Modal
				title={<h3>Thêm người dùng mới 👤</h3>}
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
				<Form form={form} layout="vertical" onFinish={handleAddUser}>
					<Form.Item
						name="name"
						label="Họ và tên"
						rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
					>
						<Input placeholder="Ví dụ: Nguyễn Văn A" />
					</Form.Item>
					<Form.Item
						name="type"
						label="Loại tài khoản"
						rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
						initialValue="Chủ nuôi"
					>
						<Select>
							<Select.Option value="Chủ nuôi">Chủ nuôi</Select.Option>
							<Select.Option value="Bác sĩ thú y">Bác sĩ thú y</Select.Option>
							<Select.Option value="Nhân viên">Nhân viên</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="email"
						label="Địa chỉ Email"
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' }
						]}
					>
						<Input placeholder="email@example.com" />
					</Form.Item>
					<Form.Item
						name="phone"
						label="Số điện thoại"
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
					>
						<Input placeholder="Ví dụ: +84 987 654 321" />
					</Form.Item>
					<Form.Item
						name="status"
						label="Trạng thái"
						initialValue="Hoạt động"
					>
						<Select>
							<Select.Option value="Hoạt động">Hoạt động</Select.Option>
							<Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
							<Select.Option value="Đình chỉ">Đình chỉ</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default UserManagement;
