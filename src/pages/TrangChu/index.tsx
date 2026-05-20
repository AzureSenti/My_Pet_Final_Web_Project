import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import {
	SearchOutlined,
	BellOutlined,
	RiseOutlined,
	FallOutlined,
	TeamOutlined,
	DollarOutlined,
	CalendarOutlined,
	EyeOutlined,
	MoreOutlined,
	ArrowRightOutlined,
} from '@ant-design/icons';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import './components/style.less';

// ─── Mock Data ────────────────────────────────
const KPI_DATA = [
	{
		label: 'Tổng thú cưng',
		value: 1284,
		trend: '+12.5%',
		trendDir: 'up',
		icon: '🐾',
		color: 'emerald',
	},
	{
		label: 'Khách hàng',
		value: 856,
		trend: '+8.2%',
		trendDir: 'up',
		icon: '👥',
		color: 'indigo',
	},
	{
		label: 'Doanh thu (triệu)',
		value: 42.5,
		trend: '+23.1%',
		trendDir: 'up',
		icon: '💰',
		color: 'amber',
		prefix: '',
		suffix: 'M₫',
		decimals: 1,
	},
	{
		label: 'Lịch hẹn hôm nay',
		value: 64,
		trend: '+5.7%',
		trendDir: 'up',
		icon: '📅',
		color: 'rose',
	},
];

const ACTIVITIES = [
	{
		title: 'Khách hàng mới',
		desc: 'Nguyễn Văn An đã đăng ký tài khoản',
		time: '2 phút trước',
		dot: 'emerald',
	},
	{
		title: 'Lịch hẹn mới',
		desc: 'Khám sức khỏe cho Lucky (Golden Retriever)',
		time: '15 phút trước',
		dot: 'indigo',
	},
	{
		title: 'Thú cưng mới',
		desc: 'Thêm mèo Mimi - giống British Shorthair',
		time: '32 phút trước',
		dot: 'amber',
	},
	{
		title: 'Thanh toán',
		desc: 'Trần Thị Bình thanh toán 2.500.000₫',
		time: '1 giờ trước',
		dot: 'emerald',
	},
	{
		title: 'Tắm & Grooming',
		desc: 'Hoàn thành grooming cho chó Bông',
		time: '2 giờ trước',
		dot: 'sky',
	},
	{
		title: 'Cập nhật hồ sơ',
		desc: 'BS. Lê Minh cập nhật bệnh án #1042',
		time: '3 giờ trước',
		dot: 'rose',
	},
];

const TOP_USERS = [
	{ name: 'Nguyễn Minh Anh', pets: 4, spending: '12.8M₫', avatar: 'https://i.pravatar.cc/150?img=1' },
	{ name: 'Trần Thu Hà', pets: 3, spending: '9.5M₫', avatar: 'https://i.pravatar.cc/150?img=5' },
	{ name: 'Lê Hoàng Nam', pets: 5, spending: '8.2M₫', avatar: 'https://i.pravatar.cc/150?img=3' },
	{ name: 'Phạm Quỳnh Chi', pets: 2, spending: '7.1M₫', avatar: 'https://i.pravatar.cc/150?img=9' },
	{ name: 'Đặng Văn Hùng', pets: 3, spending: '6.4M₫', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const PET_STATS = [
	{ emoji: '🐕', label: 'Chó', count: 524, total: 1284, color: 'emerald' },
	{ emoji: '🐈', label: 'Mèo', count: 389, total: 1284, color: 'indigo' },
	{ emoji: '🐦', label: 'Chim', count: 156, total: 1284, color: 'amber' },
	{ emoji: '🐹', label: 'Hamster', count: 118, total: 1284, color: 'rose' },
	{ emoji: '🐠', label: 'Cá', count: 97, total: 1284, color: 'sky' },
];

const TABLE_DATA = [
	{
		name: 'Lucky', breed: 'Golden Retriever', type: 'dog', emoji: '🐕',
		owner: 'Nguyễn Minh Anh', ownerAvatar: 'https://i.pravatar.cc/150?img=1',
		status: 'healthy', statusLabel: 'Khỏe mạnh',
		nextVisit: '25/05/2026', weight: '28kg',
	},
	{
		name: 'Mimi', breed: 'British Shorthair', type: 'cat', emoji: '🐈',
		owner: 'Trần Thu Hà', ownerAvatar: 'https://i.pravatar.cc/150?img=5',
		status: 'checkup', statusLabel: 'Cần khám',
		nextVisit: '22/05/2026', weight: '4.2kg',
	},
	{
		name: 'Bông', breed: 'Poodle', type: 'dog', emoji: '🐕',
		owner: 'Lê Hoàng Nam', ownerAvatar: 'https://i.pravatar.cc/150?img=3',
		status: 'healthy', statusLabel: 'Khỏe mạnh',
		nextVisit: '28/05/2026', weight: '6.5kg',
	},
	{
		name: 'Kiki', breed: 'Vẹt Cockatiel', type: 'bird', emoji: '🐦',
		owner: 'Phạm Quỳnh Chi', ownerAvatar: 'https://i.pravatar.cc/150?img=9',
		status: 'treatment', statusLabel: 'Đang điều trị',
		nextVisit: '21/05/2026', weight: '0.09kg',
	},
	{
		name: 'Nemo', breed: 'Cá vàng Oranda', type: 'fish', emoji: '🐠',
		owner: 'Đặng Văn Hùng', ownerAvatar: 'https://i.pravatar.cc/150?img=7',
		status: 'healthy', statusLabel: 'Khỏe mạnh',
		nextVisit: '30/05/2026', weight: '0.15kg',
	},
	{
		name: 'Chuột', breed: 'Syrian Hamster', type: 'hamster', emoji: '🐹',
		owner: 'Nguyễn Minh Anh', ownerAvatar: 'https://i.pravatar.cc/150?img=1',
		status: 'checkup', statusLabel: 'Cần khám',
		nextVisit: '24/05/2026', weight: '0.12kg',
	},
];

// ─── Chart Configs ────────────────────────────
const revenueChartOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'area',
		toolbar: { show: false },
		fontFamily: 'Inter, sans-serif',
		sparkline: { enabled: false },
		zoom: { enabled: false },
	},
	colors: ['#10B981', '#6366F1'],
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 1,
			opacityFrom: 0.3,
			opacityTo: 0.05,
			stops: [0, 90, 100],
		},
	},
	stroke: {
		curve: 'smooth',
		width: 2.5,
	},
	grid: {
		borderColor: '#F1F5F9',
		strokeDashArray: 4,
		xaxis: { lines: { show: false } },
		padding: { left: 8, right: 8 },
	},
	xaxis: {
		categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
		axisBorder: { show: false },
		axisTicks: { show: false },
		labels: {
			style: { colors: '#94A3B8', fontSize: '12px', fontWeight: 500 },
		},
	},
	yaxis: {
		labels: {
			style: { colors: '#94A3B8', fontSize: '12px', fontWeight: 500 },
			formatter: (val: number) => `${val}M`,
		},
	},
	tooltip: {
		theme: 'light',
		x: { format: 'Tháng ' },
		y: { formatter: (val: number) => `${val}M₫` },
	},
	legend: {
		position: 'top',
		horizontalAlign: 'right',
		fontSize: '12px',
		fontWeight: 500,
		markers: { width: 8, height: 8, radius: 4 },
		itemMargin: { horizontal: 12 },
	},
	dataLabels: { enabled: false },
};

const revenueSeries = [
	{
		name: 'Doanh thu',
		data: [18, 22, 19, 28, 25, 32, 30, 35, 38, 36, 40, 42.5],
	},
	{
		name: 'Chi phí',
		data: [12, 14, 13, 16, 15, 18, 17, 20, 22, 21, 23, 24],
	},
];

const donutChartOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'donut',
		fontFamily: 'Inter, sans-serif',
	},
	labels: ['Chó', 'Mèo', 'Chim', 'Hamster', 'Cá'],
	colors: ['#10B981', '#6366F1', '#F59E0B', '#F43F5E', '#0EA5E9'],
	stroke: { width: 3, colors: ['#FFFFFF'] },
	plotOptions: {
		pie: {
			donut: {
				size: '72%',
				labels: {
					show: true,
					name: { fontSize: '13px', fontWeight: 600, color: '#64748B' },
					value: { fontSize: '24px', fontWeight: 700, color: '#0F172A' },
					total: {
						show: true,
						label: 'Tổng cộng',
						fontSize: '12px',
						fontWeight: 500,
						color: '#94A3B8',
						formatter: (w: any) => {
							return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
						},
					},
				},
			},
		},
	},
	legend: {
		position: 'bottom',
		fontSize: '12px',
		fontWeight: 500,
		markers: { width: 8, height: 8, radius: 4 },
		itemMargin: { horizontal: 8, vertical: 4 },
	},
	dataLabels: { enabled: false },
	tooltip: {
		y: { formatter: (val: number) => `${val} thú cưng` },
	},
};

const donutSeries = [524, 389, 156, 118, 97];

// ─── Sub Components ───────────────────────────
const KPICard = ({ item }: { item: typeof KPI_DATA[0] }) => (
	<div className={`kpi-card ${item.color}`}>
		<div className="kpi-top">
			<div className="kpi-icon">{item.icon}</div>
			<div className={`kpi-trend ${item.trendDir}`}>
				{item.trendDir === 'up' ? <RiseOutlined /> : <FallOutlined />}
				{item.trend}
			</div>
		</div>
		<div className="kpi-value">
			<CountUp
				end={item.value}
				duration={1.5}
				decimals={item.decimals || 0}
				prefix={item.prefix || ''}
				suffix={item.suffix || ''}
				separator=","
			/>
		</div>
		<div className="kpi-label">{item.label}</div>
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

// ─── Main Dashboard ───────────────────────────
const TrangChu = () => {
	const { data } = useModel('randomuser');
	const [activePeriod, setActivePeriod] = useState('12T');

	return (
		<div className="saas-dashboard">
			{/* ── Header ──────────────────────── */}
			<div className="dash-header">
				<div className="dash-greeting">
					<h1>Xin chào! 👋</h1>
					<p>Tổng quan hệ thống quản lý thú cưng MyPet</p>
				</div>
			</div>

			{/* ── KPI Cards ───────────────────── */}
			<div className="kpi-grid">
				{KPI_DATA.map((item, idx) => (
					<KPICard key={idx} item={item} />
				))}
			</div>

			{/* ── Charts Row (Bento) ──────────── */}
			<div className="bento-charts">
				{/* Revenue Chart */}
				<div className="dash-card chart-revenue">
					<div className="dash-card-header">
						<h3>📊 Phân tích doanh thu</h3>
						<div className="period-selector">
							{['7N', '30N', '6T', '12T'].map((p) => (
								<button
									key={p}
									type="button"
									className={`period-btn ${activePeriod === p ? 'active' : ''}`}
									onClick={() => setActivePeriod(p)}
								>
									{p}
								</button>
							))}
						</div>
					</div>
					<div className="dash-card-body">
						<Chart options={revenueChartOptions} series={revenueSeries} type="area" height={310} />
					</div>
				</div>

				{/* Donut Chart */}
				<div className="dash-card chart-donut">
					<div className="dash-card-header">
						<h3>🐾 Phân loại thú cưng</h3>
						<span className="dash-card-badge">Tổng: 1,284</span>
					</div>
					<div className="dash-card-body">
						<Chart options={donutChartOptions} series={donutSeries} type="donut" height={310} />
					</div>
				</div>
			</div>

			{/* ── Activity Row (Bento) ────────── */}
			<div className="bento-activity">
				{/* Recent Activity */}
				<div className="dash-card">
					<div className="dash-card-header">
						<h3>⚡ Hoạt động gần đây</h3>
						<a className="view-all-link">
							Xem tất cả <ArrowRightOutlined />
						</a>
					</div>
					<div className="dash-card-body">
						<ul className="activity-list">
							{ACTIVITIES.map((item, idx) => (
								<ActivityItem key={idx} item={item} isLast={idx === ACTIVITIES.length - 1} />
							))}
						</ul>
					</div>
				</div>

				{/* Top Users */}
				<div className="dash-card">
					<div className="dash-card-header">
						<h3>🏆 Top khách hàng</h3>
						<a className="view-all-link">
							Xem tất cả <ArrowRightOutlined />
						</a>
					</div>
					<div className="dash-card-body">
						<ul className="user-list">
							{TOP_USERS.map((user, idx) => (
								<UserItem key={idx} user={user} rank={idx} />
							))}
						</ul>
					</div>
				</div>

				{/* Pet Statistics */}
				<div className="dash-card">
					<div className="dash-card-header">
						<h3>📈 Thống kê thú cưng</h3>
						<span className="dash-card-badge">Chi tiết</span>
					</div>
					<div className="dash-card-body">
						<ul className="pet-stats-list">
							{PET_STATS.map((stat, idx) => (
								<PetStatBar key={idx} stat={stat} />
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* ── Data Table ──────────────────── */}
			<div className="dash-table-section">
				<div className="dash-card dash-table">
					<div className="dash-card-header">
						<h3>🗂️ Danh sách thú cưng gần đây</h3>
						<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
							<button type="button" className="dash-btn secondary" style={{ padding: '6px 16px' }}>
								<CalendarOutlined /> Lọc
							</button>
							<button type="button" className="dash-btn primary" style={{ padding: '6px 16px' }}>
								+ Thêm mới
							</button>
						</div>
					</div>
					<div className="dash-card-body">
						<table className="modern-table">
							<thead>
								<tr>
									<th>Thú cưng</th>
									<th>Chủ nhân</th>
									<th>Trạng thái</th>
									<th>Cân nặng</th>
									<th>Lịch khám tiếp</th>
									<th style={{ width: 60 }}></th>
								</tr>
							</thead>
							<tbody>
								{TABLE_DATA.map((row, idx) => (
									<tr key={idx}>
										<td>
											<div className="table-pet-info">
												<div className={`table-pet-avatar ${row.type}`}>{row.emoji}</div>
												<div>
													<div className="table-pet-name">{row.name}</div>
													<div className="table-pet-breed">{row.breed}</div>
												</div>
											</div>
										</td>
										<td>
											<div className="table-owner">
												<div className="table-owner-avatar">
													<img src={row.ownerAvatar} alt={row.owner} />
												</div>
												{row.owner}
											</div>
										</td>
										<td>
											<span className={`table-status ${row.status}`}>{row.statusLabel}</span>
										</td>
										<td>{row.weight}</td>
										<td>
											<span className="date-badge">
												<CalendarOutlined /> {row.nextVisit}
											</span>
										</td>
										<td>
											<button type="button" className="table-action-btn">
												<MoreOutlined />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Summary Row */}
					<div className="summary-row">
						<div className="summary-item">
							<span className="summary-label">Tổng thú cưng</span>
							<span className="summary-value">1,284</span>
						</div>
						<div className="summary-item">
							<span className="summary-label">Khỏe mạnh</span>
							<span className="summary-value" style={{ color: '#10B981' }}>1,142</span>
						</div>
						<div className="summary-item">
							<span className="summary-label">Cần khám</span>
							<span className="summary-value" style={{ color: '#F59E0B' }}>98</span>
						</div>
						<div className="summary-item">
							<span className="summary-label">Đang điều trị</span>
							<span className="summary-value" style={{ color: '#F43F5E' }}>44</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrangChu;
