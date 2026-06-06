import React, { useMemo } from 'react';
import { history, useLocation } from 'umi';
import { Home, PawPrint, Calendar, ClipboardList, Bell, CheckCircle, Activity, Gift, BellRing } from 'lucide-react';
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

    const [notifications, setNotifications] = React.useState([
        { id: 1, type: 'appointment', title: 'Lịch hẹn sắp tới', desc: 'Lịch khám bé Miu vào 14:00 ngày mai.', time: '10 phút trước', read: false, group: 'Hôm nay' },
        { id: 2, type: 'medical', title: 'Kết quả xét nghiệm', desc: 'Đã có kết quả xét nghiệm máu của bé Cún.', time: '2 giờ trước', read: false, group: 'Hôm nay' },
        { id: 3, type: 'promo', title: 'Ưu đãi dịch vụ Spa', desc: 'Giảm 15% gói Spa cắt tỉa cho thú cưng khi đặt lịch trong tuần này.', time: '1 ngày trước', read: true, group: 'Hôm qua' },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const groupedNotifications = useMemo(() => {
        const groups: Record<string, typeof notifications> = {};
        notifications.forEach(noti => {
            if (!groups[noti.group]) groups[noti.group] = [];
            groups[noti.group].push(noti);
        });
        return groups;
    }, [notifications]);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'appointment': return <Calendar size={18} />;
            case 'medical': return <Activity size={18} />;
            case 'promo': return <Gift size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const notificationContent = (
        <div className={styles.notificationDropdown}>
            <div className={styles.notiHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}><BellRing size={16} /></div>
                    <h4>Thông báo {unreadCount > 0 && <span className={styles.newBadge}>{unreadCount} mới</span>}</h4>
                </div>
            </div>

            <div className={styles.notiBody}>
                {notifications.length > 0 ? (
                    Object.entries(groupedNotifications).map(([groupName, items]) => (
                        <div key={groupName} className={styles.notiGroup}>
                            <div className={styles.groupLabel}>{groupName}</div>
                            {items.map(item => (
                                <div 
                                    key={item.id} 
                                    className={`${styles.notiItem} ${!item.read ? styles.unread : ''}`}
                                    onClick={() => {
                                        if (!item.read) {
                                            setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
                                        }
                                        history.push('/khach-hang/lich-hen');
                                    }}
                                >
                                    <div className={`${styles.notiIconWrap} ${styles[item.type] || styles.defaultType}`}>
                                        {getIconForType(item.type)}
                                        {!item.read && <div className={styles.unreadDot} />}
                                    </div>
                                    <div className={styles.notiContent}>
                                        <h5>{item.title}</h5>
                                        <p>{item.desc}</p>
                                        <span className={styles.notiTime}>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}><Bell size={24} /></div>
                        <h5>Không có thông báo mới</h5>
                        <p>Bạn đã xem hết tất cả thông báo.</p>
                    </div>
                )}
            </div>

            <div className={styles.notiFooter}>
                <span className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); markAllRead(); }}>Đánh dấu tất cả đã đọc</span>
                <span className={styles.actionBtn} onClick={() => history.push('/khach-hang/lich-hen')}>Xem tất cả thông báo</span>
            </div>
        </div>
    );

    return (
        <div className={styles.userLayout}>
            <nav className={styles.navContainer}>
                <div className={styles.logoWrap} onClick={() => history.push('/khach-hang/dashboard')}>
                    <div className={styles.logoIconWrapper}>
                        <PawPrint size={24} strokeWidth={2.5} />
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
                        overlay={notificationContent} 
                        trigger={['click']} 
                        placement="bottomRight"
                        overlayClassName={styles.dropdownOverlayWrapper}
                    >
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <Badge count={unreadCount} size="small" className={styles.notificationBadge}>
                                <div className={`${styles.bellBtn} ${unreadCount > 0 ? styles.hasNew : ''}`}>
                                    <Bell size={20} className={styles.bellIcon} />
                                </div>
                            </Badge>
                        </a>
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
