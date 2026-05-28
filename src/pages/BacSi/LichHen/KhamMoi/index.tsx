import React from 'react';
import { history } from 'umi';
import { ArrowLeftOutlined, CameraOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.module.less';

const KhamMoi: React.FC = () => {
  return (
    <div className={styles.page}>
      <button className={styles.btnBack} onClick={() => history.push('/bac-si/lich-hen')}>
        <ArrowLeftOutlined /> Quay lại hồ sơ bệnh nhân
      </button>

      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Ghi nhận kết quả khám mới</h1>
        <div className={styles.patientBadge}>
          🐾 Bệnh nhân: Luna (Golden Retriever)
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>📋</span> Thông tin chung</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Ngày khám</label>
                <input type="date" className={styles.input} defaultValue="2023-10-27" />
              </div>
              <div className={styles.formGroup}>
                <label>Bác sĩ phụ trách</label>
                <select className={styles.select}>
                  <option>Dr. Julianne Miller</option>
                  <option>Dr. Nguyễn Văn A</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>🩺</span> Chẩn đoán & Điều trị</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.full}`}>
                <label>Chẩn đoán lâm sàng</label>
                <textarea className={styles.textarea} placeholder="Mô tả các triệu chứng và kết quả chẩn đoán..."></textarea>
              </div>
              <div className={`${styles.formGroup} ${styles.full}`}>
                <label>Chi tiết điều trị</label>
                <textarea className={styles.textarea} placeholder="Mô tả các thủ thuật và bước điều trị đã thực hiện..."></textarea>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>📝</span> Đơn thuốc</h3>
              <button className={styles.btnAddMed}><PlusOutlined /> Thêm thuốc mới</button>
            </div>
            <table className={styles.medTable}>
              <thead>
                <tr>
                  <th>Tên thuốc</th>
                  <th>Liều lượng</th>
                  <th>Tần suất</th>
                  <th>Thời gian</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input className={styles.medInput} placeholder="Tên thuốc..." /></td>
                  <td><input className={styles.medInput} placeholder="20mg..." /></td>
                  <td><input className={styles.medInput} placeholder="2 lần/ngày..." /></td>
                  <td><input className={styles.medInput} placeholder="7 ngày..." /></td>
                  <td>
                    <button className={styles.btnDel}><DeleteOutlined /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>💉</span> Tiêm chủng</h3>
            </div>
            <div className={styles.toggleBox}>
              <span>Thực hiện tiêm chủng?</span>
              <Switch />
            </div>
          </div>

          <div className={`${styles.card} ${styles.petCard}`}>
            <div className={styles.petCardTitle}>Luna</div>
            <div className={styles.petInfoRow}>
              <span className={styles.infoLabel}>Loài / Giống</span>
              <span className={styles.infoValue}>Chó / Golden</span>
            </div>
            <div className={styles.petInfoRow}>
              <span className={styles.infoLabel}>Cân nặng</span>
              <span className={styles.infoValue}>28.5 kg</span>
            </div>
            <div className={styles.petInfoRow}>
              <span className={styles.infoLabel}>Tuổi</span>
              <span className={styles.infoValue}>3 năm 2 tháng</span>
            </div>
            <div className={styles.petInfoRow} style={{ marginBottom: 0 }}>
              <span className={styles.infoLabel}>Lần khám cuối</span>
              <span className={styles.infoValue}>15/08/2023</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.uploadCard}`}>
            <CameraOutlined className={styles.uploadIcon} />
            <div className={styles.uploadText}>Đính kèm ảnh lâm sàng</div>
            <div className={styles.uploadSub}>PNG, JPG tối đa 10MB</div>
          </div>
        </div>
      </div>

      <div className={styles.footerActions}>
        <button className={styles.btnCancel} onClick={() => history.push('/bac-si/lich-hen')}>Hủy</button>
        <button className={styles.btnSave} onClick={() => history.push('/bac-si/lich-hen')}><SaveOutlined /> Lưu hồ sơ</button>
      </div>
    </div>
  );
};

export default KhamMoi;
