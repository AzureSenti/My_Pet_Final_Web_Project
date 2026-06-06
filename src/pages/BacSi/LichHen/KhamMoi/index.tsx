import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { ArrowLeftOutlined, CameraOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Switch, Spin, message } from 'antd';
import { getAppointmentDetail, createMedicalRecord } from '@/services/BacSi/doctorService';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadMultiFile, EFileScope } from '@/services/uploadFile';
import styles from './index.module.less';

interface MedicineRow {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const KhamMoi: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const appointmentId = query.get('id');

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    { id: 1, name: '', dosage: '', frequency: '', duration: '' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId) {
        message.error('Không tìm thấy ID lịch hẹn');
        return;
      }
      try {
        setLoading(true);
        const data = await getAppointmentDetail(appointmentId);
        setAppointment(data);
      } catch (error) {
        console.error('Lỗi khi tải thông tin lịch hẹn:', error);
        message.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  const addMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedicine = (id: number) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const updateMedicine = (id: number, field: keyof MedicineRow, value: string) => {
    setMedicines(medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = async () => {
    if (!appointmentId) return;
    if (!diagnosis.trim()) {
      message.warning('Vui lòng nhập chẩn đoán lâm sàng');
      return;
    }
    if (!treatment.trim()) {
      message.warning('Vui lòng nhập chi tiết điều trị');
      return;
    }

    const prescriptionText = medicines
      .filter((m) => m.name.trim())
      .map((m) => `${m.name} - ${m.dosage} - ${m.frequency} - ${m.duration}`)
      .join('\n');

    try {
      setSubmitting(true);
      
      let finalNotes = notes.trim();
      if (attachments.length > 0) {
        const uploadedUrls = await buildUpLoadMultiFile(
          { attachments: { fileList: attachments } },
          'attachments',
          EFileScope.PUBLIC
        );
        
        if (uploadedUrls && uploadedUrls.length > 0) {
          const validUrls = uploadedUrls.filter(Boolean);
          if (validUrls.length > 0) {
            finalNotes += `\n\n[Ảnh đính kèm]:\n${validUrls.join('\n')}`;
          }
        }
      }

      await createMedicalRecord({
        appointment_id: appointmentId,
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        prescription: prescriptionText || undefined,
        notes: finalNotes || undefined,
      });
      message.success('Đã lưu hồ sơ bệnh án thành công!');
      history.push('/bac-si/lich-hen');
    } catch (error) {
      console.error('Lỗi khi lưu bệnh án:', error);
      message.error('Lỗi khi lưu hồ sơ bệnh án');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const pet = appointment?.pet;
  const owner = appointment?.owner;
  const scheduledDate = appointment ? new Date(appointment.scheduled_at) : new Date();

  return (
    <div className={styles.page}>
      <button className={styles.btnBack} onClick={() => history.push('/bac-si/lich-hen')}>
        <ArrowLeftOutlined /> Quay lại hồ sơ bệnh nhân
      </button>

      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Ghi nhận kết quả khám mới</h1>
        <div className={styles.patientBadge}>
          🐾 Bệnh nhân: {pet?.name} ({pet?.breed || pet?.species})
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
                <input
                  type="date"
                  className={styles.input}
                  defaultValue={scheduledDate.toISOString().split('T')[0]}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label>Dịch vụ</label>
                <input
                  type="text"
                  className={styles.input}
                  value={appointment?.service?.name || '—'}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>🩺</span> Chẩn đoán & Điều trị</h3>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.full}`}>
                <label>Chẩn đoán lâm sàng <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  className={styles.textarea}
                  placeholder="Mô tả các triệu chứng và kết quả chẩn đoán..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.full}`}>
                <label>Chi tiết điều trị <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  className={styles.textarea}
                  placeholder="Mô tả các thủ thuật và bước điều trị đã thực hiện..."
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.full}`}>
                <label>Ghi chú thêm</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Ghi chú bổ sung nếu có..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><span style={{ fontSize: '18px' }}>📝</span> Đơn thuốc</h3>
              <button className={styles.btnAddMed} onClick={addMedicine}>
                <PlusOutlined /> Thêm thuốc mới
              </button>
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
                {medicines.map((med) => (
                  <tr key={med.id}>
                    <td>
                      <input
                        className={styles.medInput}
                        placeholder="Tên thuốc..."
                        value={med.name}
                        onChange={(e) => updateMedicine(med.id, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.medInput}
                        placeholder="20mg..."
                        value={med.dosage}
                        onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.medInput}
                        placeholder="2 lần/ngày..."
                        value={med.frequency}
                        onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.medInput}
                        placeholder="7 ngày..."
                        value={med.duration}
                        onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)}
                      />
                    </td>
                    <td>
                      <button className={styles.btnDel} onClick={() => removeMedicine(med.id)}>
                        <DeleteOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
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
            <div className={styles.petCardTitle}>{pet?.name}</div>
            <div className={styles.petInfoRow}>
              <span className={styles.infoLabel}>Loài / Giống</span>
              <span className={styles.infoValue}>{pet?.species} / {pet?.breed || '—'}</span>
            </div>
            <div className={styles.petInfoRow}>
              <span className={styles.infoLabel}>Giới tính</span>
              <span className={styles.infoValue}>{pet?.gender === 'male' ? 'Đực' : 'Cái'}</span>
            </div>
            <div className={styles.petInfoRow}>
              <span className={styles.infoLabel}>Chủ sở hữu</span>
              <span className={styles.infoValue}>{owner?.full_name}</span>
            </div>
            <div className={styles.petInfoRow} style={{ marginBottom: 0 }}>
              <span className={styles.infoLabel}>Liên hệ</span>
              <span className={styles.infoValue}>{owner?.phone || owner?.email}</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.uploadCard}`}>
            <UploadFile
              fileList={attachments}
              onChange={(val) => setAttachments(val.fileList || [])}
              buttonDescription="Đính kèm ảnh lâm sàng"
              accept="image/png, image/jpeg"
              maxFileSize={10}
              isAvatarSmall={false}
              drag={true}
            />
          </div>
        </div>
      </div>

      <div className={styles.footerActions}>
        <button className={styles.btnCancel} onClick={() => history.push('/bac-si/lich-hen')}>Hủy</button>
        <button className={styles.btnSave} onClick={handleSubmit} disabled={submitting}>
          <SaveOutlined /> {submitting ? 'Đang lưu...' : 'Lưu hồ sơ'}
        </button>
      </div>
    </div>
  );
};

export default KhamMoi;
