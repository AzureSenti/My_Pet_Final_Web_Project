import React, { useState } from 'react';
import { CalendarOutlined, FileSyncOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import LichHomNay from './components/LichHomNay';
import DangCho from './components/DangCho';
import LichSuKham from './components/LichSuKham';

const LichHen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hom-nay');

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
      case 'hom-nay': return 'Thứ Hai, ngày 14 tháng 10, 2024';
      case 'dang-cho': return 'Quản lý các yêu cầu đặt lịch mới cần phản hồi.';
      case 'lich-su': return 'Tra cứu hồ sơ y tế và lịch sử khám của thú cưng.';
      default: return '';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.subtitle}>{getSubtitle()}</p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.statsCard}>
            <div className={`${styles.statIcon} ${styles.teal}`}>
              <CalendarOutlined />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>12</span>
              <span className={styles.statLabel}>Tổng lịch hẹn</span>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={`${styles.statIcon} ${styles.gold}`}>
              <FileSyncOutlined />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>4</span>
              <span className={styles.statLabel}>Đang chờ</span>
            </div>
          </div>
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
