import { CalendarOutlined, CheckCircleOutlined, InfoCircleOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Col, Row, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getDoctorStats, getUpcomingAppointments } from '@/services/BacSi/doctorService';
import styles from './index.module.less';

const { Text, Title } = Typography;

const today = new Date();
const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const todayStr = `Hôm nay là ${dayNames[today.getDay()]}, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

const systemNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Cập nhật hệ thống thành công',
    desc: 'Phiên bản 2.4.0 đã được triển khai với các cải thiện về hiệu suất đáng chú ý.',
    time: '10 phút trước',
    icon: <CheckCircleOutlined />,
  },
  {
    id: 2,
    type: 'info',
    title: 'Nhắc nhở lịch họp',
    desc: 'Họp giao ban cuối tuần sẽ diễn ra vào lúc 16:30 chiều nay tại phòng họp B.',
    time: '2 giờ trước',
    icon: <InfoCircleOutlined />,
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  'pending': { label: 'Chờ xác nhận', color: 'orange' },
  'confirmed': { label: 'Đã xác nhận', color: 'green' },
  'completed': { label: 'Hoàn thành', color: 'blue' },
  'cancelled': { label: 'Đã hủy', color: 'red' },
};

const VetDashboard: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const doctorName = initialState?.currentUser?.full_name || 'Bác sĩ';

  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, appointmentsData] = await Promise.all([
          getDoctorStats(),
          getUpcomingAppointments(5),
        ]);
        setStats(statsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todayCount = stats?.appointments_by_status?.confirmed ?? 0;
  const pendingCount = stats?.appointments_by_status?.pending ?? 0;
  const unreadMessages = 0; // TODO: Kết nối API unread-count khi cần
  const avgRating = 4.8; // TODO: Kết nối API đánh giá khi backend sẵn sàng

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} className={styles.greeting}>Xin chào, {doctorName}!</Title>
          <Text className={styles.dateText}>{todayStr}</Text>
        </div>
        <Badge status="success" text="Hệ thống hoạt động tốt" className={styles.statusBadge} />
      </div>

      {/* Stat Cards */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} className={styles.statsRow}>
          <Col xs={12} sm={6}>
            <Card className={`${styles.statCard} ${styles.statBlue}`}>
              <div className={styles.statLabel}>HÔM NAY</div>
              <CalendarOutlined className={styles.statIcon} />
              <div className={styles.statNumber}>{todayCount}</div>
              <div className={styles.statDesc}>Lịch hẹn hôm nay</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={`${styles.statCard} ${styles.statOrange}`}>
              <div className={styles.statLabel}>CHỜ DUYỆT</div>
              <CalendarOutlined className={styles.statIcon} />
              <div className={styles.statNumber}>{pendingCount}</div>
              <div className={styles.statDesc}>Lịch hẹn chờ xác nhận</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={`${styles.statCard} ${styles.statGreen}`}>
              <div className={styles.statLabel}>TIN NHẮN</div>
              <MessageOutlined className={styles.statIcon} />
              <div className={styles.statNumber}>{unreadMessages}</div>
              <div className={styles.statDesc}>Tư vấn chờ phản hồi</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={`${styles.statCard} ${styles.statTeal}`}>
              <div className={styles.statLabel}>RATING</div>
              <StarOutlined className={styles.statIcon} />
              <div className={styles.statNumber}>{avgRating}</div>
              <div className={styles.statDesc}>⭐ Đánh giá trung bình</div>
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Bottom Section */}
      <Row gutter={[16, 16]}>
        {/* Upcoming Appointments */}
        <Col xs={24} lg={14}>
          <Card
            className={styles.sectionCard}
            title={<span className={styles.cardTitle}>Lịch hẹn sắp tới</span>}
            extra={<a href="/bac-si/lich-hen" className={styles.viewAll}>Xem tất cả</a>}
          >
            {loading ? (
              <Spin />
            ) : appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                Không có lịch hẹn sắp tới
              </div>
            ) : (
              appointments.map((apt: any) => {
                const scheduledDate = new Date(apt.scheduled_at);
                const dateStr = scheduledDate.toLocaleDateString('vi-VN');
                const timeStr = scheduledDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={apt.id} className={styles.appointmentItem}>
                    <Avatar
                      size={42}
                      src={apt.pet?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${apt.owner?.full_name}`}
                      className={styles.appointmentAvatar}
                    />
                    <div className={styles.appointmentInfo}>
                      <div className={styles.aptOwner}>{apt.owner?.full_name}</div>
                      <div className={styles.aptPet}>
                        {apt.service?.name} cho '{apt.pet?.name}' ({apt.pet?.breed || apt.pet?.species})
                      </div>
                    </div>
                    <div className={styles.appointmentRight}>
                      <Tag color={statusMap[apt.status]?.color} className={styles.aptTag}>
                        {statusMap[apt.status]?.label}
                      </Tag>
                      <div className={styles.aptTime}>{dateStr} · {timeStr}</div>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </Col>

        {/* System Notifications — TODO: Kết nối API notifications khi backend sẵn sàng */}
        <Col xs={24} lg={10}>
          <Card
            className={styles.sectionCard}
            title={<span className={styles.cardTitle}>Thông báo hệ thống</span>}
          >
            {systemNotifications.map((notif) => (
              <div key={notif.id} className={`${styles.notifItem} ${styles[`notif_${notif.type}`]}`}>
                <div className={styles.notifIcon}>{notif.icon}</div>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitle}>{notif.title}</div>
                  <div className={styles.notifDesc}>{notif.desc}</div>
                  <div className={styles.notifTime}>{notif.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VetDashboard;
