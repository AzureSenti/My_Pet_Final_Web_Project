import React from 'react';
import { history, Link } from 'umi';
import { 
  ArrowLeftOutlined, EditOutlined, DownOutlined,
  BoldOutlined, ItalicOutlined, UnorderedListOutlined,
  PaperClipOutlined, PictureOutlined, LinkOutlined,
  SendOutlined, MedicineBoxOutlined, FileSearchOutlined
} from '@ant-design/icons';
import styles from './index.module.less';

const PhanHoi: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/bac-si/tu-van">Tư vấn trực tuyến</Link> {'>'} Phản hồi tư vấn
      </div>
      
      <div className={styles.pageHeader}>
        <button className={styles.btnBack} onClick={() => history.push('/bac-si/tu-van')}>
          <ArrowLeftOutlined />
        </button>
        <h1 className={styles.title}>Phản hồi tư vấn #CV-8821</h1>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column: Question & History */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.patientHeader}>
              <div className={styles.patientInfo}>
                <div className={styles.petIcon}>🐾</div>
                <div>
                  <div className={styles.petName}>Mèo Luna</div>
                  <div className={styles.ownerName}>Chủ nuôi: Nguyễn Thu Hà</div>
                </div>
              </div>
              <div className={styles.tagNew}>MỚI</div>
            </div>

            <div className={styles.timeInfo}>
              🕒 Gửi lúc: 09:45, 24 Tháng 10, 2023
            </div>

            <div className={styles.quoteBox}>
              "Mèo Luna của em hay gãi tai, tai có mùi hôi và thỉnh thoảng có dịch màu nâu đen chảy ra. Em thấy bé tỏ vẻ khó chịu mỗi khi em chạm vào vùng tai. Em nên làm gì và có cần đưa bé đến phòng khám ngay không ạ?"
            </div>

            <div className={styles.imagesSection}>
              <div className={styles.sectionTitle}>HÌNH ẢNH ĐÍNH KÈM (2)</div>
              <div className={styles.imageGrid}>
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=luna1" alt="Tai mèo 1" style={{ background: '#f0f0f0' }} />
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=luna2" alt="Tai mèo 2" style={{ background: '#f0f0f0' }} />
              </div>
            </div>
          </div>

          <div className={styles.historyCard}>
            <div className={styles.historyHeader}>
              <div className={styles.title}>TIỀN SỬ BỆNH ÁN</div>
              <Link to="/bac-si/lich-hen/benh-an" className={styles.link}>Xem tất cả</Link>
            </div>
            
            <div className={styles.historyItem}>
              <MedicineBoxOutlined className={styles.hIcon} />
              <div className={styles.hInfo}>
                <div className={styles.hName}>Tiêm phòng đại định kỳ</div>
                <div className={styles.hDate}>12/05/2023</div>
              </div>
            </div>
            
            <div className={styles.historyItem}>
              <FileSearchOutlined className={styles.hIcon} />
              <div className={styles.hInfo}>
                <div className={styles.hName}>Khám da liễu nhẹ</div>
                <div className={styles.hDate}>20/01/2023</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <h3>
              <div className={styles.icon}><EditOutlined /></div>
              Soạn thảo phản hồi
            </h3>
            <button className={styles.btnTemplate}>
              Mẫu trả lời nhanh <DownOutlined style={{ fontSize: '10px' }} />
            </button>
          </div>

          <div className={styles.editorArea}>
            <div className={styles.toolbar}>
              <button><BoldOutlined /></button>
              <button><ItalicOutlined /></button>
              <button><UnorderedListOutlined /></button>
              <button><PaperClipOutlined /></button>
              <button><PictureOutlined /></button>
              <button><LinkOutlined /></button>
            </div>
            <textarea 
              className={styles.textarea} 
              placeholder="Nhập nội dung tư vấn chuyên môn tại đây..."
            ></textarea>
          </div>

          <div className={styles.editorFooter}>
            <div className={styles.autoSave}>Tự động lưu bản nháp lúc 10:15</div>
            <div className={styles.actions}>
              <button className={styles.btnDraft}>Lưu bản nháp</button>
              <button 
                className={styles.btnSend}
                onClick={() => history.push('/bac-si/tu-van')}
              >
                <SendOutlined /> Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhanHoi;
