import React from 'react';
import { history } from 'umi';
import {
    ArrowRight,
    Heart,
    Star,
    Activity,
    CalendarDays,
    Users,
    Sparkles,
    Zap,
    ShieldCheck,
    TrendingUp,
    Stethoscope,
    PawPrint,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MapPin,
    Phone,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './index.less';

const LandingPage: React.FC = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    };

    const EXPERTS = [
        {
            name: 'BS. Nguyễn Văn Minh',
            role: 'Chuyên gia Ngoại khoa & Chấn thương chỉnh hình',
            exp: '12 năm kinh nghiệm',
            desc: 'Tốt nghiệp xuất sắc Đại học Nông Lâm, tu nghiệp chuyên sâu tại Bệnh viện Thú y Hoàng gia Anh quốc.',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256'
        },
        {
            name: 'BS. Lê Thị Mai Anh',
            role: 'Chuyên gia Nội khoa & Chẩn đoán hình ảnh',
            exp: '8 năm kinh nghiệm',
            desc: 'Chuyên khoa siêu âm nâng cao và chẩn đoán các bệnh lý nội tiết phức tạp ở chó, mèo.',
            avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=256'
        },
        {
            name: 'BS. Trần Hoàng Nam',
            role: 'Chuyên khoa Dinh dưỡng & Chăm sóc đặc biệt',
            exp: '10 năm kinh nghiệm',
            desc: 'Được chứng nhận bởi Hiệp hội Dinh dưỡng Thú cưng Châu Á. Chuyên gia tư vấn khẩu phần ăn trị liệu.',
            avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256'
        }
    ];

    const STATS = [
        {
            number: '12,500+',
            label: 'Thú cưng được chăm sóc',
            icon: <Heart size={24} />
        },
        {
            number: '45+',
            label: 'Bác sĩ & Chuyên gia đầu ngành',
            icon: <Stethoscope size={24} />
        },
        {
            number: '99.8%',
            label: 'Chỉ số chẩn đoán chính xác',
            icon: <Activity size={24} />
        },
        {
            number: '24/7',
            label: 'Hỗ trợ cấp cứu khẩn cấp',
            icon: <ShieldCheck size={24} />
        }
    ];

    return (
        <div className={styles.landingPage}>
            {/* Background Blobs */}
            <div className={styles.organicBlob1} />
            <div className={styles.organicBlob2} />

            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.navInner}>
                    <div className={styles.logo} onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}>
                        <div className={styles.logoIcon}>
                            <PawPrint size={20} strokeWidth={2.5} />
                        </div>
                        <div className={styles.logoText}>
                            <h3>PetCare</h3>
                            <span>Platform</span>
                        </div>
                    </div>
                    <div className={styles.links}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}>Trang chủ</a>
                        <a href="#stats">Số liệu</a>
                        <a href="#features">Công nghệ</a>
                        <a href="#doctors">Chuyên gia</a>
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
                                <button className={styles.btnSecondary} onClick={() => history.push('/user/login')}>
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
                    <path d="M0 256L48 245.3C96 235 192 213 288 181.3C384 149 480 107 576 112C672 117 768 171 864 192C960 213 1056 203 1152 181.3C1248 160 1344 128 1392 112L1440 96V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0V256Z" fill="#FFF0E0" />
                </svg>
            </div>

            {/* Stats Section */}
            <section id="stats" style={{ background: '#FFF0E0' }} className={styles.statsSection}>
                <div className={styles.header}>
                    <motion.div {...fadeInUp}>
                        <h2>Chặng đường đồng hành & phát triển</h2>
                        <p>Những con số biết nói minh chứng cho chất lượng dịch vụ và sự tin cậy từ cộng đồng yêu thú cưng.</p>
                    </motion.div>
                </div>
                <div className={styles.statsGrid}>
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            className={styles.statCard}
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
                        >
                            <div className={styles.statIcon}>{stat.icon}</div>
                            <div className={styles.statNumber}>{stat.number}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ background: '#FFF0E0', paddingTop: 60 }} className={styles.section}>
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

            {/* Curve Divider Reverse */}
            <div className={styles.curveWrapper} style={{ transform: 'rotate(180deg)', marginTop: -2 }}>
                <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 256L48 245.3C96 235 192 213 288 181.3C384 149 480 107 576 112C672 117 768 171 864 192C960 213 1056 203 1152 181.3C1248 160 1344 128 1392 112L1440 96V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0V256Z" fill="#FFF0E0" />
                </svg>
            </div>

            {/* Experts Section */}
            <section id="doctors" className={styles.expertsSection}>
                <div className={styles.header}>
                    <motion.div {...fadeInUp}>
                        <h2>Đội ngũ bác sĩ hàng đầu</h2>
                        <p>Được đào tạo bài bản từ các viện y học thú y danh tiếng thế giới, mang trọn tâm huyết bảo vệ sức khỏe cho thú cưng của bạn.</p>
                    </motion.div>
                </div>

                <div className={styles.expertsGrid}>
                    {EXPERTS.map((expert, i) => (
                        <motion.div
                            key={i}
                            className={styles.expertCard}
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                        >
                            <div className={styles.expertAvatar}>
                                <img src={expert.avatar} alt={expert.name} />
                            </div>
                            <h3 className={styles.expertName}>{expert.name}</h3>
                            <div className={styles.expertRole}>{expert.role}</div>
                            <div className={styles.expertExp}>{expert.exp}</div>
                            <p className={styles.expertDesc}>{expert.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className={styles.footerCTA}>
                <div className={styles.footerInner}>
                    <motion.div {...fadeInUp}>
                        <div className={styles.heartIcon}>
                            <Heart size={48} fill="#D4A017" stroke="#D4A017" />
                        </div>
                        <h2>Sẵn sàng mang đến dịch vụ tốt nhất?</h2>
                        <p className={styles.footerDesc}>Gia nhập hàng ngàn chủ nuôi và cơ sở thú y tin dùng PetCare để số hóa quy trình quản lý y khoa thú cưng.</p>
                        <button className={styles.btnFooter} onClick={() => history.push('/user/register')}>
                            Trải nghiệm miễn phí <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Complete Footer Section */}
            <footer className={styles.mainFooter}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerGrid}>
                        {/* Brand Column */}
                        <div className={styles.footerBrandCol}>
                            <div className={styles.footerLogo}>
                                <div className={styles.footerLogoIcon}>
                                    <PawPrint size={24} strokeWidth={2.5} />
                                </div>
                                <div className={styles.logoText}>
                                    <h3 style={{ margin: 0 }}>PetCare</h3>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#B5A48F', letterSpacing: '0.5px' }}>Platform</span>
                                </div>
                            </div>
                            <p className={styles.footerBrandDesc}>
                                Nền tảng số hóa quản lý y khoa thú y hàng đầu, nâng tầm chất lượng cuộc sống cho thú cưng của bạn bằng công nghệ hiện đại.
                            </p>
                            <div className={styles.socialLinks}>
                                <a href="#" className={styles.socialBtn}><Facebook size={18} /></a>
                                <a href="#" className={styles.socialBtn}><Instagram size={18} /></a>
                                <a href="#" className={styles.socialBtn}><Twitter size={18} /></a>
                                <a href="#" className={styles.socialBtn}><Youtube size={18} /></a>
                            </div>
                        </div>

                        {/* Column 2: Dịch vụ */}
                        <div className={styles.footerLinksCol}>
                            <h4>Dịch vụ y khoa</h4>
                            <ul>
                                <li><a href="#features">Hồ sơ sức khỏe điện tử</a></li>
                                <li><a href="#features">AI Dashboard phân tích</a></li>
                                <li><a href="#features">Đặt lịch hẹn trực tuyến</a></li>
                                <li><a href="#features">Tư vấn chuyên gia 24/7</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Hỗ trợ */}
                        <div className={styles.footerLinksCol}>
                            <h4>Hỗ trợ & Hướng dẫn</h4>
                            <ul>
                                <li><a href="#">Trung tâm trợ giúp</a></li>
                                <li><a href="#">Chính sách bảo mật</a></li>
                                <li><a href="#">Điều khoản sử dụng</a></li>
                                <li><a href="#">Chương trình đối tác</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div className={styles.footerContactCol}>
                            <h4>Liên hệ trực tiếp</h4>
                            <div className={styles.contactItem}>
                                <MapPin size={18} />
                                <span>Đường số 10, Khu đô thị mới, TP. Hồ Chí Minh</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Phone size={18} />
                                <span>1900 1088 (Hotline 24/7)</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Mail size={18} />
                                <span>support@mypet.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Bar */}
                <div className={styles.bottomFooter}>
                    <p>© 2026 <span>PetCare</span>. Thiết kế theo phong cách Simplified Creamy Honey.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
