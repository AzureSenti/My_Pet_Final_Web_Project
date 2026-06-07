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
import { getMyPets, getMyAppointments, Pet, Appointment } from '@/services/QuanLyPetStore';
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
            const [pets, appointments] = await Promise.all([
                getMyPets(),
                getMyAppointments(),
            ]);
            setData({
                pets,
                appointments: appointments.map((app: any) => ({
                    ...app,
                    pet_name: app.pet?.name || 'Không rõ',
                    service_name: app.service?.name || 'Dịch vụ lẻ',
                    vet_name: app.vet?.user?.full_name || 'Bác sĩ trực ban',
                })),
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
            <div className={styles.container}>
                <header className={styles.welcomeSection}>
                    <div className={styles.welcomeText}>
                        <h1>Hôm nay thế nào, <span>{currentUser?.full_name?.split(' ').pop()}</span>? 👋</h1>
                        <p>Cùng theo dõi sức khỏe và lịch trình của các thành viên bốn chân nhé.</p>
                    </div>
                    <Button className={styles.btnOutlineNew} onClick={() => history.push('/khach-hang/lich-hen')}>
                        + Đặt lịch mới
                    </Button>
                </header>

                <div className={styles.twoColumnLayout}>
                    <div className={styles.leftColumn}>
                        <div className={styles.statsRow}>
                            <div className={styles.statCard}>
                                <div className={styles.statIconBrown}><PawPrint size={20} /></div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{data.pets.length}</span>
                                    <span className={styles.statLabel}>Thú cưng</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIconYellow}><Calendar size={20} /></div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{data.appointments.filter(a => a.status === 'confirmed').length}</span>
                                    <span className={styles.statLabel}>Lịch hẹn</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIconBlue}><Zap size={20} /></div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{data.appointments.filter(a => a.status === 'completed').length}</span>
                                    <span className={styles.statLabel}>Đã hoàn thành</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.contentCard}>
                            <div className={styles.cardHeader}>
                                <h3>Lịch trình y khoa</h3>
                                <a onClick={() => history.push('/khach-hang/lich-hen')} className={styles.linkMuted}>Xem tất cả</a>
                            </div>
                            {upcomingApp ? (
                                <div className={styles.appointmentItem}>
                                    <div className={styles.appLeft}>
                                        <div className={styles.badgeGreen}>SẮP DIỄN RA</div>
                                        <h4>{upcomingApp.service_name}</h4>
                                        <div className={styles.appTime}>
                                            {new Date(upcomingApp.scheduled_at).toLocaleDateString('vi-VN')} • {new Date(upcomingApp.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className={styles.appRight}>
                                        <Avatar size={48} src={data.pets.find(p => p.id === upcomingApp.pet_id)?.avatar_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'} />
                                        <div className={styles.petName}>
                                            <strong>{upcomingApp.pet_name}</strong>
                                            <span>Bệnh nhân</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Empty description="Chưa có lịch trình sắp tới" />
                            )}
                        </div>

                        <div className={styles.contentCard}>
                            <div className={styles.cardHeader}>
                                <h3>Bạn nhỏ của tôi</h3>
                                <div className={styles.cardHeaderActions}>
                                    <a onClick={() => history.push('/khach-hang/thu-cung')} className={styles.linkMuted}>Quản lý</a>
                                    <Button size="small" type="link" className={styles.btnAddSmall} onClick={() => history.push('/khach-hang/thu-cung')}>+ Thêm mới</Button>
                                </div>
                            </div>
                            <div className={styles.petList}>
                                {data.pets.slice(0, 2).map(pet => (
                                    <div key={pet.id} className={styles.petListItem}>
                                        <Avatar size={48} src={pet.avatar_url || (pet.species === 'Mèo' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100' : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100')} />
                                        <div className={styles.petInfo}>
                                            <strong>{pet.name}</strong>
                                            <span>{pet.species} • {pet.gender === 'female' ? 'cái' : 'đực'}</span>
                                        </div>
                                    </div>
                                ))}
                                {data.pets.length === 0 && <Empty description="Chưa có bạn nhỏ nào" />}
                                {data.pets.length > 2 && (
                                    <div className={styles.morePetsLink} onClick={() => history.push('/khach-hang/thu-cung')}>
                                        +{data.pets.length - 2} Xem thêm bạn nhỏ
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.sidebarCard}>
                            <div className={styles.sidebarHeader}>
                                <span className={styles.pinIcon}>📌</span>
                                <h3>Góc tư vấn chuyên gia</h3>
                            </div>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot}></div>
                                <div className={styles.tipText}>
                                    <strong>Tiêm chủng định kỳ</strong>
                                    <p>Đừng quên lịch tiêm phòng dại mỗi năm một lần cho bé.</p>
                                </div>
                            </div>
                            <div className={styles.tipItem}>
                                <div className={styles.tipDot}></div>
                                <div className={styles.tipText}>
                                    <strong>Chăm sóc lông</strong>
                                    <p>Chải lông thường xuyên giúp bé giảm stress và mượt mà hơn.</p>
                                </div>
                            </div>
                            
                            <div className={styles.divider}></div>

                            <div className={styles.vipBox}>
                                <div className={styles.vipHeader}>
                                    ⭐ Ưu đãi VIP
                                </div>
                                <p>Giảm 15% cho dịch vụ Spa vào các ngày trong tuần.</p>
                                <Button className={styles.btnGoldFull}>Sử dụng ngay</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
                    <p>© 2024 PetCare Admin. All rights reserved.</p>
                    <div className={styles.footerLinks}>
                        <a>Support</a> · <a>Privacy Policy</a> · <a>Terms of Service</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default KhachHangDashboard;
