import React from 'react';
import { history } from 'umi';
import {
  ArrowLeftOutlined,
  UserOutlined,
  FileTextOutlined,
  ToolOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import styles from './index.module.less';

const HoSoEdit: React.FC = () => {
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
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=doctor" alt="Doctor Avatar" />
            </div>
            <h2 className={styles.docName}>Dr. Nguyễn Văn A</h2>
            <span className={styles.docRole}>Bác sĩ Thú y Cao cấp</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#706F6C', fontWeight: 800 }}>
                Trạng thái tài khoản
              </h3>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Đã xác minh</span>
              <span className={styles.statusVal}>
                <CheckCircleFilled className={styles.checkIcon} />
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Ngày tham gia</span>
              <span className={styles.statusVal}>12/05/2021</span>
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
                <input className={styles.input} defaultValue="Nguyễn Văn A" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Chuyên khoa</label>
                <input className={styles.input} defaultValue="Nội khoa, Phẫu thuật" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} defaultValue="nguyenvana@clinic.vn" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số điện thoại</label>
                <input className={styles.input} defaultValue="+84 901 234 567" />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><FileTextOutlined className={styles.icon} /> Giới thiệu bản thân</h3>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tiểu sử chuyên môn</label>
              <textarea className={styles.textarea} defaultValue="Với hơn 10 năm kinh nghiệm trong lĩnh vực y học thú y, tôi cam kết mang lại sự chăm sóc tận tâm nhất cho thú cưng của bạn. Tôi đã thực hiện hàng nghìn ca phẫu thuật phức tạp và luôn cập nhật những kiến thức y khoa mới nhất." />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><ToolOutlined className={styles.icon} /> Kinh nghiệm làm việc</h3>
              <button className={styles.btnAdd}>+ Thêm mới</button>
            </div>
            
            <div className={styles.expFormItem}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Thời gian</label>
                  <input className={styles.input} defaultValue="2018 - Nay" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Chức vụ & Đơn vị</label>
                  <input className={styles.input} defaultValue="Bác sĩ trưởng - Green Valley Clinic" />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label className={styles.label}>Mô tả công việc</label>
                  <input className={styles.input} defaultValue="Điều hành đội ngũ y tế, chẩn đoán hình ảnh cao cấp và phẫu thuật nội soi." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSoEdit;
