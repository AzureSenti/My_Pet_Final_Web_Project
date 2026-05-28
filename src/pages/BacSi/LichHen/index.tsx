import React, { useEffect, useState } from 'react';
import { CalendarOutlined, FileSyncOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { getDoctorStats } from '@/services/BacSi/doctorService';
import styles from './index.module.less';
import LichHomNay from './components/LichHomNay';
import DangCho from './components/DangCho';
import LichSuKham from './components/LichSuKham';

const LichHen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hom-nay');
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const data = await getDoctorStats();
        setStats(data);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date();
  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

  const getTitle = () => {
    switch(activeTab) {
      case 'hom-nay': return 'Lịch hẹn hôm nay';
      case 'dang-cho': return 'Lịch hẹn cần xác nhận';
      case 'lich-su': return 'Lịch sử khám';
      default: return 'Lịch hẹn';
    }
  };

  const getSubtitle = () => {
    switch(activeTab) {
      case 'hom-nay': return `${dayNames[today.getDay()]}, ngày ${today.getDate()} tháng ${today.getMonth() + 1}, ${today.getFullYear()}`;
      case 'dang-cho': return 'Quản lý các yêu cầu đặt lịch mới cần phản hồi.';
      case 'lich-su': return 'Tra cứu hồ sơ y tế và lịch sử khám của thú cưng.';
      default: return '';
    }
  };

  const totalAppointments = stats?.total_appointments ?? 0;
  const pendingCount = stats?.appointments_by_status?.pending ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.subtitle}>{getSubtitle()}</p>
        </div>
        
        <div className={styles.headerActions}>
          <Spin spinning={loadingStats} size="small">
            <div className={styles.statsCard}>
              <div className={`${styles.statIcon} ${styles.teal}`}>
                <CalendarOutlined />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{totalAppointments}</span>
                <span className={styles.statLabel}>Tổng lịch hẹn</span>
              </div>
            </div>
          </Spin>
          <Spin spinning={loadingStats} size="small">
            <div className={styles.statsCard}>
              <div className={`${styles.statIcon} ${styles.gold}`}>
                <FileSyncOutlined />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{pendingCount}</span>
                <span className={styles.statLabel}>Đang chờ</span>
              </div>
            </div>
          </Spin>
        </div>
      </div>

      <div className={styles.tabsWrapper}>
        <div 
          className={`${styles.tabItem} ${activeTab === 'hom-nay' ? styles.active : ''}`}
          onClick={() => setActiveTab('hom-nay')}
        >
          Lịch khám hôm nay
        </div>
        <div 
          className={`${styles.tabItem} ${activeTab === 'dang-cho' ? styles.active : ''}`}
          onClick={() => setActiveTab('dang-cho')}
        >
          Đang chờ
        </div>
        <div 
          className={`${styles.tabItem} ${activeTab === 'lich-su' ? styles.active : ''}`}
          onClick={() => setActiveTab('lich-su')}
        >
          Lịch sử khám
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'hom-nay' && <LichHomNay />}
        {activeTab === 'dang-cho' && <DangCho />}
        {activeTab === 'lich-su' && <LichSuKham />}
      </div>
    </div>
  );
};

export default LichHen;
