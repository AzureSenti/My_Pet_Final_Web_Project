import React from 'react';
import { history, useLocation } from 'umi';
import { Home, PawPrint, Calendar, ClipboardList, Bell, CheckCircle } from 'lucide-react';
import { Badge, Button, Dropdown, Menu, List, Avatar } from 'antd';
import HeaderProfile from '@/components/HeaderProfile';
import styles from './style.less';

const UserLayout: React.FC = ({ children }) => {
    const location = useLocation();
    const pathname = location.pathname;

    const menuItems = [
        { label: 'Tổng quan', path: '/khach-hang/dashboard', icon: <Home size={18} /> },
        { label: 'Thú cưng', path: '/khach-hang/thu-cung', icon: <PawPrint size={18} /> },
        { label: 'Lịch hẹn', path: '/khach-hang/lich-hen', icon: <Calendar size={18} /> },
        { label: 'Bệnh án', path: '/khach-hang/benh-an', icon: <ClipboardList size={18} /> },
    ];

    return (
        <div className={styles.userLayout}>
            <nav className={styles.navContainer}>
                <div className={styles.logoWrap} onClick={() => history.push('/khach-hang/dashboard')}>
                    <div className={styles.logoIconWrapper}>
                        <img src="https://cdn-icons-png.flaticon.com/512/3565/3565860.png" alt="PetCare Logo" className={styles.logoImage} />
                    </div>
                    <span>PetCare</span>
                </div>

                <div className={styles.mainMenu}>
                    {menuItems.map(item => (
                        <div
                            key={item.path}
                            className={`${styles.menuItem} ${pathname === item.path ? styles.active : ''}`}
                            onClick={() => history.push(item.path)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>

                <div className={styles.rightActions}>
                    <Dropdown 
                        overlay={
                            <div className={styles.notificationDropdown}>
                                <div className={styles.notiHeader}>
                                    <h4>Thông báo</h4>
                                    <span className={styles.markRead}>Đánh dấu đã đọc</span>
                                </div>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={[
                                        { title: 'Lịch hẹn sắp tới', desc: 'Lịch khám bé Miu vào 14:00 ngày mai.', time: '10 phút trước', read: false },
                                        { title: 'Kết quả xét nghiệm', desc: 'Đã có kết quả máu của bé Cún.', time: '2 giờ trước', read: true }
                                    ]}
                                    renderItem={item => (
                                        <List.Item className={`${styles.notiItem} ${!item.read ? styles.unread : ''}`}>
                                            <List.Item.Meta
                                                avatar={<div className={styles.notiIcon}><Bell size={16} /></div>}
                                                title={<span>{item.title}</span>}
                                                description={
                                                    <div>
                                                        <p>{item.desc}</p>
                                                        <span className={styles.notiTime}>{item.time}</span>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                                <div className={styles.notiFooter}>Xem tất cả thông báo</div>
                            </div>
                        } 
                        trigger={['click']} 
                        placement="bottomRight"
                    >
                        <Badge count={2} size="small" style={{ backgroundColor: '#D4A017' }}>
                            <Button type="text" icon={<Bell size={20} />} className={styles.bellBtn} />
                        </Badge>
                    </Dropdown>
                    <HeaderProfile />
                </div>
            </nav>

            <main className={styles.contentArea}>
                {children}
            </main>
        </div>
    );
};

export default UserLayout;
