import React, { useState, useEffect } from 'react';
import {
	Input,
	Radio,
	Button,
	Drawer,
	Avatar,
	Timeline,
	Tag,
	Spin,
	Empty,
	Card,
} from 'antd';
import {
	SearchOutlined,
	ReloadOutlined,
	UserOutlined,
	GitlabOutlined,
	MedicineBoxOutlined,
	HeartOutlined,
	ClockCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
	getPets,
	getPetMedicalRecords,
	Pet,
	User,
	MedicalRecord,
} from '@/services/QuanLyPetStore';
import './style.less';

const QuanLyThuCung: React.FC = () => {
	const [pets, setPets] = useState<(Pet & { owner_name: string; owner_email: string; owner_phone: string })[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// Filters
	const [searchPet, setSearchPet] = useState<string>('');
	const [searchOwner, setSearchOwner] = useState<string>('');
	const [speciesFilter, setSpeciesFilter] = useState<string>('ALL');

	// Drawer states
	const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
	const [drawerLoading, setDrawerLoading] = useState<boolean>(false);
	const [medicalData, setMedicalData] = useState<{
		pet: Pet | null;
		owner: User | null;
		records: (MedicalRecord & { vet_name: string; service_name: string; scheduled_at: string })[];
	} | null>(null);

	const loadPetsList = async (filters?: { searchOwner?: string; searchPet?: string; species?: string }) => {
		setLoading(true);
		try {
			const res = await getPets(filters);
			setPets(res);
		} catch (error) {
			console.error('Failed to load pets list:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPetsList({ searchPet, searchOwner, species: speciesFilter });
	}, []);

	const handleSearch = () => {
		loadPetsList({ searchPet, searchOwner, species: speciesFilter });
	};

	const handleSpeciesFilterChange = (e: any) => {
		const val = e.target.value;
		setSpeciesFilter(val);
		loadPetsList({ searchPet, searchOwner, species: val });
	};

	const handleResetFilters = () => {
		setSearchPet('');
		setSearchOwner('');
		setSpeciesFilter('ALL');
		loadPetsList({ searchPet: '', searchOwner: '', species: 'ALL' });
	};

	const handleOpenMedicalRecords = async (petId: string) => {
		setDrawerVisible(true);
		setDrawerLoading(true);
		try {
			const res = await getPetMedicalRecords(petId);
			setMedicalData(res);
		} catch (error) {
			console.error('Failed to load pet medical records:', error);
		} finally {
			setDrawerLoading(false);
		}
	};

	const handleCloseDrawer = () => {
		setDrawerVisible(false);
		setMedicalData(null);
	};

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

	const dogCount = pets.filter((p) => p.species === 'Chó').length;
	const catCount = pets.filter((p) => p.species === 'Mèo').length;
	const totalCount = pets.length;

	return (
		<div className='pet-mgmt-container'>
			{/* Page Header */}
			<div className='page-header'>
				<div>
					<h1>
						<GitlabOutlined className='header-icon' /> Quản Lý Thú Cưng
					</h1>
					<p style={{ color: '#6b7280', margin: '6px 0 0 0', fontSize: '14px', maxWidth: 520 }}>
						Tra cứu hồ sơ thú cưng, thông tin chủ nuôi và lịch sử bệnh án y khoa chuyên sâu.
					</p>
				</div>
			</div>

			{/* ===== BENTO GRID ===== */}
			<div className='bento-grid'>
				{/* Stats Chip Row */}
				<div className='bento-stats-row'>
					<div className='stat-chip chip-total'>
						<span className='stat-emoji'>🐾</span>
						Tổng thú cưng:
						<span className='stat-count'>{totalCount}</span>
					</div>
					<div className='stat-chip chip-dog'>
						<span className='stat-emoji'>🐶</span>
						Cún cưng:
						<span className='stat-count'>{dogCount}</span>
					</div>
					<div className='stat-chip chip-cat'>
						<span className='stat-emoji'>🐱</span>
						Mèo cưng:
						<span className='stat-count'>{catCount}</span>
					</div>
				</div>

				{/* Filter Cell */}
				<div className='bento-filter'>
					<div className='filter-grid'>
						<div className='filter-group'>
							<div className='filter-label'>Tên thú cưng</div>
							<Input
								placeholder='Nhập tên thú cưng...'
								value={searchPet}
								onChange={(e) => setSearchPet(e.target.value)}
								onPressEnter={handleSearch}
								prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
								className='search-input'
								allowClear
							/>
						</div>
						<div className='filter-group'>
							<div className='filter-label'>Chủ nuôi (tên, SĐT, email)</div>
							<Input
								placeholder='Nhập tên, số điện thoại chủ...'
								value={searchOwner}
								onChange={(e) => setSearchOwner(e.target.value)}
								onPressEnter={handleSearch}
								prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
								className='search-input'
								allowClear
							/>
						</div>
						<div className='filter-group'>
							<div className='filter-label'>Loài</div>
							<Radio.Group
								value={speciesFilter}
								onChange={handleSpeciesFilterChange}
								className='species-radio'
								style={{ display: 'flex', width: '100%' }}
							>
								<Radio.Button value='ALL' style={{ flex: 1, textAlign: 'center' }}>Tất cả</Radio.Button>
								<Radio.Button value='Chó' style={{ flex: 1, textAlign: 'center' }}>🐶 Chó</Radio.Button>
								<Radio.Button value='Mèo' style={{ flex: 1, textAlign: 'center' }}>🐱 Mèo</Radio.Button>
							</Radio.Group>
						</div>
					</div>
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
						<Button icon={<ReloadOutlined />} onClick={handleResetFilters} className='reset-btn'>
							Làm mới
						</Button>
						<Button
							type='primary'
							icon={<SearchOutlined />}
							onClick={handleSearch}
							className='search-btn'
						>
							Tìm kiếm
						</Button>
					</div>
				</div>
			</div>

			{/* ===== PET BENTO GRID ===== */}
			{loading ? (
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '240px', flexDirection: 'column', gap: '12px' }}>
					<Spin size='large' />
					<span style={{ color: '#999' }}>Đang nạp hồ sơ thú y...</span>
				</div>
			) : pets.length === 0 ? (
				<Card style={{ borderRadius: '20px', textAlign: 'center', padding: '40px 20px', border: '1px solid rgba(0,0,0,0.04)' }}>
					<Empty description='Không tìm thấy dữ liệu thú cưng nào phù hợp bộ lọc.' />
				</Card>
			) : (
				<div className='pet-bento-grid'>
					{pets.map((pet) => (
						<div key={pet.id} className='pet-bento-card'>
							{/* Pet Image */}
							<div className='pet-image-wrapper'>
								<img
									src={pet.avatar_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'}
									alt={pet.name}
									className='pet-img'
								/>
								<Tag
									color={pet.species === 'Chó' ? 'processing' : 'purple'}
									className='species-tag-overlay'
								>
									{pet.species === 'Chó' ? '🐶 Chó' : '🐱 Mèo'}
								</Tag>
								<div
									className='gender-tag-overlay'
									style={{
										backgroundColor: pet.gender === 'male' ? '#e6f7ff' : pet.gender === 'female' ? '#fff0f6' : '#f5f5f5',
										color: pet.gender === 'male' ? '#1890ff' : pet.gender === 'female' ? '#eb2f96' : '#8c8c8c',
									}}
								>
									{pet.gender === 'male' ? '♂' : pet.gender === 'female' ? '♀' : '?'}
								</div>
							</div>

							{/* Pet Details */}
							<div className='pet-details'>
								<div className='pet-name-row'>
									<h3>{pet.name}</h3>
									<span className='pet-age'>{renderPetAge(pet.date_of_birth)}</span>
								</div>
								<div className='breed-text'>
									Giống: <b>{pet.breed || 'Mỹ'}</b>
								</div>

								{/* Owner Info Box */}
								<div className='owner-info-box'>
									<div className='owner-title'>Chủ sở hữu</div>
									<div className='owner-detail-row'>
										<UserOutlined style={{ color: '#d4a017' }} />
										<span>{pet.owner_name}</span>
									</div>
									<div className='owner-contact'>
										<span>📞 {pet.owner_phone || 'Chưa cập nhật'}</span>
										<span>✉️ {pet.owner_email}</span>
									</div>
								</div>

								{/* Action Button */}
								<Button
									className='pet-action-btn'
									icon={<MedicineBoxOutlined />}
									onClick={() => handleOpenMedicalRecords(pet.id)}
								>
									Hồ sơ bệnh án
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Medical Records Drawer */}
			<Drawer
				visible={drawerVisible}
				onClose={handleCloseDrawer}
				width={620}
				destroyOnClose
				className='pet-medical-drawer'
				headerStyle={{ padding: 0 }}
				title={
					drawerLoading || !medicalData?.pet ? (
						<div style={{ padding: '20px 24px' }}>Đang tải bệnh án...</div>
					) : (
						<div className='drawer-header-pet'>
							<Avatar
								src={medicalData.pet.avatar_url}
								size={54}
								icon={<GitlabOutlined />}
								className='pet-avatar-border'
							/>
							<div>
								<h3>Bệnh án: {medicalData.pet.name}</h3>
								<Tag color={medicalData.pet.species === 'Chó' ? 'blue' : 'purple'} style={{ borderRadius: '8px' }}>
									{medicalData.pet.species} - {medicalData.pet.breed || 'Giống lai'}
								</Tag>
							</div>
						</div>
					)
				}
			>
				{drawerLoading ? (
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '12px' }}>
						<Spin size='large' />
						<span style={{ color: '#999' }}>Đang nạp hồ sơ bệnh án chi tiết...</span>
					</div>
				) : medicalData && medicalData.pet ? (
					<div>
						{/* Pet Meta Grid (mini bento) */}
						<div className='pet-meta-grid'>
							<div className='meta-box'>
								<div className='meta-label'>Tuổi</div>
								<div className='meta-value'>{renderPetAge(medicalData.pet.date_of_birth)}</div>
							</div>
							<div className='meta-box'>
								<div className='meta-label'>Giới tính</div>
								<div className='meta-value'>
									{medicalData.pet.gender === 'male' ? 'Đực (♂)' : medicalData.pet.gender === 'female' ? 'Cái (♀)' : 'Chưa rõ'}
								</div>
							</div>
							<div className='meta-box'>
								<div className='meta-label'>Mã số thú y</div>
								<div className='meta-value' style={{ fontFamily: 'monospace', fontSize: '11px' }}>
									{medicalData.pet.id.substring(0, 8).toUpperCase()}
								</div>
							</div>
						</div>

						{/* Owner Info */}
						{medicalData.owner && (
							<div className='owner-meta-block'>
								<div className='owner-header'>Thông tin liên hệ chủ nuôi</div>
								<div className='owner-row'>
									<div className='owner-label'>Chủ nuôi:</div>
									<div className='owner-val'>{medicalData.owner.full_name}</div>
								</div>
								<div className='owner-row'>
									<div className='owner-label'>Điện thoại:</div>
									<div className='owner-val'>{medicalData.owner.phone || 'Chưa cập nhật'}</div>
								</div>
								<div className='owner-row'>
									<div className='owner-label'>Email:</div>
									<div className='owner-val'>{medicalData.owner.email}</div>
								</div>
							</div>
						)}

						{/* Timeline */}
						<div className='medical-timeline-title'>
							<HeartOutlined className='title-icon' /> Lịch sử khám điều trị y khoa
						</div>

						{medicalData.records.length === 0 ? (
							<Card style={{ borderRadius: '16px', textAlign: 'center', background: '#faf9f5', border: '1px solid rgba(0,0,0,0.04)' }}>
								<Empty description='Thú cưng này chưa có lịch sử bệnh án.' />
							</Card>
						) : (
							<Timeline mode='left'>
								{medicalData.records.map((record) => (
									<Timeline.Item
										key={record.id}
										label={<span style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>{moment(record.recorded_at).format('DD/MM/YYYY')}</span>}
										dot={<ClockCircleOutlined style={{ fontSize: '15px', color: '#f6d776' }} />}
									>
										<div className='timeline-content-card'>
											<div className='timeline-header-row'>
												<Tag color='gold' className='service-tag'>
													{record.service_name}
												</Tag>
												<span className='vet-name'>
													BS: <b>{record.vet_name}</b>
												</span>
											</div>

											<div className='diagnosis-box'>
												🧠 Chẩn đoán: {record.diagnosis}
											</div>

											<div className='treatment-text'>
												💊 <b>Điều trị:</b> {record.treatment}
											</div>

											{record.prescription && record.prescription !== 'Không có đơn thuốc.' && (
												<div className='prescription-rx-card'>
													<div className='rx-title'>Toa thuốc chỉ định</div>
													<div className='rx-content'>{record.prescription}</div>
												</div>
											)}

											{record.notes && (
												<div className='timeline-notes'>
													📝 Ghi chú: {record.notes}
												</div>
											)}
										</div>
									</Timeline.Item>
								))}
							</Timeline>
						)}
					</div>
				) : (
					<Empty description='Không nạp được thông tin bệnh án.' />
				)}
			</Drawer>
		</div>
	);
};

export default QuanLyThuCung;
