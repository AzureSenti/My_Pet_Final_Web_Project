import React, { useEffect, useState } from 'react';
import { history, Link, useLocation } from 'umi';
import { Spin, message } from 'antd';
import { 
  PrinterOutlined, EditOutlined, PlusOutlined, 
  CalendarOutlined, MedicineBoxOutlined, WarningOutlined,
  HistoryOutlined, MessageOutlined
} from '@ant-design/icons';
import { getAppointmentDetail, getPetMedicalHistory } from '@/services/BacSi/doctorService';
import { createConversation } from '@/services/messageService';
import styles from './index.module.less';

const BenhAn: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const appointmentId = query.get('id');

  const [appointment, setAppointment] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId) {
        message.error('Không tìm thấy ID lịch hẹn');
        return;
      }
      try {
        setLoading(true);
        const aptData = await getAppointmentDetail(appointmentId);
        setAppointment(aptData);

        // Nếu có pet_id thì lấy lịch sử bệnh án
        if (aptData?.pet?.id) {
          try {
            const historyData = await getPetMedicalHistory(aptData.pet.id);
            setMedicalHistory(historyData);
          } catch (err) {
            // Có thể chưa có bệnh án nào
            console.log('Chưa có lịch sử bệnh án');
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải bệnh án:', error);
        message.error('Lỗi khi tải dữ liệu bệnh án');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '100px', color: '#999' }}>
          Không tìm thấy thông tin lịch hẹn
        </div>
      </div>
    );
  }

  const pet = appointment.pet;
  const owner = appointment.owner;
  const scheduledDate = new Date(appointment.scheduled_at);
  const records = medicalHistory?.items || [];

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/bac-si/lich-hen">Bệnh án</Link> / {pet?.name} ({pet?.breed || pet?.species})
      </div>
      
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Bệnh án chi tiết</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnAction}><PrinterOutlined /> In Bệnh Án</button>
          <button className={styles.btnAction}><EditOutlined /> Chỉnh Sửa</button>
          <button 
            className={styles.btnAction}
            onClick={async () => {
              try {
                if (!owner?.id) {
                  message.error('Không tìm thấy thông tin khách hàng');
                  return;
                }
                const res = await createConversation({ participant_ids: [owner.id] });
                history.push(`/bac-si/tu-van/phan-hoi?id=${res.id}`);
              } catch (e) {
                message.error('Lỗi tạo cuộc trò chuyện');
              }
            }}
          >
            <MessageOutlined /> Nhắn Khách
          </button>
          <button 
            className={`${styles.btnAction} ${styles.primary}`}
            onClick={() => history.push(`/bac-si/lich-hen/kham-moi?id=${appointmentId}`)}
          >
            <PlusOutlined /> Khám Mới
          </button>
        </div>
      </div>

      <div className={styles.bannerCard}>
        <img
          src={pet?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${pet?.name}`}
          alt={pet?.name}
          className={styles.petAvatar}
        />
        <div className={styles.bannerInfo}>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>TÊN THÚ CƯNG</span>
            <span className={styles.blockValue}>{pet?.name}</span>
            <span className={styles.blockSub}>{pet?.breed || pet?.species}, {pet?.gender === 'male' ? 'Đực' : 'Cái'}</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>DỊCH VỤ</span>
            <span className={styles.blockValue}>{appointment.service?.name}</span>
            <span className={styles.blockSub}>{appointment.service?.duration_minutes} phút</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>CHỦ SỞ HỮU</span>
            <span className={styles.blockValue}>{owner?.full_name}</span>
            <span className={styles.blockSub}>{owner?.phone || owner?.email}</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>NGÀY KHÁM</span>
            <span className={styles.blockValue}>{scheduledDate.toLocaleDateString('vi-VN')}</span>
            <span className={styles.statusBadge}>
              {appointment.status === 'completed' ? 'Hoàn thành' : appointment.status === 'confirmed' ? 'Đã xác nhận' : appointment.status}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.gold}`}><CalendarOutlined /></div>
            <div className={styles.statTitle}>Tổng số lần khám</div>
          </div>
          <div className={styles.statValue}>{records.length} Lần</div>
          <div className={styles.statFooter}>
            <span>Dịch vụ: {appointment.service?.name}</span>
            <a href="#">Xem lịch sử</a>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.teal}`}><MedicineBoxOutlined /></div>
            <div className={styles.statTitle}>Lần khám gần nhất</div>
          </div>
          <div className={styles.statValue}>
            {records.length > 0
              ? new Date(records[0].recorded_at).toLocaleDateString('vi-VN')
              : 'Chưa có'}
          </div>
          <div className={styles.statFooter}>
            <span>{records.length > 0 ? records[0].diagnosis : '—'}</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.red}`}><WarningOutlined /></div>
            <div className={styles.statTitle}>Ghi chú</div>
          </div>
          <div className={styles.statValue}>{appointment.notes || 'Không có'}</div>
          <div className={styles.statSub}>
            {appointment.notes ? 'Cần lưu ý khi khám' : 'Không có ghi chú đặc biệt'}
          </div>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column — Lịch Sử Khám Bệnh */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><HistoryOutlined className={styles.icon} /> Lịch Sử Khám Bệnh</h3>
          </div>
          
          {records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
              Chưa có lịch sử khám bệnh
            </div>
          ) : (
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Ngày khám</th>
                  <th>Chẩn đoán</th>
                  <th>Điều trị</th>
                  <th>Đơn thuốc</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record: any) => (
                  <tr key={record.id}>
                    <td className={styles.date}>{new Date(record.recorded_at).toLocaleDateString('vi-VN')}</td>
                    <td>{record.diagnosis}</td>
                    <td>{record.treatment}</td>
                    <td className={styles.doc}>{record.prescription || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Column */}
        <div>
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles.cardHeader}>
              <h3><MedicineBoxOutlined className={styles.icon} /> Thông tin thú cưng</h3>
            </div>
            <div className={styles.timelineList}>
              <div className={styles.timelineItem}>
                <div>
                  <div className={styles.tlTitle}>Loài / Giống</div>
                  <div className={styles.tlSub}>{pet?.species} / {pet?.breed || '—'}</div>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div>
                  <div className={styles.tlTitle}>Giới tính</div>
                  <div className={styles.tlSub}>{pet?.gender === 'male' ? 'Đực' : 'Cái'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>💊</span> Đơn Thuốc Gần Đây</h3>
            </div>
            {records.length > 0 && records[0].prescription ? (
              <div className={styles.medList}>
                <div className={styles.medItem}>
                  <div className={styles.medIcon}>💊</div>
                  <div className={styles.medInfo}>
                    <div className={styles.medName}>{records[0].prescription}</div>
                    <div className={styles.medDose}>
                      Ngày kê: {new Date(records[0].recorded_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', color: '#999' }}>
                Chưa có đơn thuốc
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenhAn;
