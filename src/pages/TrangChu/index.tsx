import { useState } from 'react';
import { useModel } from 'umi';
import {
	UserOutlined,
	MedicineBoxOutlined,
	CalendarOutlined,
	ArrowRightOutlined,
	SearchOutlined,
	SyncOutlined,
	ExclamationCircleOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import './components/style.less';

// ─── Metric Cards Data ────────────────────────
const METRICS = [
	{
		label: 'Tổng người dùng',
		value: 1248,
		sub: '+12% tháng này',
		icon: 'user',
		color: 'warm',
	},
	{
		label: 'Bác sĩ',
		value: 56,
		sub: '+2 nhân sự mới',
		icon: 'doctor',
		color: 'mint',
	},
	{
		label: 'Thú cưng',
		value: 3892,
		sub: '+45 đăng ký',
		icon: 'paw',
		color: 'pink',
	},
	{
		label: 'Lịch hẹn',
		value: 156,
		sub: 'Hôm nay',
		icon: 'calendar',
		color: 'peach',
	},
];

// ─── Notifications Data ───────────────────────
const NOTIFICATIONS = [
	{
		title: 'Cập nhật hệ thống thành công',
		desc: 'Phiên bản 2.4.0 — Nâng cấp toàn bộ module',
		time: '10 phút trước',
		type: 'success',
	},
	{
		title: 'Cảnh báo tồn kho thuốc',
		desc: 'Thuốc Paracetamol cho chó dưới 10 đơn vị',
		time: '1 giờ trước',
		type: 'warning',
	},
	{
		title: 'Bác sĩ mới gia nhập',
		desc: 'BS. Nguyễn Văn Minh đã tham gia đội ngũ',
		time: '3 giờ trước',
		type: 'success',
	},
	{
		title: 'Lịch hẹn quá hạn',
		desc: 'Thú cưng "Buddy" bỏ lỡ lịch khám định kỳ',
		time: '5 giờ trước',
		type: 'warning',
	},
];

// ─── Appointment Line Chart ───────────────────
const appointmentChartOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'area',
		toolbar: { show: false },
		fontFamily: 'Inter, sans-serif',
		zoom: { enabled: false },
	},
	colors: ['#4A5B3E'], // Dark olive green
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 1,
			opacityFrom: 0.15,
			opacityTo: 0.02,
			stops: [0, 90, 100],
		},
	},
	stroke: { curve: 'smooth', width: 3 },
	grid: {
		show: false, // Remove harsh grid lines
	},
	xaxis: {
		categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
		axisBorder: { show: true, color: '#E5E0D8' },
		axisTicks: { show: false },
		labels: {
			style: {
				colors: ['#B5AFA5', '#B5AFA5', '#4A5B3E', '#B5AFA5', '#B5AFA5', '#B5AFA5', '#B5AFA5'], // Highlight T4
				fontSize: '13px',
				fontWeight: [500, 500, 800, 500, 500, 500, 500]
			}
		},
	},
	yaxis: {
		labels: { show: false },
	},
	tooltip: {
		theme: 'light',
		y: { formatter: (val: number) => `${val} lịch hẹn` },
	},
	dataLabels: { enabled: false },
	markers: {
		size: 0, // Clean line without dots unless hovered
		hover: { size: 6, sizeOffset: 3 },
	},
};

const appointmentSeries = [
	{ name: 'Lịch hẹn', data: [18, 22, 15, 28, 20, 35, 24] },
];

// ─── Status Donut Chart ───────────────────────
const statusDonutOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'donut',
		fontFamily: 'Inter, sans-serif',
	},
	labels: ['Đã khám', 'Chờ khám', 'Hủy lịch', 'Khẩn cấp'],
	colors: ['#4A5B3E', '#166E75', '#F5EEDC', '#943B42'],
	stroke: { width: 6, colors: ['#FFFFFF'] },
	plotOptions: {
		pie: {
			donut: {
				size: '80%',
				labels: {
					show: true,
					name: { fontSize: '12px', fontWeight: 700, color: '#8A8478', offsetY: 25 },
					value: { fontSize: '42px', fontWeight: 800, color: '#2D2A26', offsetY: -10 },
					total: {
						show: true,
						label: 'HOÀN TẤT',
						fontSize: '12px',
						fontWeight: 700,
						color: '#B5AFA5',
						formatter: () => '75%',
					},
				},
			},
		},
	},
	legend: { show: false },
	dataLabels: { enabled: false },
	tooltip: {
		y: { formatter: (val: number) => `${val} lịch hẹn` },
	},
};

const statusDonutSeries = [117, 26, 8, 5];

// ─── Growth Bar Chart ─────────────────────────
const growthChartOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'bar',
		toolbar: { show: false },
		fontFamily: 'Inter, sans-serif',
	},
	colors: ['#C9A96E'],
	plotOptions: {
		bar: {
			borderRadius: 8,
			columnWidth: '45%',
		},
	},
	grid: {
		borderColor: '#F0EDE8',
		strokeDashArray: 4,
		xaxis: { lines: { show: false } },
	},
	xaxis: {
		categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
		axisBorder: { show: false },
		axisTicks: { show: false },
		labels: { style: { colors: '#B5AFA5', fontSize: '12px', fontWeight: 500 } },
	},
	yaxis: {
		labels: { style: { colors: '#B5AFA5', fontSize: '12px', fontWeight: 500 } },
	},
	dataLabels: { enabled: false },
	tooltip: {
		theme: 'light',
		y: { formatter: (val: number) => `${val} khách hàng` },
	},
};

const growthSeries = [
	{ name: 'Khách hàng', data: [180, 220, 260, 310, 380, 420] },
];

// ─── Sub Components ───────────────────────────
const MetricCard = ({ item }: { item: typeof METRICS[0] }) => {
	const iconMap: Record<string, React.ReactNode> = {
		user: <UserOutlined />,
		doctor: <MedicineBoxOutlined />,
		paw: <span style={{ fontSize: 22 }}>🐾</span>,
		calendar: <CalendarOutlined />,
	};

	return (
		<div className={`pc-metric-card ${item.color}`}>
			<div className="metric-icon-box">{iconMap[item.icon]}</div>
			<div className="metric-content">
				<div className="metric-label">{item.label}</div>
				<div className="metric-value">
					<CountUp end={item.value} duration={1.5} separator="," />
				</div>
				<div className="metric-sub">{item.sub}</div>
			</div>
		</div>
	);
};

const NotificationItem = ({ item }: { item: typeof NOTIFICATIONS[0] }) => (
	<div className={`notif-item ${item.type}`}>
		<div className="notif-icon-box">
			{item.type === 'success' ? <SyncOutlined /> : <ExclamationCircleOutlined />}
		</div>
		<div className="notif-content">
			<div className="notif-title">{item.title}</div>
			<div className="notif-desc">{item.desc}</div>
		</div>
		<div className="notif-time">{item.time}</div>
	</div>
);

const ActivityItem = ({ item, isLast }: { item: typeof ACTIVITIES[0]; isLast: boolean }) => (
	<li className="activity-item">
		<div className="activity-dot-wrapper">
			<div className={`activity-dot ${item.dot}`} />
			{!isLast && <div className="activity-line" />}
		</div>
		<div className="activity-content">
			<div className="activity-title">{item.title}</div>
			<div className="activity-time">{item.desc} · {item.time}</div>
		</div>
	</li>
);

const UserItem = ({ user, rank }: { user: typeof TOP_USERS[0]; rank: number }) => {
	const rankClass = rank === 0 ? 'gold' : rank === 1 ? 'silver' : rank === 2 ? 'bronze' : 'default';
	return (
		<li className="user-item">
			<div className={`user-rank ${rankClass}`}>{rank + 1}</div>
			<div className="user-avatar">
				<img src={user.avatar} alt={user.name} />
			</div>
			<div className="user-info">
				<div className="user-name">{user.name}</div>
				<div className="user-pets">{user.pets} thú cưng</div>
			</div>
			<div className="user-spending">{user.spending}</div>
		</li>
	);
};

const PetStatBar = ({ stat }: { stat: typeof PET_STATS[0] }) => {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setWidth(Math.round((stat.count / stat.total) * 100));
		}, 300);
		return () => clearTimeout(timer);
	}, [stat]);

	return (
		<li className="pet-stat-item">
			<div className="pet-stat-top">
				<div className="pet-stat-label">
					<span className="pet-stat-emoji">{stat.emoji}</span>
					{stat.label}
				</div>
				<div className="pet-stat-count">{stat.count}</div>
			</div>
			<div className="pet-stat-bar">
				<div
					className={`pet-stat-fill ${stat.color}`}
					style={{ width: `${width}%` }}
				/>
			</div>
		</li>
	);
};

import { getDashboardStats } from '@/services/QuanLyPetStore';

const TrangChu = () => {
	const [activePeriod, setActivePeriod] = useState('12T');
	const [stats, setStats] = useState<any>(null);

	useEffect(() => {
		const fetchStats = async () => {
			const data = await getDashboardStats();
			setStats(data);
		};
		fetchStats();
	}, []);

	// Mapping dữ liệu từ API vào UI
	const dynamicKPI = [
		{
			label: 'Tổng thú cưng',
			value: stats?.total_pets || 0,
			trend: '+12.5%',
			trendDir: 'up',
			icon: '🐾',
			color: 'emerald',
		},
		{
			label: 'Tổng khách hàng',
			value: stats?.total_owners || 0,
			trend: '+8.2%',
			trendDir: 'up',
			icon: '👥',
			color: 'indigo',
		},
		{
			label: 'Tổng bác sĩ',
			value: stats?.total_vets || 0,
			trend: '+5.7%',
			trendDir: 'up',
			icon: '🩺',
			color: 'rose',
		},
		{
			label: 'Tổng tài khoản',
			value: stats?.total_users || 0,
			trend: '+2.1%',
			trendDir: 'up',
			icon: '👤',
			color: 'amber',
		},
	];

	return (
		<div className="petcare-dashboard">
			{/* ── Header ──────────────────────── */}
			<div className="pc-header">
				<div className="pc-header-left">
					{/* Empty spacer to balance the layout */}
				</div>
				<div className="pc-header-center">
					<div className="pc-header-search">
						<SearchOutlined className="search-icon" />
						<input type="text" placeholder="Tìm kiếm thú cưng, khách hàng..." />
					</div>
				</div>
				<div className="pc-header-actions">
					<div className="pc-user-profile">
						<div className="pc-user-info">
							<span className="pc-user-name">Administrator</span>
						</div>
						<div className="pc-user-avatar">
							<img src={data?.results?.[0]?.picture?.thumbnail || "https://i.pravatar.cc/150?img=12"} alt="User Avatar" />
						</div>
					</div>
				</div>
			</div>

			{/* ── KPI Cards ───────────────────── */}
			<div className="kpi-grid">
				{dynamicKPI.map((item, idx) => (
					<KPICard key={idx} item={item} />
				))}
			</div>

			{/* ── Row 1: Appointment Stats + Status ── */}
			<div className="pc-charts-row">
				{/* Appointment Line Chart */}
				<div className="pc-card pc-chart-line">
					<div className="pc-card-header">
						<div>
							<h3>Thống kê lịch hẹn</h3>
							<p className="pc-card-subtitle">Dữ liệu hàng tuần</p>
						</div>
						<select
							className="pc-dropdown"
							value={filterPeriod}
							onChange={(e) => setFilterPeriod(e.target.value)}
						>
							<option value="7 days">7 ngày qua</option>
							<option value="30 days">30 ngày qua</option>
							<option value="3 months">3 tháng qua</option>
						</select>
					</div>
					<div className="pc-card-body">
						<Chart options={appointmentChartOptions} series={appointmentSeries} type="area" height={280} />
					</div>
				</div>

				{/* Status Donut */}
				<div className="pc-card pc-chart-donut">
					<div className="pc-card-header">
						<div>
							<h3>Trạng thái</h3>
							<p className="pc-card-subtitle">Phân bổ hôm nay</p>
						</div>
					</div>
					<div className="pc-card-body donut-body">
						<Chart options={statusDonutOptions} series={statusDonutSeries} type="donut" height={260} />
						<div className="donut-legends">
							<LegendItem color="#4A5B3E" label="Đã khám" count={117} />
							<LegendItem color="#166E75" label="Chờ khám" count={26} />
							<LegendItem color="#F5EEDC" label="Hủy lịch" count={8} />
							<LegendItem color="#943B42" label="Khẩn cấp" count={5} />
						</div>
					</div>
				</div>
			</div>

			{/* ── Row 2: Growth + Notifications ── */}
			<div className="pc-charts-row">
				{/* Growth Chart */}
				<div className="pc-card pc-chart-bar">
					<div className="pc-card-header">
						<div>
							<h3>Tăng trưởng khách hàng</h3>
							<p className="pc-card-subtitle">Th1 — Th6 2026</p>
						</div>
					</div>
					<div className="pc-card-body">
						<Chart options={growthChartOptions} series={growthSeries} type="bar" height={280} />
					</div>
				</div>

				{/* System Notifications */}
				<div className="pc-card pc-notifications">
					<div className="pc-card-header">
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<h3>Thông báo hệ thống</h3>
							<span className="notif-badge-new">Mới</span>
						</div>
						<a className="pc-view-all">
							Xem tất cả <ArrowRightOutlined />
						</a>
					</div>
					<div className="pc-card-body notif-body">
						{NOTIFICATIONS.map((item, idx) => (
							<NotificationItem key={idx} item={item} />
						))}
					</div>
				</div>
			</div>

			{/* ── Banner Section ────────────────── */}
			<div className="pc-banners-row">
				<div className="pc-banner banner-spa">
					<div className="banner-overlay" />
					<img
						src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600"
						alt="Dog spa"
					/>
					<div className="banner-content">
						<h3>Chăm sóc tận tâm 🐕</h3>
						<p>Dịch vụ spa cao cấp dành riêng cho thú cưng của bạn</p>
						<button type="button" className="banner-btn">
							Khám phá <ArrowRightOutlined />
						</button>
					</div>
				</div>

				<div className="pc-banner banner-health">
					<div className="banner-overlay" />
					<img
						src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600"
						alt="Cat health"
					/>
					<div className="banner-content">
						<h3>Sức khỏe là trên hết 🐈</h3>
						<p>Đội ngũ bác sĩ giàu kinh nghiệm luôn sẵn sàng 24/7</p>
						<button type="button" className="banner-btn">
							Liên hệ ngay <ArrowRightOutlined />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrangChu;
