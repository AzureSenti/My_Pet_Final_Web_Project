import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar, Button, Card, Tag, Timeline, Empty, message, Input, Select, Modal, Form } from 'antd';
import {
    ClipboardList,
    Search,
    Activity,
    Stethoscope,
    FileText,
    Calendar,
    HeartPulse,
    MessageCircle
} from 'lucide-react';
import { getMyMedicalRecords, Pet, getMyPets } from '@/services/QuanLyPetStore';
import styles from './style.less';

const UserHoSoBenhAn: React.FC = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<string | null>(null);
    const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const [recordsData, petsData] = await Promise.all([
                getMyMedicalRecords(),
                getMyPets()
            ]);
            setRecords(recordsData);
            setPets(petsData);
        } catch (error) {
            message.error('Không thể tải hồ sơ bệnh án');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRecords = selectedPet
        ? records.filter(r => r.pet_id === selectedPet)
        : records;

    return (
        <div className={styles.hoSoPage}>
            <header className={styles.pageHeader}>
                <div className={styles.titleArea}>
                    <h1>Hộ chiếu sức khỏe 🏥</h1>
                    <p>Lịch sử y khoa và chẩn đoán chi tiết từ các chuyên gia.</p>
                </div>
                <div className={styles.filterArea}>
                    <Select
                        placeholder="Chọn thú cưng"
                        allowClear
                        style={{ width: 220 }}
                        className={styles.petSelect}
                        onChange={setSelectedPet}
                        size="large"
                    >
                        {pets.map(pet => (
                            <Select.Option key={pet.id} value={pet.id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Avatar size="small" src={pet.avatar_url} /> {pet.name}
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="Tìm kiếm chẩn đoán..."
                        prefix={<Search size={18} />}
                        className={styles.searchBar}
                        size="large"
                    />
                </div>
            </header>

            <Row gutter={[24, 24]}>
                <Col xs={{ span: 24, order: 2 }} lg={{ span: 16, order: 1 }}>
                    <div className={styles.recordList}>
                        {filteredRecords.length > 0 ? (
                            <>
                                {filteredRecords.map(record => (
                                    <div key={record.id} className={styles.recordCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.dateInfo}>
                                                <Calendar size={14} />
                                                <span>{new Date(record.recorded_at).toLocaleDateString('vi-VN')} - {new Date(record.recorded_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={styles.diagBadge}>Khám định kỳ</div>
                                        </div>
                                        <h3 className={styles.diagnosisTitle}>{record.diagnosis}</h3>
                                        <div className={styles.doctorInfo}>
                                            <Stethoscope size={14} />
                                            <span>BS. {record.vet?.user?.full_name || 'Hệ thống'}</span>
                                        </div>
                                        <div className={styles.treatmentBox}>
                                            <div className={styles.treatmentLabel}>
                                                <FileText size={14} />
                                                <strong>Điều trị:</strong>
                                            </div>
                                            <p className={styles.treatmentText}>{record.treatment}</p>
                                        </div>
                                        {record.notes && (
                                            <div className={styles.notesBox}>
                                                {record.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className={styles.loadMoreWrap}>
                                    <Button type="text" className={styles.btnLoadMore}>Tải thêm lịch sử...</Button>
                                </div>
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <Empty
                                    image={<ClipboardList size={48} style={{ color: '#d1c7bd' }} />}
                                    description="Chưa có dữ liệu y khoa nào được ghi nhận."
                                />
                            </div>
                        )}
                    </div>
                </Col>

                <Col xs={{ span: 24, order: 1 }} lg={{ span: 8, order: 2 }}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <HeartPulse size={20} color="#c8960c" />
                            <h3>Chỉ số tổng quát</h3>
                        </div>
                        <div className={styles.metricList}>
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Số lần thăm khám</span>
                                <span className={styles.metricValue}>{filteredRecords.length}</span>
                            </div>
                            <div className={styles.metricSeparator} />
                            <div className={styles.metricItem}>
                                <span className={styles.metricLabel}>Lần cuối khám</span>
                                <span className={styles.metricValue}>{filteredRecords[0] ? new Date(filteredRecords[0].recorded_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                            </div>
                        </div>
                        <div className={styles.ctaBox}>
                            <p>Cần tư vấn thêm về kết quả chẩn đoán?</p>
                            <Button block className={styles.btnChat} onClick={() => setIsConsultModalOpen(true)}>
                                <MessageCircle size={16} style={{ marginRight: 6 }} />
                                Trò chuyện với bác sĩ
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Modal
                title={<h3>Gửi yêu cầu tư vấn 🩺</h3>}
                visible={isConsultModalOpen}
                onCancel={() => setIsConsultModalOpen(false)}
                onOk={() => form.submit()}
                className={styles.saasModal}
                okText="Gửi yêu cầu"
                cancelText="Hủy bỏ"
                destroyOnClose
            >
                <div style={{ marginBottom: 24 }}>
                    <p style={{ color: '#7A6B5D', fontSize: 15 }}>
                        Vui lòng nhập câu hỏi hoặc thắc mắc của bạn về bệnh án. Bác sĩ phụ trách sẽ xem xét và phản hồi cho bạn qua Số điện thoại hoặc Email trong thời gian sớm nhất.
                    </p>
                </div>
                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={() => {
                        setIsConsultModalOpen(false);
                        form.resetFields();
                        message.success('Yêu cầu tư vấn đã được gửi thành công! Bác sĩ sẽ sớm liên hệ với bạn.');
                    }}
                >
                    <Form.Item 
                        name="question" 
                        label="Câu hỏi của bạn" 
                        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                    >
                        <Input.TextArea 
                            rows={4} 
                            placeholder="Ví dụ: Bác sĩ cho em hỏi thức ăn nào tốt cho bé sau khi mổ ạ?" 
                            size="large"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserHoSoBenhAn;
