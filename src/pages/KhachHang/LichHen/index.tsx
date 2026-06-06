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
                    <h1>Lịch trình y khoa</h1>
                    <p>Quản lý và theo dõi các cuộc hẹn thăm khám sắp tới.</p>
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
                    {[
                        {
                            id: 1,
                            petName: 'Mimi',
                            petType: 'Mèo',
                            service: 'Khám định kỳ',
                            desc: 'Kiểm tra tổng quát',
                            owner: 'Nguyễn Văn An',
                            phone: '090xxxx123',
                            time: '14:30',
                            dateStr: 'Hôm nay, 24 Th05',
                            status: 'Đã xác nhận',
                            img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop'
                        },
                        {
                            id: 2,
                            petName: 'Lucky',
                            petType: 'Chó',
                            service: 'Tiêm chủng',
                            desc: 'Nhắc lịch tiêm 5 bệnh',
                            owner: 'Trần Thị Mai',
                            phone: '091xxxx456',
                            time: '09:00',
                            dateStr: 'Ngày mai, 25 Th05',
                            status: 'Đang chờ',
                            img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop'
                        }
                    ].map(app => (
                        <div key={app.id} className={styles.horizontalCard}>
                            <div className={styles.cardLeft}>
                                <div className={styles.avatarWrap}>
                                    <img src={app.img} alt={app.petName} />
                                </div>
                                <div className={styles.infoContent}>
                                    <div className={styles.tagsRow}>
                                        <span className={styles.tagMint}>{app.service}</span>
                                        <span className={styles.tagYellow}>{app.petType}</span>
                                    </div>
                                    <h3 className={styles.mainTitle}>{app.petName} - {app.desc}</h3>
                                    <p className={styles.subText}>Chủ nuôi: {app.owner} • {app.phone}</p>
                                </div>
                            </div>
                            <div className={styles.cardRight}>
                                <div className={styles.timeWrap}>
                                    <span className={styles.timeTxt}>{app.time}</span>
                                    <span className={styles.dateTxt}>{app.dateStr}</span>
                                </div>
                                {app.status === 'Đã xác nhận' ? (
                                    <div className={`${styles.statusBadge} ${styles.confirmed}`}>
                                        <div className={styles.iconCircle}>✓</div> Đã xác nhận
                                    </div>
                                ) : (
                                    <div className={`${styles.statusBadge} ${styles.pending}`}>
                                        <div className={styles.iconCircle}>🕒</div> Đang chờ
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.infoBox}>
                        <div className={styles.boxHeader}>
                            <h3 className={styles.boxTitle}>Hỗ trợ & Thông tin</h3>
                            <p className={styles.boxSub}>Chúng tôi luôn sẵn sàng giúp đỡ</p>
                        </div>
                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <div className={styles.iconPin}>📍</div>
                                <div>
                                    <strong>Trung tâm MyPet 4.0</strong>
                                    <span>Tòa nhà Diamond, 123 Nguyễn Trãi, Hà Nội</span>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.iconPhone}>📞</div>
                                <div>
                                    <strong>Hotline 1900 8888</strong>
                                    <span>Hoạt động 24/7 cho các ca cấp cứu</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <h3 className={styles.boxTitle}><span className={styles.checkIcon}>✅</span> Lưu ý chuẩn bị</h3>
                        <ul className={styles.checkList}>
                            <li>Mang theo sổ tiêm phòng của thú cưng.</li>
                            <li>Nhịn ăn ít nhất 6 tiếng nếu có chỉ định xét nghiệm máu.</li>
                            <li>Đến trước giờ hẹn 10 phút để làm thủ tục.</li>
                            <li>Sử dụng lồng vận chuyển hoặc dây xích an toàn.</li>
                        </ul>
                    </div>

                    <div className={styles.promoBanner}>
                        <h3>Gói Spa Toàn Diện</h3>
                        <p>Giảm ngay 20% khi đặt lịch cùng khám sức khỏe.</p>
                        <Button className={styles.btnBanner}>Tìm hiểu thêm</Button>
                    </div>
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
