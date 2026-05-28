import React from 'react';
import { Table, Pagination } from 'antd';
import { history } from 'umi';
import styles from '../index.module.less';
import { HistoryOutlined, MedicineBoxOutlined, PlusOutlined } from '@ant-design/icons';

const data = [
  {
    id: 1,
    date: '10/05/2024',
    time: '09:00 AM',
    petName: 'Milo',
    petType: 'Beagle',
    ownerName: 'Lê Anh Quân',
    service: 'Tiêm chủng định kỳ',
    diagnosis: 'Đã tiêm xong, theo dõi thêm...',
    status: 'Hoàn thành',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=milo3',
  },
  {
    id: 2,
    date: '08/05/2024',
    time: '14:30 PM',
    petName: 'Luna',
    petType: 'Mèo Anh lông ngắn',
    ownerName: 'Phạm Thùy Linh',
    service: 'Kiểm tra sức khỏe tổng quát',
    diagnosis: 'Sức khỏe tốt, cần giảm cân',
    status: 'Hoàn thành',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=luna3',
  },
  {
    id: 3,
    date: '05/05/2024',
    time: '16:15 PM',
    petName: 'Bắp',
    petType: 'Golden Retriever',
    ownerName: 'Trần Minh Tâm',
    service: 'Khám da liễu',
    diagnosis: 'Dị ứng thức ăn, thay đổi t...',
    status: 'Hoàn thành',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=bap3',
  },
];

const LichSuKham: React.FC = () => {
  const columns = [
    {
      title: 'Ngày & Giờ',
      key: 'datetime',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#2D2C28' }}>{record.date}</span>
          <span style={{ fontSize: '12px', color: '#A3A19C', fontWeight: 600 }}>{record.time}</span>
        </div>
      ),
    },
    {
      title: 'Thú cưng & Chủ nuôi',
      key: 'pet',
      render: (_: any, record: any) => (
        <div className={styles.petCell}>
          <div className={`${styles.petIcon} ${styles.teal}`}>🐾</div>
          <div className={styles.petInfo}>
            <span className={styles.petName}>
              {record.petName} <span className={styles.spec}>{record.petType}</span>
            </span>
            <span className={styles.petDesc}>{record.ownerName}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (text: string) => <span style={{ fontWeight: 700, color: '#135D54' }}>{text}</span>,
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text: string) => <span style={{ color: '#706F6C', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <span className={`${styles.badge} ${styles.teal}`}>{status}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <button 
          className={styles.btnAction} 
          style={{ background: '#7A631B', color: '#FFF', borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '1.2' }}
          onClick={() => history.push('/bac-si/lich-hen/benh-an')}
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
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false} 
          rowKey="id"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: '#706F6C', fontWeight: 600 }}>Hiển thị 3 trong tổng số 42 bệnh án</span>
          <Pagination defaultCurrent={1} total={42} pageSize={3} />
        </div>
      </div>
    </>
  );
};

export default LichSuKham;
