import { Tabs } from 'antd';
import React from 'react';
import { history, useLocation } from 'umi';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import LoginWithCredentials from './KeycloakLogin';
import RegisterForm from './RegisterForm';
import styles from './index.less';

const Login: React.FC = () => {
	const location = useLocation();
	const activeKey = location.pathname === '/user/register' ? 'register' : 'login';

	const handleTabChange = (key: string) => {
		history.push(`/user/${key}`);
	};

	return (
		<div className={styles.loginPage}>
			{/* Left Section: Auth Form */}
			<div className={styles.formSection}>
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className={styles.backHome}
					onClick={() => history.push('/')}
				>
					<ArrowLeft size={20} /> Quay lại trang chủ
				</motion.button>

				<div className={styles.header}>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className={styles.logoBox}
					>
						<div className={styles.icon}><Heart size={24} fill="white" /></div>
						<span>MyPet 4.0</span>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<h1>{activeKey === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'} <span>🐶</span></h1>
						<p>{activeKey === 'login' ? 'Đăng nhập để quản lý thú cưng của bạn.' : 'Bắt đầu hành trình chăm sóc thú cưng chuyên nghiệp.'}</p>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className={styles.tabsWrapper}
				>
					<Tabs
						activeKey={activeKey}
						onChange={handleTabChange}
						className={styles.tabs}
					>
						<Tabs.TabPane tab="Đăng nhập" key="login">
							<LoginWithCredentials />
						</Tabs.TabPane>
						<Tabs.TabPane tab="Đăng ký" key="register">
							<RegisterForm />
						</Tabs.TabPane>
					</Tabs>
				</motion.div>
			</div>

			{/* Right Section: Visual & Branding */}
			<div className={styles.visualSection}>

				<img
					src={require('@/assets/login_hero.png')}
					alt="Happy pets"
					className={styles.bgImage}
				/>
				<div className={styles.overlay} />

				<div className={styles.floatingContainer}>
					<motion.div
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className={styles.quoteBox}
					>
						<div style={{ color: '#D4A017', marginBottom: 16 }}><Sparkles size={32} /></div>
						<h2>Hệ sinh thái chăm sóc <span>thú cưng hàng đầu</span> Việt Nam.</h2>
						<p>Hơn 10,000+ chủ nuôi đã tin dùng giải pháp của MyPet để quản lý sức khỏe và lịch trình cho các bé.</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className={styles.reviewCard}
					>
						<img src="https://i.pravatar.cc/150?img=32" className={styles.userAvatar} alt="User" />
						<div className={styles.reviewContent}>
							<p>"Dịch vụ tuyệt vời, giao diện rất dễ dùng và bác sĩ cực kỳ tận tâm!"</p>
							<div className={styles.author}>Chị Minh Anh - Shiba Owner</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Login;
