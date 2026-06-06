import React, { useEffect, useState } from 'react';
import { Avatar, Button, Empty, Tag, Progress, Row, Col } from 'antd';
import {
    PawPrint,
    Calendar,
    Clock,
    Zap,
    Search,
    Bell,
    Plus
} from 'lucide-react';
import { useModel, history } from 'umi';
import { getOwnerDetails, Pet, Appointment } from '@/services/QuanLyPetStore';
import styles from './style.less';

const KhachHangDashboard: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const currentUser = initialState?.currentUser;

    const [data, setData] = useState<{
        pets: Pet[];
        appointments: (Appointment & { pet_name: string; service_name: string; vet_name: string })[];
    }>({ pets: [], appointments: [] });

    useEffect(() => {
        if (currentUser?.id) {
            fetchData();
        }
    }, [currentUser]);

    const fetchData = async () => {
        try {
            const res = await getOwnerDetails(currentUser!.id);
            setData({
                pets: res.pets,
                appointments: res.appointments,
            });
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu dashboard:', error);
        }
    };

    const upcomingApp = data.appointments
        .filter(app => app.status === 'confirmed' || app.status === 'pending')
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

    return (
        <div className={styles.saasDashboard}>
            <header className={styles.welcomeSection}>
                <div className={styles.welcomeText}>
                    <h1>Hôm nay thế nào, {currentUser?.full_name?.split(' ').pop()}? 👋</h1>
                    <p>Cùng theo dõi sức khỏe và lịch trình của các thành viên bốn chân nhé.</p>
                </div>
                <div className={styles.headerActions}>
                    <Button icon={<Search size={18} />} className={styles.iconBtn} />
                    <Button icon={<Bell size={18} />} className={styles.iconBtn} />
                    <Button type="primary" icon={<Plus size={18} />} className={styles.btnPrimary} onClick={() => history.push('/khach-hang/lich-hen')}>
                        Đặt lịch mới
                    </Button>
                </div>
            </header>

            <div className={styles.metricGrid}>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconBox} ${styles.green}`}><PawPrint size={24} /></div>
                    <div className={styles.info}>
                        <span className={styles.label}>Thú cưng</span>
                        <div className={styles.value}>{data.pets.length}</div>
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconBox} ${styles.gold}`}><Calendar size={24} /></div>
                    <div className={styles.info}>
                        <span className={styles.label}>Lịch hẹn</span>
                        <div className={styles.value}>{data.appointments.filter(a => a.status === 'confirmed').length}</div>
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={`${styles.iconBox} ${styles.blue}`}><Zap size={24} /></div>
                    <div className={styles.info}>
                        <span className={styles.label}>Điểm tích lũy</span>
                        <div className={styles.value}>1,450</div>
                    </div>
                </div>
            </div>

            <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    <div className={styles.mainCard}>
                        <div className={styles.cardHeader}>
                            <h3>Lịch trình y khoa</h3>
                            <Button type="link" className={styles.viewAll} onClick={() => history.push('/khach-hang/lich-hen')}>Xem tất cả</Button>
                        </div>
                        {upcomingApp ? (
                            <div className={styles.highlightBooking}>
                                <div className={styles.bookingInfo}>
                                    <Tag color="#8A9A5B" className={styles.statusTag}>SẮP DIỄN RA</Tag>
                                    <h2>{upcomingApp.service_name}</h2>
                                    <div className={styles.meta}>
                                        <span><Calendar size={14} /> {new Date(upcomingApp.scheduled_at).toLocaleDateString('vi-VN')}</span>
                                        <span><Clock size={14} /> {new Date(upcomingApp.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                                <div className={styles.petMini}>
                                    <Avatar size={48} src={data.pets.find(p => p.id === upcomingApp.pet_id)?.avatar_url} />
                                    <div className={styles.name}>
                                        <strong>{upcomingApp.pet_name}</strong>
                                        <span>Bệnh nhân</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Empty description="Ghi danh bé yêu vào lịch khám ngay hôm nay" />
                                <Button className={styles.btnOutline} onClick={() => history.push('/khach-hang/lich-hen')}>Đặt lịch ngay</Button>
                            </div>
                        )}
                    </div>

                    <div className={styles.mainCard} style={{ marginTop: 32 }}>
                        <div className={styles.cardHeader}>
                            <h3>Bạn nhỏ của tôi</h3>
                            <Button type="link" className={styles.viewAll} onClick={() => history.push('/khach-hang/thu-cung')}>Quản lý</Button>
                        </div>
                        <div className={styles.petRow}>
                            {data.pets.slice(0, 3).map(pet => (
                                <div key={pet.id} className={styles.petSmallCard}>
                                    <img src={pet.avatar_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'} alt={pet.name} />
                                    <div className={styles.info}>
                                        <h4>{pet.name}</h4>
                                        <Progress percent={90} size="small" strokeColor="#8A9A5B" trailColor="#F0EDE8" />
                                    </div>
                                </div>
                            ))}
                            {data.pets.length > 3 && (
                                <div className={styles.morePets} onClick={() => history.push('/khach-hang/thu-cung')}>
                                    +{data.pets.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <div className={styles.sideCard}>
                        <h3>Góc tư vấn chuyên gia</h3>
                        <div className={styles.tipList}>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot} />
                                <div className={styles.content}>
                                    <strong>Tiêm chủng định kỳ</strong>
                                    <p>Đừng quên lịch tiêm phòng dại mỗi năm một lần cho bé.</p>
                                </div>
                            </div>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot} style={{ background: '#C9A96E' }} />
                                <div className={styles.content}>
                                    <strong>Chăm sóc lông</strong>
                                    <p>Chải lông thường xuyên giúp bé giảm stress và mượt mà hơn.</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.promoBox}>
                            <h4>Ưu đãi VIP</h4>
                            <p>Giảm 15% cho dịch vụ Spa vào các ngày trong tuần.</p>
                            <Button block className={styles.btnSecondary}>Sử dụng ngay</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default KhachHangDashboard;
