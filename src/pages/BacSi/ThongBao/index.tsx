import React from 'react';
import { Tabs } from 'antd';
import {
  CalendarOutlined,
  MessageOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';

const ThongBao: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleBox}>
          <h1 className={styles.title}>Thông báo</h1>
          <p className={styles.subtitle}>Luôn cập nhật những thay đổi mới nhất trong phòng khám của bạn.</p>
        </div>
        <button className={styles.markReadBtn}>Đánh dấu tất cả là đã đọc</button>
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tất cả" key="1" />
          <Tabs.TabPane tab="Lịch hẹn" key="2" />
          <Tabs.TabPane tab="Tư vấn" key="3" />
          <Tabs.TabPane tab="Hệ thống" key="4" />
        </Tabs>
      </div>

      <div className={styles.notifList}>
        {/* Lịch hẹn mới */}
        <div className={`${styles.notifCard} ${styles.unread}`}>
          <div className={`${styles.iconBox} ${styles.teal}`}>
            <CalendarOutlined />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.notifHeader}>
              <span className={styles.notifTitle}>Lịch hẹn mới</span>
              <span className={styles.notifTime}>10 phút trước</span>
            </div>
            <div className={styles.notifDesc}>
              <strong>Nguyễn Minh D</strong> vừa đặt lịch khám cho <strong>Mochi</strong> (Poodle) vào 14:30 ngày mai.
            </div>
            <div className={styles.notifActions}>
              <button className={styles.btnPrimary}>Xác nhận</button>
              <button className={styles.btnOutlined}>Chi tiết</button>
            </div>
          </div>
        </div>

        {/* Tin nhắn tư vấn */}
        <div className={styles.notifCard}>
          <div className={`${styles.iconBox} ${styles.gold}`}>
            <MessageOutlined />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.notifHeader}>
              <span className={styles.notifTitle}>Tin nhắn tư vấn</span>
              <span className={styles.notifTime}>1 giờ trước</span>
            </div>
            <div className={styles.notifDesc}>
              <strong>Trần Thị Thu</strong> vừa gửi ảnh tình trạng vết thương của <strong>LuLu</strong>. Cần bác sĩ xem xét.
            </div>
          </div>
        </div>

        {/* Cảnh báo hệ thống */}
        <div className={styles.notifCard}>
          <div className={`${styles.iconBox} ${styles.red}`}>
            <WarningOutlined />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.notifHeader}>
              <span className={styles.notifTitle}>Cảnh báo hệ thống</span>
              <span className={styles.notifTime}>3 giờ trước</span>
            </div>
            <div className={styles.notifDesc}>
              Lượng vắc-xin dại (Rabies) trong kho đang ở mức thấp (còn 5 liều). Vui lòng kiểm tra và nhập thêm.
            </div>
          </div>
        </div>

        {/* Lịch hẹn hoàn tất */}
        <div className={styles.notifCard}>
          <div className={`${styles.iconBox} ${styles.teal}`}>
            <CheckCircleOutlined />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.notifHeader}>
              <span className={styles.notifTitle}>Lịch hẹn hoàn tất</span>
              <span className={styles.notifTime}>Hôm qua</span>
            </div>
            <div className={styles.notifDesc}>
              Phiếu khám sức khỏe tổng quát của <strong>Bông</strong> đã được đồng bộ lên hệ thống và gửi cho khách hàng.
            </div>
          </div>
        </div>

        {/* Cập nhật phần mềm */}
        <div className={`${styles.notifCard} ${styles.unread}`}>
          <div className={`${styles.iconBox} ${styles.neutral}`}>
            <InfoCircleOutlined />
          </div>
          <div className={styles.contentBox}>
            <div className={styles.notifHeader}>
              <span className={styles.notifTitle}>Cập nhật phần mềm</span>
              <span className={styles.notifTime}>2 ngày trước</span>
            </div>
            <div className={styles.notifDesc}>
              PetCare Pro phiên bản 2.4 đã sẵn sàng với tính năng quản lý đơn thuốc điện tử mới. Khám phá ngay!
            </div>
          </div>
        </div>
      </div>

      <div className={styles.loadMoreBox}>
        <p className={styles.loadMoreText}>Bạn đã xem hết các thông báo gần đây.</p>
        <button className={styles.btnLoadMore}>Tải thêm thông báo</button>
      </div>
    </div>
  );
};

export default ThongBao;
