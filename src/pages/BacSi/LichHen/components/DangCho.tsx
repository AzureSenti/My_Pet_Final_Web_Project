import React, { useEffect, useState } from 'react';
import { Table, Pagination, Spin, message } from 'antd';
import { getAppointments, updateAppointmentStatus } from '@/services/BacSi/doctorService';
import styles from '../index.module.less';

const DangCho: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const result = await getAppointments(currentPage, pageSize, 'pending');
      setData(result.items || []);
      setTotal(result.total || 0);
    } catch (error) {
      console.error('Lỗi khi tải lịch hẹn chờ:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleConfirm = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'confirmed');
      message.success('Đã xác nhận lịch hẹn');
      fetchData(page);
    } catch (error) {
      message.error('Lỗi khi xác nhận lịch hẹn');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'cancelled');
      message.success('Đã từ chối lịch hẹn');
      fetchData(page);
    } catch (error) {
      message.error('Lỗi khi từ chối lịch hẹn');
    }
  };

  const columns = [
    {
      title: 'Ngày',
      key: 'date',
      render: (_: any, record: any) => {
        const date = new Date(record.scheduled_at);
        return <span style={{ fontWeight: 700, color: '#706F6C' }}>{date.toLocaleDateString('vi-VN')}</span>;
      },
    },
    {
      title: 'Giờ',
      key: 'time',
      render: (_: any, record: any) => {
        const date = new Date(record.scheduled_at);
        const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return <span style={{ fontWeight: 800, fontSize: '15px', color: '#2D2C28' }}>{timeStr}</span>;
      },
    },
    {
      title: 'Thú cưng & Chủ nuôi',
      key: 'pet',
      render: (_: any, record: any) => (
        <div className={styles.petCell}>
          <div className={`${styles.petIcon} ${styles.teal}`}>
            🐾
          </div>
          <div className={styles.petInfo}>
            <span className={styles.petName}>
              {record.pet?.name} <span className={styles.spec}>{record.pet?.breed || record.pet?.species}</span>
            </span>
            <span className={styles.petDesc}>{record.owner?.full_name} • {record.owner?.phone || record.owner?.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Lý do',
      key: 'reason',
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 600, color: '#2D2C28' }}>{record.service?.name}</span>
      ),
    },
    {
      title: 'Ghi chú',
      key: 'note',
      render: (_: any, record: any) => (
        <span style={{ color: '#706F6C', fontStyle: 'italic' }}>{record.notes || '—'}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`${styles.btnAction} ${styles.primary}`} onClick={() => handleConfirm(record.id)}>
            Xác nhận
          </button>
          <button
            className={`${styles.btnAction} ${styles.outlined}`}
            style={{ color: '#E53E3E', borderColor: '#E53E3E' }}
            onClick={() => handleReject(record.id)}
          >
            Từ chối
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.tableContainer}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
            locale={{ emptyText: 'Không có lịch hẹn nào đang chờ xác nhận' }}
          />
        </Spin>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: '#706F6C', fontWeight: 600 }}>
            Hiển thị {data.length} trên tổng số {total} yêu cầu
          </span>
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </>
  );
};

export default DangCho;
