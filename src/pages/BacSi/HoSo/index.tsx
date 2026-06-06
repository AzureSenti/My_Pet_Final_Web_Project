import React from 'react';
import { history } from 'umi';
import { useModel } from 'umi';
import {
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  FileTextOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';

const HoSo: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const fullName = currentUser?.full_name || 'Bác sĩ';
  const email = currentUser?.email || '—';
  const phone = currentUser?.phone || '—';

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Hồ sơ bác sĩ</h1>
      </div>

      <div className={`${styles.card} ${styles.profileHeader}`}>
        <div className={styles.avatarBox}>
          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`} alt="Doctor" />
        </div>
        <div className={styles.infoBox}>
          <h2 className={styles.docName}>Dr. {fullName}</h2>
          <div className={styles.tagGroup}>
            <span className={styles.specTag}>Bác sĩ Thú y</span>
          </div>
          <div className={styles.contactGroup}>
            <span><MailOutlined /> {email}</span>
            <span><PhoneOutlined /> {phone}</span>
          </div>
        </div>
        <button className={styles.btnEdit} onClick={() => history.push('/bac-si/ho-so/chinh-sua')}>
          <EditOutlined /> Chỉnh sửa hồ sơ
        </button>
      </div>

      <div className={styles.gridContainer}>
        {/* Cột trái */}
        <div className={styles.gridCol}>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <FileTextOutlined className={styles.icon} /> Giới thiệu bản thân
            </h3>
            <div className={styles.aboutText}>
              {/* TODO: Thêm field bio/description vào backend schema nếu cần */}
              Bác sĩ {fullName} chuyên sâu trong lĩnh vực thú y, luôn cập nhật các phương pháp điều trị tiên tiến nhất để mang lại sự an tâm cho chủ nuôi và sức khỏe tốt nhất cho thú cưng.
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <ToolOutlined className={styles.icon} /> Kinh nghiệm làm việc
            </h3>
            {/* TODO: Kết nối API kinh nghiệm khi backend có field tương ứng */}
            <div className={styles.expList}>
              <div className={styles.expItem}>
                <div className={styles.expTime}>—</div>
                <div className={styles.expTitle}>Chưa cập nhật kinh nghiệm</div>
                <div className={styles.expDesc}>Vui lòng chỉnh sửa hồ sơ để thêm kinh nghiệm làm việc.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className={styles.gridCol}>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <SafetyCertificateOutlined className={styles.icon} /> Chứng chỉ hành nghề
            </h3>
            {/* TODO: Kết nối API chứng chỉ khi backend có field tương ứng */}
            <div className={styles.certList}>
              <div className={styles.certItem}>
                <SafetyCertificateOutlined className={styles.certIcon} />
                <div>
                  <div className={styles.certTitle}>Chưa cập nhật chứng chỉ</div>
                  <div className={styles.certMeta}>Vui lòng liên hệ quản trị viên</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ratingBlock}>
            <div className={styles.ratingLabel}>Thông tin tài khoản</div>
            <div className={styles.ratingValue}>
              {currentUser?.role === 'vet' ? 'Bác sĩ Thú y' : currentUser?.role || '—'}
            </div>
            <div className={styles.ratingBar}></div>
            <div className={styles.ratingQuote}>
              Ngày tham gia: {currentUser?.created_at
                ? new Date(currentUser.created_at).toLocaleDateString('vi-VN')
                : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSo;
