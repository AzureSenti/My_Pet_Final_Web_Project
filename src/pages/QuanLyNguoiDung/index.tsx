import React, { useState, useEffect } from 'react';
import {
	Table,
	Input,
	Select,
	Button,
	Switch,
	Tooltip,
	Drawer,
	Avatar,
	Tabs,
	Tag,
	PopconfirmProps,
	Popconfirm,
	Spin,
	Empty,
	Badge,
} from 'antd';
import {
	UserOutlined,
	EyeOutlined,
	SearchOutlined,
	ReloadOutlined,
	PhoneOutlined,
	MailOutlined,
	CalendarOutlined,
	DollarCircleOutlined,
	GitlabOutlined,
	MedicineBoxOutlined,
	CheckCircleOutlined,
	StopOutlined,
	FilterOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
	getOwners,
	toggleUserStatus,
	getOwnerDetails,
	User,
	Pet,
	Appointment,
	Payment,
} from '@/services/QuanLyPetStore';
import './style.less';

const { Option } = Select;
const { TabPane } = Tabs;

const QuanLyNguoiDung: React.FC = () => {
	const [owners, setOwners] = useState<User[]>([]);
	const [filteredOwners, setFilteredOwners] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchText, setSearchText] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('ALL');

	// Drawer detail states
	const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
	const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
	const [drawerLoading, setDrawerLoading] = useState<boolean>(false);
	const [ownerDetails, setOwnerDetails] = useState<{
		user: User | null;
		pets: Pet[];
		appointments: (Appointment & { pet_name: string; service_name: string; vet_name: string })[];
		payments: (Payment & { service_name: string })[];
	} | null>(null);

	const loadOwnersList = async () => {
		setLoading(true);
		try {
			const res = await getOwners();
			setOwners(res);
			applyFilters(res, searchText, statusFilter);
		} catch (error) {
			console.error('Failed to load owners:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadOwnersList();
	}, []);

	const applyFilters = (data: User[], search: string, status: string) => {
		let result = [...data];
		if (search) {
			const lowerSearch = search.toLowerCase();
			result = result.filter(
				(item) =>
					item.full_name.toLowerCase().includes(lowerSearch) ||
					item.email.toLowerCase().includes(lowerSearch) ||
					(item.phone && item.phone.includes(lowerSearch))
			);
		}
		if (status !== 'ALL') {
			const activeBool = status === 'ACTIVE';
			result = result.filter((item) => item.is_active === activeBool);
		}
		setFilteredOwners(result);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearchText(val);
		applyFilters(owners, val, statusFilter);
	};

	const handleStatusFilterChange = (val: string) => {
		setStatusFilter(val);
		applyFilters(owners, searchText, val);
	};

	const handleResetFilters = () => {
		setSearchText('');
		setStatusFilter('ALL');
		setFilteredOwners(owners);
	};

	const handleToggleStatus = async (userId: string, active: boolean) => {
		try {
			await toggleUserStatus(userId, active);
			const updated = owners.map((o) => (o.id === userId ? { ...o, is_active: active } : o));
			setOwners(updated);
			applyFilters(updated, searchText, statusFilter);
			if (selectedOwnerId === userId && ownerDetails) {
				setOwnerDetails({
					...ownerDetails,
					user: ownerDetails.user ? { ...ownerDetails.user, is_active: active } : null,
				});
			}
		} catch (error) {
			console.error('Failed to update user status:', error);
		}
	};

	const handleOpenDetails = async (ownerId: string) => {
		setSelectedOwnerId(ownerId);
		setDrawerVisible(true);
		setDrawerLoading(true);
		try {
			const details = await getOwnerDetails(ownerId);
			setOwnerDetails(details);
		} catch (error) {
			console.error('Failed to load owner details:', error);
		} finally {
			setDrawerLoading(false);
		}
	};

	const handleCloseDrawer = () => {
		setDrawerVisible(false);
		setSelectedOwnerId(null);
		setOwnerDetails(null);
	};

	const totalCount = owners.length;
	const activeCount = owners.filter((o) => o.is_active).length;
	const lockedCount = totalCount - activeCount;

	const renderPetAge = (dobString?: string) => {
		if (!dobString) return 'Không rõ tuổi';
		const dob = moment(dobString);
		const years = moment().diff(dob, 'years');
		if (years > 0) {
			const months = moment().diff(dob, 'months') % 12;
			return months > 0 ? `${years} tuổi, ${months} tháng` : `${years} tuổi`;
		}
		const months = moment().diff(dob, 'months');
		return months > 0 ? `${months} tháng` : 'Dưới 1 tháng';
	};

	const columns = [
		{
			title: 'Chủ thú cưng',
			dataIndex: 'full_name',
			key: 'full_name',
			render: (text: string, record: User) => (
				<div className='user-cell'>
					<Avatar
						src={record.avatar_url}
						icon={<UserOutlined />}
						className='user-avatar'
						size={40}
					/>
					<div className='user-info'>
						<div className='user-name'>{text}</div>
						<div className='user-email'>{record.email}</div>
					</div>
				</div>
			),
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			render: (text?: string) =>
				text || <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Chưa cập nhật</span>,
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (date: string) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Hoạt động cuối',
			dataIndex: 'last_login_at',
			key: 'last_login_at',
			render: (date?: string) =>
				date ? moment(date).fromNow() : <span style={{ color: '#bfbfbf' }}>Chưa đăng nhập</span>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'is_active',
			key: 'is_active',
			width: 140,
			render: (isActive: boolean) => (
				<Tag color={isActive ? 'success' : 'error'} className='status-tag'>
					{isActive ? '● Hoạt động' : '● Đã khóa'}
				</Tag>
			),
		},
		{
			title: 'Khóa/Mở',
			dataIndex: 'is_active',
			key: 'toggle_active',
			width: 90,
			align: 'center' as const,
			render: (isActive: boolean, record: User) => (
				<Popconfirm
					title={isActive ? 'Bạn có chắc muốn khóa tài khoản này?' : 'Mở khóa tài khoản này?'}
					onConfirm={() => handleToggleStatus(record.id, !isActive)}
					okText={isActive ? 'Khóa' : 'Mở khóa'}
					cancelText='Hủy'
					okButtonProps={{
						danger: isActive,
						style: !isActive ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : undefined,
					}}
				>
					<Switch checked={isActive} size='small' />
				</Popconfirm>
			),
		},
		{
			title: '',
			key: 'action',
			width: 60,
			align: 'center' as const,
			render: (_: any, record: User) => (
				<Tooltip title='Xem chi tiết hồ sơ'>
					<Button
						type='text'
						icon={<EyeOutlined />}
						onClick={() => handleOpenDetails(record.id)}
						className='action-view-btn'
						size='small'
					/>
				</Tooltip>
			),
		},
	];

	return (
		<div className='user-mgmt-container'>
			{/* Page Header */}
			<div className='page-header'>
				<div>
					<h1>
						<UserOutlined className='header-icon' /> Quản Lý Người Dùng
					</h1>
					<p style={{ color: '#6b7280', margin: '6px 0 0 0', fontSize: '14px', maxWidth: 500 }}>
						Quản lý tài khoản chủ nuôi, khóa/mở khóa và theo dõi hồ sơ y tế thú cưng.
					</p>
				</div>
			</div>

			{/* ===== BENTO GRID ===== */}
			<div className='bento-grid'>
				{/* Stat: Total */}
				<div className='bento-stat stat-total'>
					<div className='stat-top'>
						<div className='stat-icon-box icon-total'>
							<UserOutlined />
						</div>
						<span className='stat-badge badge-total'>Tổng cộng</span>
					</div>
					<div className='stat-number'>{loading ? <Spin size='small' /> : totalCount}</div>
					<div className='stat-label'>Chủ nuôi đã đăng ký</div>
				</div>

				{/* Stat: Active */}
				<div className='bento-stat stat-active'>
					<div className='stat-top'>
						<div className='stat-icon-box icon-active'>
							<CheckCircleOutlined />
						</div>
						<span className='stat-badge badge-active'>Đang hoạt động</span>
					</div>
					<div className='stat-number'>{loading ? <Spin size='small' /> : activeCount}</div>
					<div className='stat-label'>Tài khoản mở</div>
				</div>

				{/* Stat: Locked */}
				<div className='bento-stat stat-locked'>
					<div className='stat-top'>
						<div className='stat-icon-box icon-locked'>
							<StopOutlined />
						</div>
						<span className='stat-badge badge-locked'>Tạm khóa</span>
					</div>
					<div className='stat-number'>{loading ? <Spin size='small' /> : lockedCount}</div>
					<div className='stat-label'>Tài khoản bị khóa</div>
				</div>

				{/* Filter Cell */}
				<div className='bento-filter'>
					<span className='filter-label'>
						<FilterOutlined /> Bộ lọc
					</span>
					<Input
						placeholder='Tìm theo tên, email hoặc SĐT...'
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={handleSearchChange}
						className='search-input'
						allowClear
					/>
					<Select
						value={statusFilter}
						onChange={handleStatusFilterChange}
						className='status-select'
					>
						<Option value='ALL'>Tất cả trạng thái</Option>
						<Option value='ACTIVE'>Đang hoạt động</Option>
						<Option value='LOCKED'>Đã khóa</Option>
					</Select>
					<div className='filter-actions'>
						<Button
							icon={<ReloadOutlined />}
							onClick={handleResetFilters}
							className='reset-btn'
						>
							Làm mới
						</Button>
					</div>
				</div>

				{/* Table Cell */}
				<div className='bento-table'>
					<Table
						columns={columns}
						dataSource={filteredOwners}
						rowKey='id'
						loading={loading}
						pagination={{
							pageSize: 5,
							showSizeChanger: true,
							pageSizeOptions: ['5', '10', '20'],
							locale: { items_per_page: '/ trang' },
						}}
						locale={{
							emptyText: <Empty description='Không tìm thấy khách hàng nào phù hợp' />,
						}}
					/>
				</div>
			</div>

			{/* Detailed Owner Drawer */}
			<Drawer
				visible={drawerVisible}
				onClose={handleCloseDrawer}
				width={680}
				destroyOnClose
				className='owner-detail-drawer'
				headerStyle={{ padding: 0 }}
				title={
					drawerLoading || !ownerDetails?.user ? (
						<div style={{ padding: '20px 24px' }}>Đang tải thông tin...</div>
					) : (
						<div className='drawer-header-title'>
							<Avatar
								src={ownerDetails.user.avatar_url}
								size={54}
								icon={<UserOutlined />}
								className='drawer-avatar'
							/>
							<div>
								<h3 className='drawer-name'>{ownerDetails.user.full_name}</h3>
								<span className='drawer-email'>{ownerDetails.user.email}</span>
								<Tag
									color={ownerDetails.user.is_active ? 'success' : 'error'}
									style={{ marginLeft: '8px', borderRadius: '10px' }}
								>
									{ownerDetails.user.is_active ? 'Đang hoạt động' : 'Tài khoản khóa'}
								</Tag>
							</div>
						</div>
					)
				}
			>
				{drawerLoading ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
							flexDirection: 'column',
							gap: '12px',
						}}
					>
						<Spin size='large' />
						<span style={{ color: '#999' }}>Đang nạp hồ sơ chi tiết...</span>
					</div>
				) : ownerDetails && ownerDetails.user ? (
					<Tabs defaultActiveKey='1'>
						{/* Tab 1: Profile */}
						<TabPane
							tab={
								<span>
									<UserOutlined />
									Hồ sơ cá nhân
								</span>
							}
							key='1'
						>
							<div className='detail-info-block'>
								<div className='info-row'>
									<div className='info-label'>Mã khách hàng:</div>
									<div className='info-value' style={{ fontFamily: 'monospace', fontSize: '12px' }}>
										{ownerDetails.user.id}
									</div>
								</div>
								<div className='info-row'>
									<div className='info-label'>
										<PhoneOutlined /> Số điện thoại:
									</div>
									<div className='info-value'>
										{ownerDetails.user.phone || (
											<span style={{ color: '#bfbfbf' }}>Chưa cập nhật</span>
										)}
									</div>
								</div>
								<div className='info-row'>
									<div className='info-label'>
										<MailOutlined /> Thư điện tử:
									</div>
									<div className='info-value'>{ownerDetails.user.email}</div>
								</div>
								<div className='info-row'>
									<div className='info-label'>
										<CalendarOutlined /> Ngày gia nhập:
									</div>
									<div className='info-value'>
										{moment(ownerDetails.user.created_at).format('DD/MM/YYYY HH:mm')}
									</div>
								</div>
								<div className='info-row'>
									<div className='info-label'>Đăng nhập cuối:</div>
									<div className='info-value'>
										{ownerDetails.user.last_login_at
											? moment(ownerDetails.user.last_login_at).format('DD/MM/YYYY HH:mm')
											: 'Chưa từng đăng nhập'}
									</div>
								</div>
							</div>
						</TabPane>

						{/* Tab 2: Pets */}
						<TabPane
							tab={
								<span>
									<GitlabOutlined />
									Thú cưng ({ownerDetails.pets.length})
								</span>
							}
							key='2'
						>
							{ownerDetails.pets.length === 0 ? (
								<Empty description='Chủ nuôi này chưa đăng ký thú cưng nào.' />
							) : (
								<div className='pet-grid'>
									{ownerDetails.pets.map((pet) => (
										<div key={pet.id} className='pet-card'>
											<div className='pet-header'>
												<Avatar
													src={pet.avatar_url}
													icon={<GitlabOutlined />}
													size={40}
													className='pet-avatar'
													style={{ backgroundColor: '#fff3cd', border: '1px solid #ffd43b' }}
												/>
												<div>
													<h4 className='pet-name'>{pet.name}</h4>
													<Tag
														color={pet.species === 'Chó' ? 'blue' : 'purple'}
														className='pet-species-badge'
													>
														{pet.species}
													</Tag>
												</div>
											</div>
											<div className='pet-body'>
												<div className='pet-info-item'>
													Giống: <span>{pet.breed || 'Chưa cập nhật'}</span>
												</div>
												<div className='pet-info-item'>
													Tuổi: <span>{renderPetAge(pet.date_of_birth)}</span>
												</div>
												<div className='pet-info-item'>
													Giới tính:{' '}
													<span>
														{pet.gender === 'male'
															? 'Đực'
															: pet.gender === 'female'
															? 'Cái'
															: 'Không rõ'}
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</TabPane>

						{/* Tab 3: Appointments */}
						<TabPane
							tab={
								<span>
									<MedicineBoxOutlined />
									Lịch hẹn khám ({ownerDetails.appointments.length})
								</span>
							}
							key='3'
						>
							{ownerDetails.appointments.length === 0 ? (
								<Empty description='Khách hàng chưa đăng ký lịch khám nào.' />
							) : (
								<Table
									dataSource={ownerDetails.appointments}
									rowKey='id'
									pagination={{ pageSize: 4 }}
									size='small'
									columns={[
										{
											title: 'Thời gian',
											dataIndex: 'scheduled_at',
											key: 'scheduled_at',
											render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
										},
										{
											title: 'Thú cưng',
											dataIndex: 'pet_name',
											key: 'pet_name',
											render: (name: string) => <Tag color='orange'>{name}</Tag>,
										},
										{
											title: 'Dịch vụ / Bác sĩ',
											key: 'service_vet',
											render: (_, record) => (
												<div>
													<b>{record.service_name}</b>
													<div style={{ fontSize: '11px', color: '#8c8c8c' }}>
														BS: {record.vet_name}
													</div>
												</div>
											),
										},
										{
											title: 'Trạng thái',
											dataIndex: 'status',
											key: 'status',
											render: (status: string) => {
												let color = 'default';
												let text = 'Chờ duyệt';
												if (status === 'confirmed') {
													color = 'processing';
													text = 'Đã duyệt';
												} else if (status === 'completed') {
													color = 'success';
													text = 'Đã khám';
												} else if (status === 'cancelled') {
													color = 'error';
													text = 'Đã hủy';
												}
												return <Badge status={color as any} text={text} />;
											},
										},
									]}
								/>
							)}
						</TabPane>

						{/* Tab 4: Payments */}
						<TabPane
							tab={
								<span>
									<DollarCircleOutlined />
									Lịch sử thanh toán ({ownerDetails.payments.length})
								</span>
							}
							key='4'
						>
							{ownerDetails.payments.length === 0 ? (
								<Empty description='Chưa có giao dịch thanh toán nào.' />
							) : (
								<Table
									dataSource={ownerDetails.payments}
									rowKey='id'
									pagination={{ pageSize: 4 }}
									size='small'
									className='payment-table'
									columns={[
										{
											title: 'Mã giao dịch / Ngày',
											key: 'tx_date',
											render: (_, record) => (
												<div>
													<b>
														{record.transaction_id || (
															<span style={{ color: '#bfbfbf', fontSize: '11px' }}>
																Tiền mặt
															</span>
														)}
													</b>
													<div style={{ fontSize: '11px', color: '#8c8c8c' }}>
														{record.paid_at
															? moment(record.paid_at).format('DD/MM/YYYY HH:mm')
															: 'Chưa thu'}
													</div>
												</div>
											),
										},
										{
											title: 'Dịch vụ',
											dataIndex: 'service_name',
											key: 'service_name',
										},
										{
											title: 'Hình thức',
											dataIndex: 'method',
											key: 'method',
											render: (method: string) => {
												const map: Record<string, string> = {
													cash: 'Tiền mặt',
													card: 'Cà thẻ',
													online: 'Chuyển khoản',
												};
												return map[method] || method;
											},
										},
										{
											title: 'Số tiền',
											dataIndex: 'amount',
											key: 'amount',
											align: 'right' as const,
											render: (amount: number) => (
												<b style={{ color: '#1a1a2e' }}>{amount.toLocaleString('vi-VN')} đ</b>
											),
										},
										{
											title: 'Trạng thái',
											dataIndex: 'status',
											key: 'status',
											render: (status: string) => (
												<Tag
													color={
														status === 'paid'
															? 'success'
															: status === 'refunded'
															? 'warning'
															: 'default'
													}
													style={{ borderRadius: '10px' }}
												>
													{status === 'paid'
														? 'Đã thu'
														: status === 'refunded'
														? 'Hoàn tiền'
														: 'Chưa thu'}
												</Tag>
											),
										},
									]}
								/>
							)}
						</TabPane>
					</Tabs>
				) : (
					<Empty description='Không tìm thấy dữ liệu hồ sơ.' />
				)}
			</Drawer>
		</div>
	);
};

export default QuanLyNguoiDung;
