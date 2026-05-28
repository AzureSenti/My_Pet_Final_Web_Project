import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import { history } from 'umi';
import { getTodayAppointments, updateAppointmentStatus } from '@/services/BacSi/doctorService';
import styles from '../index.module.less';

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: 'Đang chờ', className: 'gold' },
  confirmed: { label: 'Đã xác nhận', className: 'teal' },
  completed: { label: 'Hoàn thành', className: 'gray' },
  cancelled: { label: 'Đã hủy', className: 'gray' },
};

const LichHomNay: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getTodayAppointments();
      setData(result);
    } catch (error) {
      console.error('Lỗi khi tải lịch hẹn hôm nay:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'confirmed');
      message.success('Đã xác nhận lịch hẹn');
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xác nhận lịch hẹn');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'cancelled');
      message.success('Đã từ chối lịch hẹn');
      fetchData();
    } catch (error) {
      message.error('Lỗi khi từ chối lịch hẹn');
    }
  };



  const columns = [
    {
      title: 'Giờ hẹn',
      key: 'time',
      render: (_: any, record: any) => {
        const date = new Date(record.scheduled_at);
        const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#2D2C28' }}>{timeStr}</span>
            <span style={{ fontSize: '11px', color: '#A3A19C', fontWeight: 600 }}>Hôm nay</span>
          </div>
        );
      },
    },
    {
      title: 'Thú cưng & Chủ nuôi',
      key: 'pet',
      render: (_: any, record: any) => (
        <div className={styles.petCell}>
          <img
            src={record.pet?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${record.pet?.name}`}
            alt="pet"
            className={styles.petAvatar}
          />
          <div className={styles.petInfo}>
            <span className={styles.petName}>{record.pet?.name}</span>
            <span className={styles.petDesc}>
              {record.pet?.breed || record.pet?.species} • {record.pet?.gender === 'male' ? 'Đực' : 'Cái'} • {record.owner?.full_name}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Lý do khám',
      key: 'reason',
      render: (_: any, record: any) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#135D54' }}>🩺</span> {record.service?.name}
          {record.notes && <span style={{ color: '#706F6C', fontStyle: 'italic' }}> - {record.notes}</span>}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => {
        const info = statusMap[record.status] || { label: record.status, className: 'gray' };
        return <span className={`${styles.badge} ${styles[info.className]}`}>{info.label}</span>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => {
        if (record.status === 'confirmed' && record.has_medical_record) {
          return (
            <button
              className={styles.btnAction}
              style={{ background: 'transparent', color: '#706F6C', border: 'none' }}
              onClick={() => history.push(`/bac-si/lich-hen/benh-an?id=${record.id}`)}
            >
              Xem hồ sơ bệnh án
            </button>
          );
        }
        if (record.status === 'confirmed') {
          return (
            <button
              className={`${styles.btnAction} ${styles.brown}`}
              onClick={() => history.push(`/bac-si/lich-hen/kham-moi?id=${record.id}`)}
            >
              Bắt đầu khám
            </button>
          );
        }
        if (record.status === 'completed') {
          return (
            <button
              className={styles.btnAction}
              style={{ background: 'transparent', color: '#706F6C', border: 'none' }}
              onClick={() => history.push(`/bac-si/lich-hen/benh-an?id=${record.id}`)}
            >
              Xem hồ sơ bệnh án
            </button>
          );
        }
        if (record.status === 'pending') {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={`${styles.btnAction} ${styles.brown}`} onClick={() => handleConfirm(record.id)}>
                Xác nhận
              </button>
              <button className={`${styles.btnAction} ${styles.outlined}`} onClick={() => handleReject(record.id)}>
                Từ chối
              </button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          locale={{ emptyText: 'Không có lịch hẹn nào hôm nay' }}
        />
      </Spin>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <span style={{ fontSize: '13px', color: '#706F6C', fontWeight: 600 }}>
          Hiển thị {data.length} lịch hẹn
        </span>
      </div>
    </div>
  );
};

export default LichHomNay;
