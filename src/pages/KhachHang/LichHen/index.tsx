import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, DatePicker, Select, Input, message, Avatar, Tag, Card } from 'antd';
import {
    MapPin,
    User,
    ChevronRight,
    Plus,
    Stethoscope,
    AlertCircle
} from 'lucide-react';
import {
    getMyAppointments,
    bookAppointment,
    getMyPets,
    getOwnerVets,
    getOwnerServices,
    Pet,
    Service
} from '@/services/QuanLyPetStore';
import styles from './style.less';

const MyAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const [appData, petData, docData, svcData] = await Promise.all([
                getMyAppointments(),
                getMyPets(),
                getOwnerVets(),
                getOwnerServices(),
            ]);
            setAppointments(appData);
            setPets(petData);
            setDoctors(docData);
            setServices(svcData);
        } catch (error) {
            message.error('Không thể tải dữ liệu lịch hẹn');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBook = async (values: any) => {
        const success = await bookAppointment({
            ...values,
            scheduled_at: values.scheduled_at.toISOString(),
            status: 'pending'
        });
        if (success) {
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        }
    };

    return (
        <div className={styles.saasAppointmentsPage}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>Lịch trình y khoa 🏥</h1>
                    <p>Điều phối và quản lý toàn bộ quá trình thăm khám tại MyPet.</p>
                </div>
                <Button
                    type="primary"
                    className={styles.btnPrimary}
                    icon={<Plus size={18} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Đặt lịch thăm khám
                </Button>
            </header>

            <div className={styles.layoutBody}>
                <div className={styles.timelineSection}>
                    <div className={styles.timelineHeader}>
                        <h3>Lịch trình sắp diễn ra</h3>
                    </div>

                    {appointments.filter(a => a.status !== 'cancelled').map(app => (
                        <Card key={app.id} className={styles.appCardSaaS} bordered={false}>
                            <div className={styles.timeLabel}>
                                <div className={styles.day}>{new Date(app.scheduled_at).getDate()}</div>
                                <div className={styles.month}>Th{new Date(app.scheduled_at).getMonth() + 1}</div>
                                <div className={styles.exactTime}>{new Date(app.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>

                            <div className={styles.cardInfo}>
                                <div className={styles.badgeRow}>
                                    <Tag className={`${styles.statusBadge} ${app.status === 'confirmed' ? styles.confirmed : styles.pending}`}>
                                        {app.status === 'confirmed' ? 'Đã xác nhận' : 'Đang xử lý'}
                                    </Tag>
                                    <span className={styles.svcName}><Stethoscope size={14} /> {app.service?.name}</span>
                                </div>

                                <div className={styles.mainTitle}>
                                    Khám định kỳ cho <strong>{app.pet?.name}</strong>
                                </div>

                                <div className={styles.doctorInfo}>
                                    <Avatar size="small" src={`https://i.pravatar.cc/150?u=${app.vet?.user?.id}`} />
                                    <span>BS. <strong>{app.vet?.user?.full_name || 'Đang điều phối'}</strong></span>
                                </div>
                            </div>

                            <Button icon={<ChevronRight size={18} />} className={styles.btnArrow} />
                        </Card>
                    ))}

                    {appointments.length === 0 && (
                        <div className={styles.emptyCard}>
                            <AlertCircle size={32} />
                            <p>Lịch trình của bạn đang trống.</p>
                            <Button type="link" onClick={() => setIsModalOpen(true)}>Khởi tạo lịch khám ngay</Button>
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <Card className={styles.clinicDetails} bordered={false}>
                        <h3>Hỗ trợ & Thông tin</h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}><MapPin size={18} /></div>
                                <div className={styles.text}>
                                    <strong>Trung tâm MyPet 4.0</strong>
                                    <p>Tòa nhà Diamond, 123 Nguyễn Trãi, Hà Nội</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}><User size={18} /></div>
                                <div className={styles.text}>
                                    <strong>Tổng đài hỗ trợ</strong>
                                    <p>1900 8888 (24/7)</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.reminderBox}>
                            <h4>Lưu ý chuẩn bị</h4>
                            <ul>
                                <li>Mang theo sổ khám bệnh cũ</li>
                                <li>Nhịn ăn 6h nếu cần xét nghiệm máu</li>
                                <li>Đến trước 10 phút để làm thủ tục</li>
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                title={<h3>Đặt lịch thăm khám mới 🏥</h3>}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                className={styles.saasModal}
                okText="Xác nhận lịch hẹn"
                cancelText="Để sau"
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleBook}>
                    <Form.Item name="pet_id" label="Bé yêu thăm khám" rules={[{ required: true }]}>
                        <Select size="large">
                            {pets.map(pet => (
                                <Select.Option key={pet.id} value={pet.id}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Avatar size="small" src={pet.avatar_url} /> {pet.name}
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="service_id" label="Dịch vụ yêu cầu" rules={[{ required: true }]}>
                        <Select size="large">
                            {services.map(svc => (
                                <Select.Option key={svc.id} value={svc.id}>{svc.name} — {svc.price.toLocaleString()}đ</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="vet_id" label="Bác sĩ phụ trách" rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}>
                        <Select size="large" placeholder="Chọn bác sĩ thú y">
                            {doctors.map((doc: any) => (
                                <Select.Option key={doc.vet_id} value={doc.vet_id}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Avatar size="small" src={`https://i.pravatar.cc/150?u=${doc.id}`} />
                                        BS. {doc.full_name} — {doc.specialization}
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="scheduled_at" label="Thời gian mong muốn" rules={[{ required: true }]}>
                        <DatePicker
                            showTime
                            size="large"
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item name="notes" label="Ghi chú bệnh lý (nếu có)">
                        <Input.TextArea rows={4} placeholder="Ví dụ: Bé đang có triệu chứng biếng ăn, nôn mửa..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyAppointments;
