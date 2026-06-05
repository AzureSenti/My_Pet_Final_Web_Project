import React, { useEffect, useState } from 'react';
import { Table, Pagination, Spin } from 'antd';
import { history } from 'umi';
import { getAppointments } from '@/services/BacSi/doctorService';
import styles from '../index.module.less';

const LichSuKham: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const result = await getAppointments(currentPage, pageSize, 'completed');
      setData(result.items || []);
      setTotal(result.total || 0);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử khám:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const columns = [
    {
      title: 'Ngày & Giờ',
      key: 'datetime',
      render: (_: any, record: any) => {
        const date = new Date(record.scheduled_at);
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#2D2C28' }}>
              {date.toLocaleDateString('vi-VN')}
            </span>
            <span style={{ fontSize: '12px', color: '#A3A19C', fontWeight: 600 }}>
              {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Thú cưng & Chủ nuôi',
      key: 'pet',
      render: (_: any, record: any) => (
        <div className={styles.petCell}>
          <div className={`${styles.petIcon} ${styles.teal}`}>🐾</div>
          <div className={styles.petInfo}>
            <span className={styles.petName}>
              {record.pet?.name} <span className={styles.spec}>{record.pet?.breed || record.pet?.species}</span>
            </span>
            <span className={styles.petDesc}>{record.owner?.full_name}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      key: 'service',
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 700, color: '#135D54' }}>{record.service?.name}</span>
      ),
    },
    {
      title: 'Ghi chú',
      key: 'notes',
      render: (_: any, record: any) => (
        <span style={{ color: '#706F6C', fontWeight: 500 }}>{record.notes || '—'}</span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: () => <span className={`${styles.badge} ${styles.teal}`}>Hoàn thành</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <button
          className={styles.btnAction}
          style={{
            background: '#7A631B',
            color: '#FFF',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.2',
          }}
          onClick={() => history.push(`/bac-si/lich-hen/benh-an?id=${record.id}`)}
        >
          <span style={{ fontSize: '11px', fontWeight: 700 }}>Xem</span>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>bệnh án</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
        <button className={`${styles.btnAction} ${styles.outlined}`}>Lọc theo ngày</button>
        <button className={`${styles.btnAction} ${styles.outlined}`}>Xuất báo cáo</button>
      </div>

      <div className={styles.tableContainer}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
            locale={{ emptyText: 'Chưa có lịch sử khám nào' }}
          />
        </Spin>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: '#706F6C', fontWeight: 600 }}>
            Hiển thị {data.length} trong tổng số {total} bệnh án
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

export default LichSuKham;
