import { useState, useEffect } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import {
	SyncOutlined,
	ExclamationCircleOutlined,
	ArrowRightOutlined,
} from '@ant-design/icons';
import { Search, PawPrint, UserCheck, HeartPulse, CalendarDays, PhoneCall, Mail } from 'lucide-react';
import CountUp from 'react-countup';
import Chart from 'react-apexcharts';
import { Modal } from 'antd';
import HeaderProfile from '@/components/HeaderProfile';
import './components/style.less';

// ─── Metric Cards Data ────────────────────────

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
		fontFamily: 'Quicksand, sans-serif',
		zoom: { enabled: false },
	},
	colors: ['#D4A017'], // Honey Gold
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 1,
			opacityFrom: 0.25,
			opacityTo: 0,
			stops: [0, 90, 100],
		},
	},
	stroke: { curve: 'smooth', width: 4 },
	grid: {
		show: false, // Remove harsh grid lines
		padding: {
			top: 20,
			bottom: 10,
			left: 10,
			right: 10
		}
	},
	xaxis: {
		categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
		axisBorder: { show: true, color: '#E5E0D8' },
		axisTicks: { show: false },
		labels: {
			style: {
				colors: ['#7A756E', '#7A756E', '#2A3D2E', '#7A756E', '#7A756E', '#7A756E', '#7A756E'], // Highlight T4
				fontSize: '13px',
				fontWeight: 500
			}
		},
	},
	yaxis: {
		labels: { show: false },
		min: 0,
		max: 45,
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

// Dynamic Chart options and series will be handled inside the component

// ─── Status Donut Chart ───────────────────────
const statusDonutOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'donut',
		fontFamily: 'Quicksand, sans-serif',
	},
	labels: ['Đã khám', 'Chờ khám', 'Hủy lịch', 'Khẩn cấp'],
	colors: ['#D4A017', '#E8C547', '#E5E0D8', '#B88A12'], // Honey Gold palette
	stroke: { width: 6, colors: ['#FFFFFF'] },
	plotOptions: {
		pie: {
			donut: {
				size: '80%',
				labels: {
					show: true,
					name: { fontSize: '12px', fontWeight: 700, color: '#5A554E', offsetY: 25 },
					value: { fontSize: '42px', fontWeight: 800, color: '#2D2A26', offsetY: -10 },
					total: {
						show: true,
						label: 'HOÀN TẤT',
						fontSize: '14px',
						fontWeight: 800,
						color: '#0D0B0A',
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

const statusDonutSeriesData = (stats: any) => [
	stats?.appointments_completed || 0,
	stats?.appointments_pending || 0,
	stats?.appointments_cancelled || 0,
	stats?.appointments_confirmed || 0,
];

const getDynamicDonutOptions = (stats: any): ApexCharts.ApexOptions => ({
	...statusDonutOptions,
	plotOptions: {
		pie: {
			donut: {
				...statusDonutOptions.plotOptions?.pie?.donut,
				labels: {
					...statusDonutOptions.plotOptions?.pie?.donut?.labels,
					total: {
						...statusDonutOptions.plotOptions?.pie?.donut?.labels?.total,
						formatter: (w) => {
							const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
							if (total === 0) return '0%';
							const percent = Math.round((w.globals.seriesTotals[0] / total) * 100);
							return `${percent}%`;
						}
					}
				}
			}
		}
	}
});
const growthChartOptions: ApexCharts.ApexOptions = {
	chart: {
		type: 'bar',
		toolbar: { show: false },
		fontFamily: 'Quicksand, sans-serif',
	},
	colors: ['#D4A017'],
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
		labels: { style: { colors: '#7A756E', fontSize: '12px', fontWeight: 500 } },
	},
	yaxis: {
		labels: { style: { colors: '#7A756E', fontSize: '12px', fontWeight: 500 } },
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

const KPICard = ({ item }: { item: any }) => (
	<div className={`pc-metric-card ${item.color}`}>
		<div className="metric-icon-box">{item.icon}</div>
		<div className="metric-content">
			<div className="metric-label">{item.label}</div>
			<div className="metric-value">
				<CountUp end={item.value} duration={1.5} separator="," />
			</div>
			<div className="metric-sub" style={{ color: item.trendDir === 'up' ? '#059669' : '#E11D48' }}>
				{item.trend} so với tháng trước
			</div>
		</div>
	</div>
);

const LegendItem = ({ color, label, count }: { color: string; label: string; count: number }) => (
	<div className="legend-item">
		<div className="legend-dot" style={{ backgroundColor: color }} />
		<span className="legend-label">{label}</span>
		<span className="legend-count">{count}</span>
	</div>
);

import { getDashboardStats } from '@/services/QuanLyPetStore';

const TrangChu = () => {
	const [filterPeriod, setFilterPeriod] = useState('7 days');
	const [searchQuery, setSearchQuery] = useState('');
	const [stats, setStats] = useState<any>(null);
	const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);

	useEffect(() => {
		const fetchStats = async () => {
			const data = await getDashboardStats();
			setStats(data);
		};
		fetchStats();
	}, []);

	// Handle button clicks
	const handleViewAllNotifs = () => {
		setIsNotifModalOpen(true);
	};

	const handleBannerClick = (type: string) => {
		if (type === 'spa') {
			message.success('Đang chuyển đến trang Đặt lịch...');
			history.push('/quan-ly-lich-hen');
		} else {
			setIsContactModalOpen(true);
		}
	};

	const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilterPeriod(e.target.value);
		message.success(`Đã cập nhật dữ liệu biểu đồ theo: ${e.target.options[e.target.selectedIndex].text}`);
	};

	// Dynamic data derivations
	const displayedNotifs = NOTIFICATIONS.filter(item =>
		item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		item.desc.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getAppointmentSeries = () => {
		if (filterPeriod === '30 days') return [{ name: 'Lịch hẹn', data: [45, 52, 38, 60, 48, 72, 65] }];
		if (filterPeriod === '3 months') return [{ name: 'Lịch hẹn', data: [120, 145, 110, 180, 135, 210, 190] }];
		return [{ name: 'Lịch hẹn', data: [18, 22, 15, 28, 20, 35, 24] }];
	};

	const dynamicChartOptions: ApexCharts.ApexOptions = {
		...appointmentChartOptions,
		xaxis: {
			...appointmentChartOptions.xaxis,
			categories: filterPeriod === '7 days' ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] :
				filterPeriod === '30 days' ? ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7'] :
					['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7']
		}
	};

	// Mapping dữ liệu từ API vào UI
	const dynamicKPI = [
		{
			label: 'Tổng thú cưng',
			value: stats?.total_pets || 4,
			trend: '+12.5%',
			trendDir: 'up',
			icon: <PawPrint size={24} strokeWidth={1.75} />,
			color: 'pink',
		},
		{
			label: 'Tổng khách hàng',
			value: stats?.total_owners || 2,
			trend: '+8.2%',
			trendDir: 'up',
			icon: <UserCheck size={24} strokeWidth={1.75} />,
			color: 'warm',
		},
		{
			label: 'Tổng bác sĩ',
			value: stats?.total_vets || 2,
			trend: '+5.7%',
			trendDir: 'up',
			icon: <HeartPulse size={24} strokeWidth={1.75} />,
			color: 'mint',
		},
		{
			label: 'Tổng lịch hẹn',
			value: stats?.total_users || 6,
			trend: '+2.1%',
			trendDir: 'up',
			icon: <CalendarDays size={24} strokeWidth={1.75} />,
			color: 'peach',
		},
	];

	return (
		<div className="petcare-dashboard">

			{/* ── KPI Cards ───────────────────── */}
			<div className="pc-metrics-grid">
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
							onChange={handleFilterChange}
						>
							<option value="7 days">7 ngày qua</option>
							<option value="30 days">30 ngày qua</option>
							<option value="3 months">3 tháng qua</option>
						</select>
					</div>
					<div className="pc-card-body">
						<Chart options={dynamicChartOptions} series={getAppointmentSeries()} type="area" height={280} />
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
						<Chart options={getDynamicDonutOptions(stats)} series={statusDonutSeriesData(stats)} type="donut" height={260} />
						<div className="donut-legends">
							<LegendItem color="#D4A017" label="Đã khám" count={stats?.appointments_completed || 0} />
							<LegendItem color="#E8C547" label="Chờ khám" count={stats?.appointments_pending || 0} />
							<LegendItem color="#E5E0D8" label="Hủy lịch" count={stats?.appointments_cancelled || 0} />
							<LegendItem color="#B88A12" label="Khẩn cấp" count={stats?.appointments_confirmed || 0} />
						</div>
					</div>
				</div>
			</div>

			{/* ── Row 2: Growth Chart (Full Width) ── */}
			<div className="pc-full-row">
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
						<button type="button" className="banner-btn" onClick={() => handleBannerClick('spa')}>
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
						<button type="button" className="banner-btn" onClick={() => handleBannerClick('health')}>
							Liên hệ ngay <ArrowRightOutlined />
						</button>
					</div>
				</div>
			</div>

			{/* Modal Xem Tất cả Thông báo */}
			<Modal
				title={<h3>Tất cả thông báo 🔔</h3>}
				visible={isNotifModalOpen}
				onCancel={() => setIsNotifModalOpen(false)}
				footer={null}
				width={600}
			>
				<div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px 0' }}>
					{NOTIFICATIONS.map((item, idx) => (
						<div key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid #E5E0D8', display: 'flex', gap: '16px', alignItems: 'center' }}>
							<div style={{ color: item.type === 'success' ? '#0F5132' : '#842029', background: item.type === 'success' ? '#D1E7DD' : '#F8D7DA', padding: '12px', borderRadius: '50%' }}>
								{item.type === 'success' ? <SyncOutlined style={{ fontSize: '18px' }} /> : <ExclamationCircleOutlined style={{ fontSize: '18px' }} />}
							</div>
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 600, color: '#4A3F35', fontSize: '15px' }}>{item.title}</div>
								<div style={{ color: '#7D6E5D', fontSize: '13px', marginTop: '4px' }}>{item.desc}</div>
							</div>
							<div style={{ fontSize: '12px', color: '#B5AFA5' }}>{item.time}</div>
						</div>
					))}
				</div>
			</Modal>

			{/* Modal Liên Hệ */}
			<Modal
				title={<h3>Thông tin liên hệ 🏥</h3>}
				visible={isContactModalOpen}
				onCancel={() => setIsContactModalOpen(false)}
				footer={null}
			>
				<div style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
					<p style={{ color: '#7D6E5D', fontSize: '15px' }}>Đội ngũ y bác sĩ thú y của chúng tôi sẵn sàng hỗ trợ sức khỏe thú cưng của bạn 24/7. Vui lòng liên hệ qua các kênh dưới đây:</p>
					
					<div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#FFF8F2', padding: '16px', borderRadius: '12px' }}>
						<div style={{ background: '#D4A017', color: '#FFF', padding: '12px', borderRadius: '50%' }}><PhoneCall size={24} /></div>
						<div>
							<h4 style={{ margin: 0, color: '#4A3F35' }}>Hotline Cấp cứu 24/7</h4>
							<div style={{ fontSize: '18px', fontWeight: 'bold', color: '#D4A017', marginTop: '4px' }}>1900 1088</div>
						</div>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#FFF8F2', padding: '16px', borderRadius: '12px' }}>
						<div style={{ background: '#A7F3D0', color: '#065F46', padding: '12px', borderRadius: '50%' }}><Mail size={24} /></div>
						<div>
							<h4 style={{ margin: 0, color: '#4A3F35' }}>Email Hỗ trợ</h4>
							<div style={{ fontSize: '16px', fontWeight: 'bold', color: '#065F46', marginTop: '4px' }}>support@mypet.com</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default TrangChu;
