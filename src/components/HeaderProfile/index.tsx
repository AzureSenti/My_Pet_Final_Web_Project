import React from 'react';
import { Menu, Dropdown, Image } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import { ip3 } from '@/utils/ip';

const HeaderProfile: React.FC = () => {
	const { initialState, setInitialState } = useModel('@@initialState');

	const handleLogout = () => {
		// Xóa dữ liệu đăng nhập
		localStorage.removeItem('token');
		localStorage.removeItem('currentUser');
		localStorage.removeItem('refreshToken');

		// Cập nhật state
		setInitialState({
			...initialState,
			currentUser: undefined,
		});

		// Chuyển về trang login
		history.replace('/user/login');
	};

	const currentUser = initialState?.currentUser as any;
	const name = currentUser?.full_name || currentUser?.name || 'Người dùng';

	const getRoleLabel = (role: string) => {
		switch (role) {
			case 'admin': return 'Quản trị viên';
			case 'vet': return 'Bác sĩ thú y';
			case 'owner': return 'Chủ nuôi';
			default: return role || 'Administrator';
		}
	};
	const capitalizedRole = getRoleLabel(currentUser?.role);

	const rawAvatar = currentUser?.avatar_url || currentUser?.picture || '';
	const avatarUrl = rawAvatar
		? rawAvatar.startsWith('http')
			? rawAvatar
			: `${ip3}${rawAvatar.replace(/^\//, '')}`
		: 'https://i.pravatar.cc/150?img=12';

	const menuItems = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: 'Hồ sơ',
			onClick: () => {
				if (currentUser?.role === 'owner') {
					history.push('/khach-hang/ho-so');
				} else {
					history.push('/profile');
				}
			},
		},
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: handleLogout,
			danger: true,
		},
	];

	const menu = <Menu items={menuItems} />;

	return (
		<Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
			<div className="pc-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
				<div className="pc-user-avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Image
						src={avatarUrl}
						alt="User Avatar"
						width={44}
						height={44}
						style={{ objectFit: 'cover', borderRadius: '50%' }}
						preview={false}
						fallback="https://i.pravatar.cc/150?img=12"
					/>
				</div>
				<div className="pc-user-info" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
					<span className="pc-user-name" style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917', lineHeight: 1.2 }}>{name}</span>
					<span className="pc-user-role" style={{ fontSize: '12px', color: '#78716C', fontWeight: 500, marginTop: '4px' }}>{capitalizedRole}</span>
				</div>
			</div>
		</Dropdown>
	);
};

export default HeaderProfile;
