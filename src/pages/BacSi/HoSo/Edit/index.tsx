import React, { useState } from 'react';
import { history, useModel } from 'umi';
import { message } from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  FileTextOutlined,
  ToolOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { updateProfile } from '@/services/BacSi/doctorService';
import styles from './index.module.less';

const HoSoEdit: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      message.warning('Vui lòng nhập họ và tên');
      return;
    }

    try {
      setSubmitting(true);
      const updatedUser = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
      });

      // Cập nhật lại initialState để các trang khác cũng hiện dữ liệu mới
      if (setInitialState) {
        setInitialState((prev: any) => ({
          ...prev,
          currentUser: { ...prev?.currentUser, ...updatedUser },
        }));
      }

      message.success('Cập nhật hồ sơ thành công!');
      history.push('/bac-si/ho-so');
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
      message.error('Lỗi khi cập nhật hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <button className={styles.btnBack} onClick={() => history.push('/bac-si/ho-so')}>
          <ArrowLeftOutlined />
        </button>
        <div>
          <h1 className={styles.title}>Chỉnh sửa hồ sơ</h1>
          <p className={styles.subtitle}>Cập nhật thông tin chuyên môn của bạn</p>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Cột trái */}
        <div className={styles.leftCol}>
          <div className={`${styles.card} ${styles.avatarCard}`}>
            <div className={styles.avatarBox}>
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`} alt="Doctor Avatar" />
            </div>
            <h2 className={styles.docName}>Dr. {fullName || currentUser?.full_name}</h2>
            <span className={styles.docRole}>Bác sĩ Thú y</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#706F6C', fontWeight: 800 }}>
                Trạng thái tài khoản
              </h3>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Trạng thái</span>
              <span className={styles.statusVal}>
                {currentUser?.is_active ? (
                  <CheckCircleFilled className={styles.checkIcon} />
                ) : (
                  'Chưa kích hoạt'
                )}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Ngày tham gia</span>
              <span className={styles.statusVal}>
                {currentUser?.created_at
                  ? new Date(currentUser.created_at).toLocaleDateString('vi-VN')
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><UserOutlined className={styles.icon} /> Thông tin cá nhân</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Họ và Tên</label>
                <input
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  value={currentUser?.email || ''}
                  readOnly
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số điện thoại</label>
                <input
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+84..."
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Vai trò</label>
                <input
                  className={styles.input}
                  value={currentUser?.role === 'vet' ? 'Bác sĩ Thú y' : currentUser?.role || '—'}
                  readOnly
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><FileTextOutlined className={styles.icon} /> Giới thiệu bản thân</h3>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tiểu sử chuyên môn</label>
              {/* TODO: Thêm field bio vào backend UserUpdate schema nếu cần */}
              <textarea
                className={styles.textarea}
                defaultValue={`Bác sĩ ${fullName} chuyên sâu trong lĩnh vực thú y.`}
                placeholder="Mô tả tiểu sử chuyên môn của bạn..."
              />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><ToolOutlined className={styles.icon} /> Kinh nghiệm làm việc</h3>
              <button className={styles.btnAdd}>+ Thêm mới</button>
            </div>
            {/* TODO: Kết nối API kinh nghiệm khi backend có field tương ứng */}
            <div className={styles.expFormItem}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Thời gian</label>
                  <input className={styles.input} placeholder="VD: 2018 - Nay" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Chức vụ & Đơn vị</label>
                  <input className={styles.input} placeholder="VD: Bác sĩ trưởng - Phòng khám ABC" />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label className={styles.label}>Mô tả công việc</label>
                  <input className={styles.input} placeholder="Mô tả ngắn gọn công việc..." />
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              onClick={() => history.push('/bac-si/ho-so')}
            >
              Hủy
            </button>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#135D54',
                color: '#fff',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                opacity: submitting ? 0.6 : 1,
              }}
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSoEdit;
