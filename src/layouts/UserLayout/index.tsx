import { history, useLocation } from 'umi';
import { Home, PawPrint, Calendar, ClipboardList } from 'lucide-react';
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
