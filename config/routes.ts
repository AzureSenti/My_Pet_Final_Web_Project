export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Trang Chủ',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/quan-ly-nguoi-dung',
		name: 'Quản Lý Người Dùng',
		component: './QuanLyNguoiDung',
		icon: 'UserOutlined',
	},
	{
		path: '/quan-ly-thu-cung',
		name: 'Quản Lý Thú Cưng',
		component: './QuanLyThuCung',
		icon: 'GitlabOutlined',
	},
	{
		path: '/quan-ly-bac-si',
		name: 'Quản Lý Bác Sĩ',
		component: './QuanLyBacSi',
		icon: 'SolutionOutlined',
	},

	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
