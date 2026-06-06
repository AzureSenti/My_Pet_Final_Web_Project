import React from 'react';
import { history } from 'umi';
import {
    ArrowRight,
    Heart,
    ChevronRight,
    Star,
    Activity,
    CalendarDays,
    Users,
    Sparkles,
    Zap,
    ShieldCheck,
    TrendingUp,
    Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './index.less';

const LandingPage: React.FC = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <div className={styles.landingPage}>
            {/* Background Blobs */}
            <div className={styles.organicBlob1} />
            <div className={styles.organicBlob2} />

            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navInner}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}><Heart size={20} fill="currentColor" /></div>
                        <span>MyPet 4.0</span>
                    </div>
                    <div className={styles.links}>
                        <a href="#features">Công nghệ</a>
                        <a href="#services">Dịch vụ</a>
                        <a href="#doctors">Chuyên gia</a>
                        <a href="#pricing">Giải pháp</a>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.btnGhost} onClick={() => history.push('/user/login')}>Đăng nhập</button>
                        <button className={styles.btnSolid} onClick={() => history.push('/user/register')}>Bắt đầu ngay</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.content}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.badge}>
                                <Sparkles size={16} /> <span>Tiêu chuẩn công nghệ y tế mới</span>
                            </div>
                            <h1>Nền tảng số <span>cho kỷ nguyên thú y 4.0</span></h1>
                            <p>Khám phá hệ sinh thái quản lý y khoa thú cưng toàn diện nhất khu vực, kết hợp AI và quy trình chuẩn hóa quốc tế.</p>
                            <div className={styles.ctaGroup}>
                                <button className={styles.btnMain} onClick={() => history.push('/user/register')}>
                                    Trải nghiệm miễn phí <ArrowRight size={20} />
                                </button>
                                <button className={styles.btnSecondary}>
                                    Liên hệ chuyên gia
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <div className={styles.visual}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 100 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=95"
                                alt="MyPet Platform"
                                className={styles.mainImage}
                            />

                            {/* Floating Cards */}
                            <div className={`${styles.floatingCard} ${styles.pos1}`}>
                                <div className={styles.iconWrap}><Activity size={24} /></div>
                                <strong>99.8%</strong>
                                <span>Chính xác trong chẩn đoán</span>
                            </div>
                            <div className={`${styles.floatingCard} ${styles.pos2}`}>
                                <div className={styles.iconWrap}><ShieldCheck size={24} /></div>
                                <strong>Chuẩn mực</strong>
                                <span>Bảo mật dữ liệu y khoa</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Organic Curve Divider */}
            <div className={styles.curveWrapper}>
                <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 256L48 245.3C96 235 192 213 288 181.3C384 149 480 107 576 112C672 117 768 171 864 192C960 213 1056 203 1152 181.3C1248 160 1344 128 1392 112L1440 96V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0V256Z" fill="#F9F7F5" />
                </svg>
            </div>

            {/* Features Section */}
            <section id="features" style={{ background: '#F9F7F5' }} className={styles.section}>
                <div className={styles.header}>
                    <motion.div {...fadeInUp}>
                        <h2>Đột phá công nghệ y khoa</h2>
                        <p>Hệ thống hỗ trợ quyết định lâm sàng tiên tiến giúp bác sĩ và chủ nuôi đưa ra lựa chọn chăm sóc tốt nhất.</p>
                    </motion.div>
                </div>

                <div className={styles.featureGrid}>
                    {[
                        {
                            title: 'Hồ sơ số hóa',
                            desc: 'Tất cả dữ liệu lâm sàng, kết quả xét nghiệm được lưu trữ bảo mật và đồng bộ hóa theo thời gian thực.',
                            icon: <Zap size={36} />
                        },
                        {
                            title: 'AI Dashboard',
                            desc: 'Phân tích xu hướng sức khỏe bằng trí tuệ nhân tạo, cảnh báo rủi ro bệnh lý sớm dựa trên dữ liệu sinh học.',
                            icon: <Activity size={36} />
                        },
                        {
                            title: 'Lịch trình linh hoạt',
                            desc: 'Hệ thống điều phối lịch khám thông minh giúp tối ưu hóa thời gian chờ đợi và nguồn lực bác sĩ.',
                            icon: <TrendingUp size={36} />
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className={styles.card}
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                        >
                            <div className={styles.icon}>{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer (SaaS Style) */}
            <footer className={styles.section} style={{ paddingBottom: 80 }}>
                <div className={styles.header} style={{ marginBottom: 80 }}>
                    <motion.div {...fadeInUp}>
                        <Heart size={48} fill="#D4A017" stroke="#D4A017" style={{ marginBottom: 32 }} />
                        <h2 style={{ fontSize: 44 }}>Tham gia cuộc cách mạng chăm sóc thú cưng</h2>
                        <button className={styles.btnSolid} style={{ height: 64, padding: '0 40px', fontSize: 18, marginTop: 40 }} onClick={() => history.push('/user/register')}>
                            Khám phá ngay
                        </button>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
