import React from 'react';
import { Table, Pagination } from 'antd';
import styles from '../index.module.less';
import { FieldTimeOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const data = [
  {
    id: 1,
    date: '25/10/2023',
    time: '09:30',
    petName: 'Heo',
    petType: 'Mèo',
    petAge: '2 tuổi',
    ownerName: 'Lê Văn C',
    phone: '0901234567',
    reason: 'Khám tổng quát',
    note: 'Cần kiểm tra cân nặng',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=heo',
  },
  {
    id: 2,
    date: '25/10/2023',
    time: '10:15',
    petName: 'Milo',
    petType: 'Chó Poodle',
    petAge: '4 tuổi',
    ownerName: 'Trần Thị B',
    phone: '0988777666',
    reason: 'Tiêm phòng',
    note: '—',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=milo2',
  },
  {
    id: 3,
    date: '26/10/2023',
    time: '14:00',
    petName: 'Luna',
    petType: 'Mèo Anh',
    petAge: '1 tuổi',
    ownerName: 'Phạm Minh H',
    phone: '0933222111',
    reason: 'Tư vấn dinh dưỡng',
    note: 'Nôn mửa kéo dài',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=luna2',
  },
  {
    id: 4,
    date: '26/10/2023',
    time: '15:30',
    petName: 'Bobi',
    petType: 'Hamster',
    petAge: '6 tháng',
    ownerName: 'Hoàng An',
    phone: '0944555666',
    reason: 'Khám răng',
    note: 'Chăm sóc thú nhỏ',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=bobi',
  },
];

const DangCho: React.FC = () => {
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <span style={{ fontWeight: 700, color: '#706F6C' }}>{text}</span>,
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <span style={{ fontWeight: 800, fontSize: '15px', color: '#2D2C28' }}>{text}</span>,
    },
    {
      title: 'Thú cưng & Chủ nuôi',
      key: 'pet',
      render: (_: any, record: any) => (
        <div className={styles.petCell}>
          <div className={`${styles.petIcon} ${record.petType.includes('Mèo') ? styles.teal : styles.gold}`}>
            🐾
          </div>
          <div className={styles.petInfo}>
            <span className={styles.petName}>
              {record.petName} <span className={styles.spec}>{record.petType}</span>
            </span>
            <span className={styles.petDesc}>{record.ownerName} • {record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#2D2C28' }}>{text}</span>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (text: string) => <span style={{ color: '#706F6C', fontStyle: 'italic' }}>{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`${styles.btnAction} ${styles.primary}`}>Xác nhận</button>
          <button className={`${styles.btnAction} ${styles.outlined}`} style={{ color: '#E53E3E', borderColor: '#E53E3E' }}>Từ chối</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false} 
          rowKey="id"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: '#706F6C', fontWeight: 600 }}>Hiển thị 1 - 4 trên tổng số 4 yêu cầu</span>
          <Pagination defaultCurrent={1} total={4} pageSize={4} />
        </div>
      </div>
    </>
  );
};

export default DangCho;
