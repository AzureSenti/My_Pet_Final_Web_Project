import React, { useEffect, useState } from 'react';
import { Tabs, Spin, message, Badge } from 'antd';
import {
  CalendarOutlined,
  MessageOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { getThongBao, readNotification } from '@/services/ThongBao';
import styles from './index.module.less';

const ThongBao: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await getThongBao({ page: pageNum, limit: 10 });
      const newItems = res?.data?.items || [];
      if (pageNum === 1) {
        setNotifications(newItems);
      } else {
        setNotifications((prev) => [...prev, ...newItems]);
      }
      setHasMore(pageNum < (res?.data?.pages || 1));
    } catch (error) {
      console.error('Lỗi lấy thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await readNotification({ type: 'ONE', notificationId: id });
      setNotifications((prev) => 
        prev.map((notif) => notif.id === id ? { ...notif, is_read: true } : notif)
      );
    } catch (error) {
      message.error('Lỗi khi đánh dấu đã đọc');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleBox}>
          <h1 className={styles.title}>Thông báo</h1>
          <p className={styles.subtitle}>Luôn cập nhật những thông tin mới nhất về lịch hẹn và thú cưng của bạn.</p>
        </div>
        {/* <button className={styles.markReadBtn}>Đánh dấu tất cả là đã đọc</button> */}
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tất cả" key="1" />
        </Tabs>
      </div>

      <div className={styles.notifList}>
        {notifications.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có thông báo nào</div>
        )}
        
        {notifications.map((notif) => {
          const isUnread = !notif.is_read;
          const dateStr = new Date(notif.created_at).toLocaleString('vi-VN');
          
          let icon = <InfoCircleOutlined />;
          let iconColorClass = styles.neutral;
          
          if (notif.type === 'APPOINTMENT') {
            icon = <CalendarOutlined />;
            iconColorClass = styles.teal;
          } else if (notif.type === 'MESSAGE') {
            icon = <MessageOutlined />;
            iconColorClass = styles.gold;
          } else if (notif.type === 'SYSTEM') {
            icon = <WarningOutlined />;
            iconColorClass = styles.red;
          } else if (notif.type === 'PROMOTION') {
            icon = <StarOutlined />;
            iconColorClass = styles.teal;
          }

          return (
            <div 
              key={notif.id} 
              className={`${styles.notifCard} ${isUnread ? styles.unread : ''}`}
              onClick={() => isUnread && handleMarkAsRead(notif.id)}
              style={{ cursor: isUnread ? 'pointer' : 'default' }}
            >
              <div className={`${styles.iconBox} ${iconColorClass}`}>
                {icon}
              </div>
              <div className={styles.contentBox}>
                <div className={styles.notifHeader}>
                  <span className={styles.notifTitle}>
                    {notif.title}
                    {isUnread && <Badge dot style={{ marginLeft: 8 }} />}
                  </span>
                  <span className={styles.notifTime}>{dateStr}</span>
                </div>
                <div className={styles.notifDesc}>{notif.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>}

      {!loading && hasMore && (
        <div className={styles.loadMoreBox}>
          <button className={styles.btnLoadMore} onClick={handleLoadMore}>Tải thêm thông báo</button>
        </div>
      )}
      
      {!loading && !hasMore && notifications.length > 0 && (
        <div className={styles.loadMoreBox}>
          <p className={styles.loadMoreText}>Bạn đã xem hết các thông báo gần đây.</p>
        </div>
      )}
    </div>
  );
};

export default ThongBao;

