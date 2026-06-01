import React from 'react';
import { Table, Pagination } from 'antd';
import { history } from 'umi';
import styles from '../index.module.less';

const data = [
  {
    id: 1,
    time: '09:00',
    dayInfo: 'Hôm nay',
    petName: 'Milo',
    petType: 'Beagle',
    petAge: '2 tuổi',
    ownerName: 'Lê Anh Quân',
    reason: 'Tiêm chủng định kỳ (Rabies)',
    status: 'Đang điều trị',
    action: 'Hoàn thiện hồ sơ',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=milo',
  },
  {
    id: 2,
    time: '10:30',
    dayInfo: 'Hôm nay',
    petName: 'Luna',
    petType: 'Anh lông ngắn',
    petAge: '4 tuổi',
    ownerName: 'Phạm Thùy Linh',
    reason: 'Kiểm tra sức khỏe tổng quát',
    status: 'Đang chờ',
    action: 'Xác nhận',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=luna',
  },
  {
    id: 3,
    time: '14:15',
    dayInfo: 'Hôm nay',
    petName: 'Bắp',
    petType: 'Golden',
    petAge: '5 tuổi',
    ownerName: 'Trần Minh Tâm',
    reason: 'Khám da liễu / Dị ứng',
    status: 'Đã xác nhận',
    action: 'Bắt đầu khám',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=bap',
  },
  {
    id: 4,
    time: '08:00',
    dayInfo: 'Hôm nay',
    petName: 'Kem',
    petType: 'Poodle',
    petAge: '1 tuổi',
    ownerName: 'Vũ Hà Nhi',
    reason: 'Lấy cao răng',
    status: 'Hoàn thành',
    action: 'Xem hồ sơ',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kem',
  },
];

const LichHomNay: React.FC = () => {
  const columns = [
    {
      title: 'Giờ hẹn',
      dataIndex: 'time',
      key: 'time',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#2D2C28' }}>{text}</span>
          <span style={{ fontSize: '11px', color: '#A3A19C', fontWeight: 600 }}>{record.dayInfo}</span>
        </div>
      ),
    },
    {
      title: 'Thú cưng & Chủ nuôi',
      key: 'pet',
      render: (_: any, record: any) => (
        <div className={styles.petCell}>
          <img src={record.avatar} alt="pet" className={styles.petAvatar} />
          <div className={styles.petInfo}>
            <span className={styles.petName}>{record.petName}</span>
            <span className={styles.petDesc}>{record.petType} • {record.petAge} • {record.ownerName}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#135D54' }}>🩺</span> {text}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let badgeClass = styles.gray;
        if (status === 'Đang điều trị' || status === 'Đã xác nhận') badgeClass = styles.teal;
        if (status === 'Đang chờ') badgeClass = styles.gold;
        return <span className={`${styles.badge} ${badgeClass}`}>{status}</span>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => {
        if (record.action === 'Hoàn thiện hồ sơ') {
          return <button className={`${styles.btnAction} ${styles.brown}`} onClick={() => history.push('/bac-si/lich-hen/kham-moi')}>Hoàn thiện hồ sơ bệnh án</button>;
        }
        if (record.action === 'Xác nhận') {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={`${styles.btnAction} ${styles.brown}`}>Xác nhận</button>
              <button className={`${styles.btnAction} ${styles.outlined}`}>Từ chối</button>
            </div>
          );
        }
        if (record.action === 'Bắt đầu khám') {
          return <button className={`${styles.btnAction} ${styles.brown}`} onClick={() => history.push('/bac-si/lich-hen/kham-moi')}>Bắt đầu khám</button>;
        }
        return <button className={styles.btnAction} style={{ background: 'transparent', color: '#706F6C', border: 'none' }} onClick={() => history.push('/bac-si/lich-hen/benh-an')}>Xem hồ sơ bệnh án</button>;
      },
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
        rowKey="id"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <span style={{ fontSize: '13px', color: '#706F6C', fontWeight: 600 }}>Hiển thị 4 trong 12 lịch hẹn</span>
        <Pagination defaultCurrent={1} total={12} pageSize={4} />
      </div>
    </div>
  );
};

export default LichHomNay;
