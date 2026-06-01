import React from 'react';
import { history, Link } from 'umi';
import { 
  PrinterOutlined, EditOutlined, PlusOutlined, 
  CalendarOutlined, MedicineBoxOutlined, WarningOutlined,
  HistoryOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import styles from './index.module.less';

const BenhAn: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/bac-si/lich-hen">Bệnh án</Link> / Milo (Beagle)
      </div>
      
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Bệnh án chi tiết</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnAction}><PrinterOutlined /> In Bệnh Án</button>
          <button className={styles.btnAction}><EditOutlined /> Chỉnh Sửa</button>
          <button 
            className={`${styles.btnAction} ${styles.primary}`}
            onClick={() => history.push('/bac-si/lich-hen/kham-moi')}
          >
            <PlusOutlined /> Khám Mới
          </button>
        </div>
      </div>

      <div className={styles.bannerCard}>
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=milo3" alt="Milo" className={styles.petAvatar} />
        <div className={styles.bannerInfo}>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>TÊN THÚ CƯNG</span>
            <span className={styles.blockValue}>Milo</span>
            <span className={styles.blockSub}>Beagle, Đực</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>TUỔI & CÂN NẶNG</span>
            <span className={styles.blockValue}>2 Tuổi</span>
            <span className={styles.blockSub}>12.5 kg</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>CHỦ SỞ HỮU</span>
            <span className={styles.blockValue}>Lê Anh Quân</span>
            <span className={styles.blockSub}>090 123 4567</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.blockLabel}>MÃ SỐ BỆNH NHÂN</span>
            <span className={styles.blockValue}>#PET-2024-089</span>
            <span className={styles.statusBadge}>Hoạt động</span>
          </div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.gold}`}><CalendarOutlined /></div>
            <div className={styles.statTitle}>Tổng số lần khám</div>
          </div>
          <div className={styles.statValue}>14 Lần</div>
          <div className={styles.statFooter}>
            <span>Lần cuối: 12/10/2023</span>
            <a href="#">Xem lịch sử</a>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.teal}`}><MedicineBoxOutlined /></div>
            <div className={styles.statTitle}>Tiêm chủng gần nhất</div>
          </div>
          <div className={styles.statValue}>05/01/2024</div>
          <div className={styles.statFooter}>
            <span>Tiếp theo: 05/01/2025</span>
            <span className={styles.tagSoon}>SẮP TỚI</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.red}`}><WarningOutlined /></div>
            <div className={styles.statTitle}>Dị ứng & Chống chỉ định</div>
          </div>
          <div className={styles.statValue}>Penicillin</div>
          <div className={styles.statSub}>
            Cần lưu ý đặc biệt khi kê đơn
          </div>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><HistoryOutlined className={styles.icon} /> Lịch Sử Khám Bệnh</h3>
            <select className={styles.selectYear}>
              <option>Năm 2024</option>
              <option>Năm 2023</option>
            </select>
          </div>
          
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Ngày khám</th>
                <th>Chẩn đoán</th>
                <th>Điều trị</th>
                <th>Bác sĩ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.date}>12/10/2023</td>
                <td>Viêm tai ngoài</td>
                <td>Vệ sinh tai + Thuốc nhỏ</td>
                <td className={styles.doc}>BS. Minh Anh</td>
              </tr>
              <tr>
                <td className={styles.date}>25/08/2023</td>
                <td>Kiểm tra định kỳ</td>
                <td>Sức khỏe tốt, ổn định</td>
                <td className={styles.doc}>BS. Hoàng Nam</td>
              </tr>
              <tr>
                <td className={styles.date}>15/05/2023</td>
                <td>Viêm da tiếp xúc</td>
                <td>Thay đổi sữa tắm, kem bôi</td>
                <td className={styles.doc}>BS. Minh Anh</td>
              </tr>
            </tbody>
          </table>
          <button className={styles.btnLoadMore}>Xem thêm lịch sử khám</button>
        </div>

        {/* Right Column */}
        <div>
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles.cardHeader}>
              <h3><MedicineBoxOutlined className={styles.icon} /> Lịch Tiêm Chủng</h3>
            </div>
            <div className={styles.timelineList}>
              <div className={styles.timelineItem}>
                <div>
                  <div className={styles.tlTitle}>Dại (Rabies)</div>
                  <div className={styles.tlSub}>Đã tiêm: 05/01/2024<br/>Nhắc lại: 05/01/2025</div>
                </div>
                <div className={`${styles.tlIcon} ${styles.check}`}>✔</div>
              </div>
              <div className={styles.timelineItem}>
                <div>
                  <div className={styles.tlTitle}>DHPPi / L (5 Bệnh)</div>
                  <div className={styles.tlSub}>Đã tiêm: 20/08/2023<br/>Nhắc lại: 20/08/2024</div>
                </div>
                <div className={`${styles.tlIcon} ${styles.check}`}>✔</div>
              </div>
              <div className={styles.timelineItem} style={{ borderStyle: 'dashed' }}>
                <div>
                  <div className={styles.tlTitle}>Viêm phế quản</div>
                  <div className={styles.tlSub}>Chưa tiêm gần đây<br/>Dự kiến: Tháng 03/2024</div>
                </div>
                <div className={`${styles.tlIcon} ${styles.wait}`}><ClockCircleOutlined /></div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>💊</span> Đơn Thuốc Gần Đây</h3>
            </div>
            <div className={styles.medList}>
              <div className={styles.medItem}>
                <div className={styles.medIcon}>💊</div>
                <div className={styles.medInfo}>
                  <div className={styles.medName}>Otomax Ointment</div>
                  <div className={styles.medDose}>2 lần/ngày, 7 ngày</div>
                </div>
              </div>
              <div className={styles.medItem}>
                <div className={styles.medIcon}>💊</div>
                <div className={styles.medInfo}>
                  <div className={styles.medName}>Bravecto (10-20kg)</div>
                  <div className={styles.medDose}>1 viên, định kỳ 3 tháng</div>
                </div>
              </div>
            </div>
            <button className={styles.btnLoadMore} style={{ textAlign: 'left', padding: '12px 0 0', marginTop: '12px', borderTop: '1px solid #E0D6C8' }}>
              Chi tiết đơn thuốc cũ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenhAn;
