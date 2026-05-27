import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Tabs, Checkbox } from 'antd';
import { 
	User, 
	Mail, 
	Phone, 
	Shield, 
	Save, 
	Lock, 
	Camera, 
	CheckCircle, 
	ArrowLeft,
	Search
} from 'lucide-react';
import { history, useModel } from 'umi';
import HeaderProfile from '@/components/HeaderProfile';
import '../TrangChu/components/style.less';
import './style.less';

const HoSo: React.FC = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const [submitting, setSubmitting] = useState(false);
	const [form] = Form.useForm();
	const [securityForm] = Form.useForm();

	const currentUser = initialState?.currentUser as any;

	// Populate form with current user info
	useEffect(() => {
		if (currentUser) {
			form.setFieldsValue({
				family_name: currentUser.family_name || '',
				given_name: currentUser.given_name || '',
				name: currentUser.name || '',
				preferred_username: currentUser.preferred_username || '',
				email: currentUser.email || '',
				phone: currentUser.phone || '+84 987 654 321',
				picture: currentUser.picture || 'https://i.pravatar.cc/150?img=12'
			});
		}
	}, [currentUser, form]);

	const handleSaveProfile = async (values: any) => {
		setSubmitting(true);
		try {
			// Giả lập lưu API
			await new Promise((resolve) => setTimeout(resolve, 800));

			const updatedUser: any = {
				...currentUser,
				family_name: values.family_name,
				given_name: values.given_name,
				name: values.name || `${values.family_name} ${values.given_name}`.trim(),
				preferred_username: values.preferred_username,
				email: values.email,
				phone: values.phone,
				picture: values.picture,
				sub: currentUser?.sub || 'mock-id-123',
				ssoId: currentUser?.ssoId || 'mock-id-123',
				email_verified: currentUser?.email_verified ?? true,
				realm_access: currentUser?.realm_access || { roles: ['admin'] },
			};

			// Lưu vào localStorage
			localStorage.setItem('currentUser', JSON.stringify(updatedUser));

			// Cập nhật initial state để hiển thị ngay lập tức
			setInitialState({
				...initialState,
				currentUser: updatedUser,
			});

			message.success('Cập nhật thông tin hồ sơ thành công!');
		} catch (error) {
			console.error(error);
			message.error('Lỗi khi lưu thông tin. Vui lòng thử lại!');
		} finally {
			setSubmitting(false);
		}
	};

	const handleSaveSecurity = async (values: any) => {
		try {
			setSubmitting(true);
			await new Promise((resolve) => setTimeout(resolve, 800));
			message.success('Cập nhật mật khẩu và bảo mật thành công!');
			securityForm.resetFields();
		} catch (err) {
			message.error('Lỗi cập nhật bảo mật.');
		} finally {
			setSubmitting(false);
		}
	};

	const role = currentUser?.realm_access?.roles?.[0] || 'Administrator';
	const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
	const name = currentUser?.name || 'Admin';

	return (
		<div className="petcare-dashboard profile-page-wrapper">
			{/* Top Header Bar */}
			<div className="pc-header">
				<div className="pc-header-left">
					<button 
						type="button" 
						className="back-btn" 
						onClick={() => history.push('/dashboard')}
						style={{ 
							display: 'flex', alignItems: 'center', gap: '8px', 
							background: 'transparent', border: 'none', cursor: 'pointer',
							color: '#6B635B', fontWeight: 600, fontSize: '14px' 
						}}
					>
						<ArrowLeft size={18} /> Quay lại
					</button>
				</div>
				<div className="pc-header-center">
					<div className="pc-header-search">
						<Search size={18} strokeWidth={1.75} className="search-icon" />
						<input type="text" placeholder="Tìm kiếm hệ thống..." />
					</div>
				</div>
				<div className="pc-header-actions">
					<HeaderProfile />
				</div>
			</div>

			<div className="profile-content-layout">
				{/* Left Column: Avatar and Overview */}
				<div className="profile-sidebar-col">
					<Card className="profile-card-overview" bordered={false}>
						<div className="profile-avatar-section">
							<div className="profile-avatar-container">
								<img 
									src={currentUser?.picture || 'https://i.pravatar.cc/150?img=12'} 
									alt="Profile" 
								/>
								<div className="avatar-overlay">
									<Camera size={18} />
								</div>
							</div>
							<h2>{name}</h2>
							<span className="role-badge">{capitalizedRole}</span>
						</div>

						<hr className="divider" />

						<div className="profile-quick-stats">
							<div className="stat-row">
								<span className="stat-label">Trạng thái:</span>
								<span className="stat-val active">
									<CheckCircle size={14} className="icon-success" /> Hoạt động
								</span>
							</div>
							<div className="stat-row">
								<span className="stat-label">Email:</span>
								<span className="stat-val text-muted">{currentUser?.email || 'N/A'}</span>
							</div>
							<div className="stat-row">
								<span className="stat-label">Username:</span>
								<span className="stat-val text-muted">@{currentUser?.preferred_username || 'admin'}</span>
							</div>
						</div>
					</Card>
				</div>

				{/* Right Column: Detail Forms */}
				<div className="profile-forms-col">
					<Card className="profile-card-form" bordered={false}>
						<Tabs defaultActiveKey="info" className="profile-tabs">
							<Tabs.TabPane tab={
								<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<User size={16} /> Thông tin cá nhân
								</span>
							} key="info">
								<Form
									form={form}
									layout="vertical"
									onFinish={handleSaveProfile}
									className="profile-form-inner"
								>
									<div className="form-grid-2">
										<Form.Item
											name="family_name"
											label="Họ và tên đệm"
											rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
										>
											<Input placeholder="Nhập họ" prefix={<User size={16} className="input-icon" />} />
										</Form.Item>
										<Form.Item
											name="given_name"
											label="Tên"
											rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
										>
											<Input placeholder="Nhập tên" prefix={<User size={16} className="input-icon" />} />
										</Form.Item>
									</div>

									<div className="form-grid-2">
										<Form.Item
											name="name"
											label="Tên hiển thị đầy đủ"
											rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
										>
											<Input placeholder="Tên hiển thị" prefix={<User size={16} className="input-icon" />} />
										</Form.Item>
										<Form.Item
											name="preferred_username"
											label="Tên đăng nhập"
											rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
										>
											<Input placeholder="Username" prefix={<User size={16} className="input-icon" />} />
										</Form.Item>
									</div>

									<div className="form-grid-2">
										<Form.Item
											name="email"
											label="Địa chỉ Email"
											rules={[
												{ required: true, message: 'Vui lòng nhập email!' },
												{ type: 'email', message: 'Email không hợp lệ!' }
											]}
										>
											<Input placeholder="Email" prefix={<Mail size={16} className="input-icon" />} />
										</Form.Item>
										<Form.Item
											name="phone"
											label="Số điện thoại"
										>
											<Input placeholder="Số điện thoại" prefix={<Phone size={16} className="input-icon" />} />
										</Form.Item>
									</div>

									<Form.Item
										name="picture"
										label="Đường dẫn Avatar (URL)"
									>
										<Input placeholder="https://..." prefix={<Camera size={16} className="input-icon" />} />
									</Form.Item>

									<div className="form-actions">
										<Button 
											type="primary" 
											htmlType="submit" 
											loading={submitting}
											icon={<Save size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
											size="large"
											className="save-profile-btn"
										>
											Lưu thay đổi
										</Button>
									</div>
								</Form>
							</Tabs.TabPane>

							<Tabs.TabPane tab={
								<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<Lock size={16} /> Mật khẩu & Bảo mật
								</span>
							} key="security">
								<Form
									form={securityForm}
									layout="vertical"
									onFinish={handleSaveSecurity}
									className="profile-form-inner"
								>
									<Form.Item
										name="currentPassword"
										label="Mật khẩu hiện tại"
										rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
									>
										<Input.Password placeholder="••••••••" prefix={<Lock size={16} className="input-icon" />} />
									</Form.Item>

									<div className="form-grid-2">
										<Form.Item
											name="newPassword"
											label="Mật khẩu mới"
											rules={[
												{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
												{ min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' }
											]}
										>
											<Input.Password placeholder="••••••••" prefix={<Lock size={16} className="input-icon" />} />
										</Form.Item>
										<Form.Item
											name="confirmPassword"
											label="Xác nhận mật khẩu mới"
											dependencies={['newPassword']}
											rules={[
												{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
												({ getFieldValue }) => ({
													validator(_, value) {
														if (!value || getFieldValue('newPassword') === value) {
															return Promise.resolve();
														}
														return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
													},
												}),
											]}
										>
											<Input.Password placeholder="••••••••" prefix={<Lock size={16} className="input-icon" />} />
										</Form.Item>
									</div>

									<Form.Item name="twoFactor" valuePropName="checked">
										<Checkbox>
											Kích hoạt xác thực 2 lớp (2FA) bảo vệ tài khoản
										</Checkbox>
									</Form.Item>

									<div className="form-actions">
										<Button 
											type="primary" 
											htmlType="submit" 
											loading={submitting}
											icon={<Shield size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
											size="large"
											className="save-security-btn"
										>
											Cập nhật bảo mật
										</Button>
									</div>
								</Form>
							</Tabs.TabPane>
						</Tabs>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default HoSo;
