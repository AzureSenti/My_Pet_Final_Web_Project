import React, { useState, useEffect } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	Switch,
	Avatar,
	Tag,
	Popconfirm,
	Spin,
	Empty,
	Tooltip,
	Modal,
	Form,
	Input,
} from 'antd';
import {
	MedicineBoxOutlined,
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	PhoneOutlined,
	MailOutlined,
	FilePdfOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	getDoctors,
	createDoctor,
	updateDoctor,
	deleteDoctor,
	toggleDoctorStatus,
} from '@/services/QuanLyPetStore';
import './style.less';

const { TextArea } = Input;

interface DoctorType {
	id: string;
	vet_id: string;
	full_name: string;
	email: string;
	phone?: string;
	avatar_url?: string;
	specialization: string;
	bio: string;
	certificate_url: string;
	is_active: boolean;
}

const QuanLyBacSi: React.FC = () => {
	const [doctors, setDoctors] = useState<DoctorType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});

	const [form] = Form.useForm();

	const loadDoctorsList = async () => {
		setLoading(true);
		try {
			const res = await getDoctors();
			setDoctors(res);
		} catch (error) {
			console.error('Failed to load doctors list:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadDoctorsList();
	}, []);

	const toggleBio = (id: string) => {
		setExpandedBios((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleOpenAddModal = () => {
		setEditingDoctorId(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleOpenEditModal = (doctor: DoctorType) => {
		setEditingDoctorId(doctor.id);
		form.setFieldsValue({
			full_name: doctor.full_name,
			email: doctor.email,
			phone: doctor.phone,
			avatar_url: doctor.avatar_url,
			specialization: doctor.specialization,
			bio: doctor.bio,
			certificate_url: doctor.certificate_url,
		});
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setEditingDoctorId(null);
		form.resetFields();
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setFormLoading(true);

			let success = false;
			if (editingDoctorId) {
				success = await updateDoctor(editingDoctorId, values);
			} else {
				success = await createDoctor(values);
			}

			if (success) {
				handleCloseModal();
				loadDoctorsList();
			}
		} catch (error) {
			console.error('Form validation failed:', error);
		} finally {
			setFormLoading(false);
		}
	};

	const handleDeleteDoctor = async (userId: string) => {
		try {
			const success = await deleteDoctor(userId);
			if (success) {
				loadDoctorsList();
			}
		} catch (error) {
			console.error('Failed to delete doctor:', error);
		}
	};

	const handleToggleStatus = async (userId: string, active: boolean) => {
		try {
			const success = await toggleDoctorStatus(userId, active);
			if (success) {
				setDoctors((prev) =>
					prev.map((d) => (d.id === userId ? { ...d, is_active: active } : d))
				);
			}
		} catch (error) {
			console.error('Failed to toggle status:', error);
		}
	};

	const getSpecializationColor = (spec: string) => {
		const lower = spec.toLowerCase();
		if (lower.includes('nội') || lower.includes('ngoại')) return 'gold';
		if (lower.includes('da liễu')) return 'cyan';
		if (lower.includes('dinh dưỡng')) return 'green';
		if (lower.includes('nha khoa')) return 'blue';
		return 'purple';
	};

	return (
		<div className='vet-mgmt-container'>
			{/* Page Header */}
			<div className='page-header'>
				<div>
					<h1>
						<MedicineBoxOutlined className='header-icon' /> Quản Lý Bác Sĩ
					</h1>
					<p style={{ color: '#6b7280', margin: '6px 0 0 0', fontSize: '14px', maxWidth: 600 }}>
						Thêm mới, cập nhật hồ sơ chuyên môn, theo dõi trạng thái hoạt động và quản lý chứng chỉ hành nghề của đội ngũ bác sĩ.
					</p>
				</div>
				<Button
					icon={<PlusOutlined />}
					className='add-vet-btn'
					onClick={handleOpenAddModal}
				>
					Thêm bác sĩ mới
				</Button>
			</div>

			{/* Main Bento Grid */}
			{loading ? (
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
					<Spin size='large' />
					<span style={{ color: '#999' }}>Đang nạp hồ sơ bác sĩ...</span>
				</div>
			) : doctors.length === 0 ? (
				<Card style={{ borderRadius: '20px', textAlign: 'center', padding: '40px 20px', border: '1px solid rgba(0,0,0,0.04)' }}>
					<Empty description='Chưa có bác sĩ thú y nào được tạo lập trong hệ thống.' />
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleOpenAddModal}
						style={{ marginTop: '16px', backgroundColor: '#f6d776', borderColor: '#f6d776', color: '#1a1a2e', fontWeight: 'bold', borderRadius: '10px' }}
					>
						Thêm bác sĩ ngay
					</Button>
				</Card>
			) : (
				<div className='vet-grid'>
					{doctors.map((doctor) => {
						const isExpanded = expandedBios[doctor.id] || false;
						return (
							<div key={doctor.id} className='vet-bento-card'>
								{/* Header */}
								<div className='vet-card-header'>
									<Avatar
										src={doctor.avatar_url}
										size={64}
										icon={<UserOutlined />}
										className='vet-avatar'
									/>
									<div className='vet-header-text'>
										<h3>{doctor.full_name}</h3>
										<Tag color={getSpecializationColor(doctor.specialization)} className='specialization-tag'>
											{doctor.specialization}
										</Tag>
									</div>
									<div className='status-switch-wrapper'>
										<Tooltip title={doctor.is_active ? 'Đang hoạt động - Nhấp để khóa' : 'Tạm ngưng - Nhấp để mở khóa'}>
											<Switch
												checked={doctor.is_active}
												onChange={(checked) => handleToggleStatus(doctor.id, checked)}
												size='small'
											/>
										</Tooltip>
									</div>
								</div>

								{/* Body */}
								<div className='vet-card-body'>
									{/* Bio */}
									<p className={`bio-box ${isExpanded ? 'expanded' : ''}`}>
										{doctor.bio || 'Bác sĩ chưa cập nhật thông tin tiểu sử cá nhân.'}
									</p>
									{doctor.bio && doctor.bio.length > 100 && (
										<span className='bio-toggle' onClick={() => toggleBio(doctor.id)}>
											{isExpanded ? ' Thu gọn' : ' Xem thêm'}
										</span>
									)}

									{/* Contact Bento Box */}
									<div className='contact-bento-box'>
										<a href={`tel:${doctor.phone}`} onClick={(e) => !doctor.phone && e.preventDefault()}>
											<PhoneOutlined className='contact-icon' />
											<span>{doctor.phone || <i style={{ color: '#bfbfbf', fontWeight: 'normal' }}>Chưa cập nhật SĐT</i>}</span>
										</a>
										<a href={`mailto:${doctor.email}`}>
											<MailOutlined className='contact-icon' />
											<span>{doctor.email}</span>
										</a>
									</div>

									{/* Certificate */}
									{doctor.certificate_url ? (
										<Button
											className='certificate-btn'
											icon={<FilePdfOutlined />}
											onClick={() => window.open(doctor.certificate_url, '_blank')}
										>
											Xem chứng chỉ hành nghề (PDF)
										</Button>
									) : (
										<span className='no-certificate'>
											⚠️ Chưa đính kèm chứng chỉ hành nghề
										</span>
									)}
								</div>

								{/* Footer Actions */}
								<div className='vet-card-footer'>
									<Button
										icon={<EditOutlined />}
										className='edit-btn'
										onClick={() => handleOpenEditModal(doctor)}
									>
										Sửa hồ sơ
									</Button>
									<Popconfirm
										title='Bạn chắc chắn muốn xóa bác sĩ này?'
										okText='Xóa'
										cancelText='Hủy'
										okButtonProps={{ danger: true }}
										onConfirm={() => handleDeleteDoctor(doctor.id)}
									>
										<Button
											type='primary'
											danger
											icon={<DeleteOutlined />}
											className='delete-btn'
										>
											Xóa
										</Button>
									</Popconfirm>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Modal */}
			<Modal
				title={editingDoctorId ? 'Cập Nhật Hồ Sơ Bác Sĩ' : 'Thêm Bác Sĩ Thú Y Mới'}
				visible={modalVisible}
				onCancel={handleCloseModal}
				footer={[
					<Button key='cancel' onClick={handleCloseModal} className='cancel-btn'>
						Hủy bỏ
					</Button>,
					<Button
						key='submit'
						onClick={handleSubmit}
						loading={formLoading}
						className='submit-btn'
					>
						Lưu thông tin
					</Button>,
				]}
				className='vet-modal'
				width={600}
				destroyOnClose
			>
				<Form form={form} layout='vertical' requiredMark>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='full_name'
								label='Họ và tên bác sĩ'
								rules={[{ required: true, message: 'Vui lòng nhập họ tên bác sĩ!' }]}
							>
								<Input placeholder='VD: BS. Phạm Thị Hoa' className='form-input' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='email'
								label='Địa chỉ Email'
								rules={[
									{ required: true, message: 'Vui lòng nhập địa chỉ email!' },
									{ type: 'email', message: 'Email nhập vào không hợp lệ!' },
								]}
							>
								<Input placeholder='VD: hoa.vet@mypet.dev' className='form-input' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='phone'
								label='Số điện thoại liên lạc'
								rules={[{ pattern: /^[0-9+ ]{10,15}$/, message: 'Số điện thoại không đúng định dạng!' }]}
							>
								<Input placeholder='VD: 0934567890' className='form-input' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='specialization'
								label='Chuyên khoa phụ trách'
								rules={[{ required: true, message: 'Vui lòng nhập chuyên khoa bác sĩ!' }]}
							>
								<Input placeholder='VD: Nội khoa & Ngoại khoa thú y' className='form-input' />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name='avatar_url'
						label='Đường dẫn ảnh đại diện (URL)'
						extra='Nên nhập link ảnh từ Unsplash. Để trống sẽ tự động áp dụng ảnh mặc định.'
					>
						<Input placeholder='VD: https://images.unsplash.com/...' className='form-input' />
					</Form.Item>

					<Form.Item
						name='certificate_url'
						label='Đường dẫn Chứng chỉ hành nghề (PDF / URL)'
						extra='VD: https://cdn.mypet.dev/certs/hoa_cert.pdf'
					>
						<Input placeholder='VD: https://...' className='form-input' />
					</Form.Item>

					<Form.Item name='bio' label='Giới thiệu tóm tắt (Tiểu sử)'>
						<TextArea
							rows={4}
							placeholder='Giới thiệu ngắn gọn về kinh nghiệm, bằng cấp và thế mạnh chuyên môn...'
							className='form-input'
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyBacSi;
