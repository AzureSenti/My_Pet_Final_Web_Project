import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Select, message } from 'antd';
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
import HeaderProfile from '@/components/HeaderProfile';
import './style.less';

import { getDoctors, deleteDoctor, toggleDoctorStatus, createDoctor } from '@/services/QuanLyPetStore';

const QuanLyBacSi: React.FC = () => {
	const [doctors, setDoctors] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await getDoctors();
			setDoctors(data);
		} catch (error) {
			message.error('Không thể tải danh sách bác sĩ');
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchData();
	}, []);

	const handleAddDoctor = async (values: any) => {
		const success = await createDoctor({
			full_name: values.full_name,
			email: values.email,
			password: 'VetPassword123@',
			specialization: values.specialization,
			bio: values.scheduleOrSchool,
			certificate_url: values.avatar || '',
		});
		if (success) {
			setIsModalOpen(false);
			form.resetFields();
			fetchData();
		}
	};

	const handleDeleteDoctor = (id: string) => {
		deleteDoctor(id).then(fetchData);
	};

	const handleApproveDoctor = (id: string) => {
		toggleDoctorStatus(id).then(fetchData);
	};
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
					<HeaderProfile />
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
						<button className="um-add-btn" onClick={() => setIsModalOpen(true)}>
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
						<div className="icon-top" style={{ color: '#B91C1C', background: '#FEE2E2', padding: '8px', borderRadius: '50%', display: 'inline-flex' }}>
							<Asterisk size={24} />
						</div>
						<h1>12</h1>
						<p>Đang Trực Hôm Nay</p>
					</div>
				</div>

				{/* 2. Lưới danh sách Bác sĩ (Doctor Cards Grid) */}
				<div className="doctor-grid" style={{ opacity: loading ? 0.6 : 1 }}>
					{doctors.map(doc => (
						<div className={`doctor-card ${!doc.is_active ? 'pending' : ''}`} key={doc.id}>
							{doc.is_active ? (
								<>
									<div className="card-header">
										<div className="avatar-wrapper">
											<img src={doc.avatar_url || 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150'} alt="Avatar" className="avatar-img" />
										</div>
										<div className="info">
											<h3>{doc.full_name}</h3>
											<p className="specialty" style={{ color: '#9F1239' }}>{doc.specialization}</p>
										</div>
										<div style={{ position: 'absolute', top: 0, right: 0 }}>
											<span className="badge" style={{ background: '#A7F3D0', color: '#064E3B', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
												Active
											</span>
										</div>
									</div>

									<div className="card-body">
										<div className="info-row">
											<Award size={18} className="icon" />
											<span>5 năm kinh nghiệm</span>
										</div>
										<div className="info-row">
											<Calendar size={18} className="icon" />
											<span>Thứ 2 - Thứ 6</span>
										</div>
										<div className="badges" style={{ marginTop: '8px' }}>
											<span className="badge">Chỉnh hình</span>
											<span className="badge">Nội khoa</span>
										</div>
									</div>

									<div className="card-footer" style={{ gap: '12px' }}>
										<button className="btn-schedule" style={{ flex: '0 0 85%' }}>
											Quản lý lịch trình
										</button>
										<button className="btn-icon danger" style={{ flex: '1' }} onClick={() => handleDeleteDoctor(doc.vet_id)}>
											<DeleteOutlined />
										</button>
									</div>
								</>
							) : (
								<>
									<div className="card-header">
										<div className="avatar-wrapper">
											<img src={doc.avatar_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150'} alt="Avatar" className="avatar-img" />
										</div>
										<div className="info">
											<h3>{doc.full_name}</h3>
											<p className="specialty" style={{ color: '#3D3835' }}>{doc.specialization}</p>
										</div>
									</div>

									<div className="card-body">
										<div className="info-row">
											<Award size={18} className="icon" />
											<span>Chờ cập nhật</span>
										</div>
										<div className="info-row">
											<GraduationCap size={18} className="icon" />
											<span>Hồ sơ đang xét duyệt</span>
										</div>
									</div>

									<div className="card-footer" style={{ flexDirection: 'column', gap: '0' }}>
										<button className="btn-approve" onClick={() => handleApproveDoctor(doc.vet_id)}>
											Duyệt hồ sơ
										</button>
										<span className="pending-link">
											Xem toàn bộ hồ sơ
										</span>
									</div>
								</>
							)}
						</div>
					))}

					{/* THẺ 3: Thẻ mời bác sĩ mới */}
					<div className="doctor-card invite-card" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
						<div className="invite-icon">
							<UserPlus size={32} />
						</div>
						<h3>Mời bác sĩ thú y</h3>
					</div>
				</div>
			</div>

			{/* Modal Thêm bác sĩ mới */}
			<Modal
				title={<h3>Thêm bác sĩ mới 🩺</h3>}
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
				<Form form={form} layout="vertical" onFinish={handleAddDoctor}>
					<Form.Item
						name="full_name"
						label="Họ và tên bác sĩ"
						rules={[{ required: true, message: 'Vui lòng nhập họ và tên bác sĩ!' }]}
					>
						<Input placeholder="Ví dụ: Dr. Nguyễn Văn A" />
					</Form.Item>
					<Form.Item
						name="email"
						label="Địa chỉ Email"
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' }
						]}
					>
						<Input placeholder="vet@mypet.dev" />
					</Form.Item>
					<Form.Item
						name="specialization"
						label="Chuyên môn"
						rules={[{ required: true, message: 'Vui lòng chọn chuyên môn!' }]}
						initialValue="Nội khoa thú y"
					>
						<Select>
							<Select.Option value="Nội khoa thú y">Nội khoa thú y</Select.Option>
							<Select.Option value="Ngoại khoa & Phẫu thuật">Ngoại khoa & Phẫu thuật</Select.Option>
							<Select.Option value="Da liễu & Dinh dưỡng">Da liễu & Dinh dưỡng</Select.Option>
							<Select.Option value="Nha khoa">Nha khoa</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="experience"
						label="Số năm kinh nghiệm"
						rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}
					>
						<Input type="number" placeholder="Ví dụ: 5" min={0} />
					</Form.Item>
					<Form.Item
						name="status"
						label="Trạng thái"
						initialValue="Active"
					>
						<Select>
							<Select.Option value="Active">Đang hoạt động (Active)</Select.Option>
							<Select.Option value="Pending">Chờ duyệt hồ sơ (Pending)</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="scheduleOrSchool"
						label="Lịch làm việc / Trường đào tạo"
						rules={[{ required: true, message: 'Vui lòng nhập thông tin này!' }]}
					>
						<Input placeholder="Ví dụ: Thứ 2, 4, 6 hoặc Đại học Thú y Hà Nội" />
					</Form.Item>
					<Form.Item
						name="badges"
						label="Kỹ năng chính (Cách nhau bởi dấu phẩy)"
					>
						<Input placeholder="Ví dụ: Phẫu thuật, Chăm sóc, Nha khoa" />
					</Form.Item>
					<Form.Item
						name="avatar"
						label="Đường dẫn ảnh đại diện (URL)"
					>
						<Input placeholder="Tùy chọn. Để trống sẽ tự sinh ảnh ngẫu nhiên." />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyBacSi;
