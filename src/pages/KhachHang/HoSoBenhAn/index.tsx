import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar, Button, Card, Tag, Timeline, Empty, message, Input, Select,} from 'antd';
import {
    ClipboardList,
    Search,
    Activity,
    Stethoscope,
    FileText,
    Calendar,
    HeartPulse
} from 'lucide-react';
import { getMyMedicalRecords, Pet, getMyPets } from '@/services/QuanLyPetStore';
import { history } from 'umi';
import styles from './style.less';

const UserHoSoBenhAn: React.FC = () => {
    const [records, setRecords] = useState<any[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<string | null>(null);


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

            <Row gutter={32}>
                <Col xs={24} lg={16}>
                    <div className={styles.timelineContainer}>
                        {filteredRecords.length > 0 ? (
                            <Timeline mode="left" className={styles.medicalTimeline}>
                                {filteredRecords.map(record => (
                                    <Timeline.Item
                                        key={record.id}
                                        label={<span className={styles.timeLabel}>{new Date(record.recorded_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>}
                                        dot={<div className={styles.activeDot} />}
                                    >
                                        <Card className={styles.recordCard} bordered={false}>
                                            <div className={styles.cardTop}>
                                                <div className={styles.dateInfo}>
                                                    <Calendar size={14} />
                                                    {new Date(record.recorded_at).toLocaleDateString('vi-VN')}
                                                </div>
                                                <Tag color="#D4A017" className={styles.diagTag}>CHẨN ĐOÁN</Tag>
                                            </div>
                                            <h3>{record.diagnosis}</h3>
                                            <div className={styles.doctorInfo}>
                                                <Stethoscope size={16} />
                                                <span>BS. <strong>{record.vet?.user?.full_name || 'Hệ thống'}</strong></span>
                                            </div>
                                            <div className={styles.treatment}>
                                                <FileText size={16} />
                                                <p><strong>Điều trị:</strong> {record.treatment}</p>
                                            </div>
                                            {record.notes && (
                                                <div className={styles.notes}>
                                                    <p>{record.notes}</p>
                                                </div>
                                            )}
                                        </Card>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <div className={styles.emptyState}>
                                <Empty
                                    image={<ClipboardList size={64} style={{ color: '#DBDAD9' }} />}
                                    description="Chưa có dữ liệu y khoa nào được ghi nhận."
                                />
                            </div>
                        )}
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className={styles.summaryCard} bordered={false}>
                        <div className={styles.summaryHeader}>
                            <HeartPulse size={24} color="#D4A017" />
                            <h3>Chỉ số tổng quát</h3>
                        </div>
                        <div className={styles.metricList}>
                            <div className={styles.metric}>
                                <span>Số lần thăm khám</span>
                                <strong>{filteredRecords.length}</strong>
                            </div>
                            <div className={styles.metric}>
                                <span>Lần cuối khám</span>
                                <strong>{filteredRecords[0] ? new Date(filteredRecords[0].recorded_at).toLocaleDateString('vi-VN') : 'N/A'}</strong>
                            </div>
                        </div>
                        <div className={styles.actionBox}>
                            <p>Cần tư vấn thêm về kết quả chẩn đoán?</p>
                            <Button block className={styles.btnChat} onClick={() => history.push(`/khach-hang/tu-van`)}>Trò chuyện với bác sĩ</Button>
                        </div>
                    </Card>

                    <div className={styles.infoBox} style={{ marginTop: 24 }}>
                        <h4><Activity size={18} /> Lưu ý sức khỏe</h4>
                        <p>Theo dõi sát sao cân nặng và chế độ dinh dưỡng sau khi điều trị.</p>z
                    </div>
                </Col>
            </Row>

        </div>
    );
};

export default UserHoSoBenhAn;
