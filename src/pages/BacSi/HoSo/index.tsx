import React from 'react';
import { history } from 'umi';
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
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Hồ sơ bác sĩ</h1>
      </div>

      <div className={`${styles.card} ${styles.profileHeader}`}>
        <div className={styles.avatarBox}>
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=doctor" alt="Doctor" />
        </div>
        <div className={styles.infoBox}>
          <h2 className={styles.docName}>Dr. Nguyễn Văn A</h2>
          <div className={styles.tagGroup}>
            <span className={styles.specTag}>Nội khoa</span>
            <span className={styles.specTag}>Phẫu thuật</span>
          </div>
          <div className={styles.contactGroup}>
            <span><MailOutlined /> nguyenvana@clinic.vn</span>
            <span><PhoneOutlined /> +84 901 234 567</span>
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
              Bác sĩ Nguyễn Văn A có hơn 15 năm kinh nghiệm trong lĩnh vực thú y, chuyên sâu về nội khoa và phẫu thuật mô mềm. Với tâm huyết dành cho phúc lợi động vật, bác sĩ luôn cập nhật các phương pháp điều trị tiên tiến nhất để mang lại sự an tâm cho chủ nuôi và sức khỏe tốt nhất cho thú cưng.
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>
              <ToolOutlined className={styles.icon} /> Kinh nghiệm làm việc
            </h3>
            <div className={styles.expList}>
              <div className={styles.expItem}>
                <div className={styles.expTime}>2018 - Nay</div>
                <div className={styles.expTitle}>Trưởng khoa Nội - Green Valley Clinic</div>
                <div className={styles.expDesc}>Quản lý đội ngũ bác sĩ nội khoa, trực tiếp điều trị các ca bệnh phức tạp.</div>
              </div>
              <div className={styles.expItem}>
                <div className={styles.expTime}>2010 - 2018</div>
                <div className={styles.expTitle}>Bác sĩ Phẫu thuật - Central Vet Hospital</div>
                <div className={styles.expDesc}>Thực hiện hơn 500 ca phẫu thuật chỉnh hình và mô mềm.</div>
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
            <div className={styles.certList}>
              <div className={styles.certItem}>
                <SafetyCertificateOutlined className={styles.certIcon} />
                <div>
                  <div className={styles.certTitle}>Chứng chỉ Phẫu thuật Thú y Nâng cao</div>
                  <div className={styles.certMeta}>Cấp bởi AVMA - 2021</div>
                </div>
              </div>
              <div className={styles.certItem}>
                <SafetyCertificateOutlined className={styles.certIcon} />
                <div>
                  <div className={styles.certTitle}>Nghiên cứu Nội khoa Lâm sàng</div>
                  <div className={styles.certMeta}>ĐH Nông Lâm TP.HCM - 2008</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ratingBlock}>
            <div className={styles.ratingLabel}>Tỷ lệ hài lòng</div>
            <div className={styles.ratingValue}>
              98% <span>↑ 2.4% tháng này</span>
            </div>
            <div className={styles.ratingBar}></div>
            <div className={styles.ratingQuote}>
              "Bác sĩ A rất tận tâm và nhẹ nhàng với bé cún của tôi." – Client Review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSo;
