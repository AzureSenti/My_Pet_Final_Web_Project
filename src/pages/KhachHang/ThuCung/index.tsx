import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message, Empty, Tag, Card, Row, Col } from 'antd';
import { history } from 'umi';
import { Plus, Camera, Heart, ChevronRight, MoreHorizontal, Activity, Upload as UploadIcon, Pencil, Trash2 } from 'lucide-react';
import { Upload, Menu, Dropdown as AntDropdown, Modal as AntModal } from 'antd';
import { getMyPets, createMyPet, Pet, uploadFile, updateMyPet, deleteMyPet } from '@/services/QuanLyPetStore';
import { ip3 } from '@/utils/ip';
import styles from './style.less';

const MyPets: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const data = await getMyPets();
            setPets(data);
        } catch (error) {
            message.error('Không thể tải danh sách thú cưng');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddPet = async (values: any) => {
        const payload = { ...values, avatar_url: imageUrl || '' };
        const success = editingPet
            ? await updateMyPet(editingPet.id, payload)
            : await createMyPet(payload);

        if (success) {
            setIsModalOpen(false);
            setEditingPet(null);
            setImageUrl('');
            form.resetFields();
            fetchData();
        }
    };

    const handleEdit = (pet: Pet) => {
        setEditingPet(pet);
        setImageUrl(pet.avatar_url || '');
        form.setFieldsValue(pet);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        AntModal.confirm({
            title: 'Xác nhận xóa hồ sơ?',
            content: 'Dữ liệu y khoa và lịch trình của bé cũng sẽ bị ảnh hưởng. Bạn chắc chắn chứ?',
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                const res = await deleteMyPet(id);
                if (res) fetchData();
            }
        });
    };

    const handleUpload = async (file: any) => {
        setUploading(true);
        const url = await uploadFile(file);
        if (url) {
            setImageUrl(url);
            message.success('Tải ảnh thành công!');
        }
        setUploading(false);
        return false; // Prevent default upload behavior
    };

    return (
        <div className={styles.saasPetsPage}>
            <header className={styles.pageHeader}>
                <div className={styles.titleInfo}>
                    <h1>Gia đình bốn chân 🐾</h1>
                    <p>Quản lý toàn diện hồ sơ sức khỏe và lịch trình của các bé.</p>
                </div>
                <Button
                    type="primary"
                    className={styles.btnPrimary}
                    icon={<Plus size={18} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm thành viên mới
                </Button>
            </header>

            <div className={styles.layoutBody}>
                <div className={styles.mainContent}>
                    {pets.length > 0 ? (
                        <div className={styles.petList}>
                            {pets.map(pet => (
                                <Card key={pet.id} className={styles.petSaaSCard} bordered={false}>
                                    <div className={styles.cardTop}>
                                        <Tag className={`${styles.typeBadge} ${pet.species.toLowerCase() === 'chó' ? styles.dog : styles.cat}`}>
                                            {pet.species}
                                        </Tag>
                                        <AntDropdown overlay={
                                            <Menu>
                                                <Menu.Item key="edit" onClick={() => handleEdit(pet)} icon={<Pencil size={14} />}>Chỉnh sửa</Menu.Item>
                                                <Menu.Item key="delete" danger onClick={() => handleDelete(pet.id)} icon={<Trash2 size={14} />}>Xoá hồ sơ</Menu.Item>
                                            </Menu>
                                        } trigger={['click']}>
                                            <Button type="text" icon={<MoreHorizontal size={18} />} className={styles.moreBtn} />
                                        </AntDropdown>
                                    </div>

                                    <div className={styles.cardMain}>
                                        <div className={styles.avatarBox}>
                                            <img src={pet.avatar_url ? (pet.avatar_url.startsWith('http') ? pet.avatar_url : `${ip3}${pet.avatar_url.startsWith('/') ? pet.avatar_url.slice(1) : pet.avatar_url}`) : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'} alt={pet.name} />
                                            <div className={styles.genderIcon}>
                                                {pet.gender === 'male' ? '♂' : '♀'}
                                            </div>
                                        </div>
                                        <div className={styles.info}>
                                            <h3>{pet.name}</h3>
                                            <span className={styles.breed}>{pet.breed || 'Chưa xác định'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.cardStats}>
                                        <div className={styles.statItem}>
                                            <Activity size={14} />
                                            <span>Khỏe mạnh</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <Heart size={14} />
                                            <span>2.5kg</span>
                                        </div>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <Button block className={styles.btnAction} onClick={() => history.push(`/khach-hang/benh-an?pet_id=${pet.id}`)}>
                                            Xem bệnh án <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyContainer}>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div className={styles.emptyText}>
                                        <h3>Chưa có hồ sơ thú cưng</h3>
                                        <p>Hãy bắt đầu bằng việc đăng ký bé yêu để chúng tôi có thể đồng hành cùng bạn trong việc chăm sóc sức khỏe.</p>
                                    </div>
                                }
                            >
                                <Button type="primary" className={styles.btnPrimaryPill} onClick={() => setIsModalOpen(true)}>Đăng ký bé ngay</Button>
                            </Empty>
                        </div>
                    )}
                </div>

                <div className={styles.sideContent}>
                    <Card className={styles.benefitCard} bordered={false}>
                        <h3>Lợi ích đăng ký</h3>
                        <ul className={styles.benefitList}>
                            <li>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Theo dõi lịch tiêm phòng định kỳ</span>
                            </li>
                            <li>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Lưu trữ toàn bộ hồ sơ bệnh án</span>
                            </li>
                            <li>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Đặt lịch khám nhanh chóng</span>
                            </li>
                        </ul>
                    </Card>
                    <div className={styles.photoCard}>
                        <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600" alt="Happy Pet" />
                    </div>
                </div>
            </div>

            <Modal
                title={<h3>{editingPet ? 'Cập nhật thông tin bé 🔄' : 'Đăng ký thành viên mới 🐶🐱'}</h3>}
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingPet(null);
                    setImageUrl('');
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                className={styles.saasModal}
                okText="Lưu hồ sơ"
                cancelText="Hủy bỏ"
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddPet}>
                    <Form.Item name="name" label="Tên gọi của bé" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input size="large" placeholder="Ví dụ: Buddy, Lucky..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="species" label="Chủng loài" initialValue="Chó">
                                <Select size="large">
                                    <Select.Option value="Chó">Chó 🐶</Select.Option>
                                    <Select.Option value="Mèo">Mèo 🐱</Select.Option>
                                    <Select.Option value="Khác">Khác 🐾</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gender" label="Giới tính" initialValue="male">
                                <Select size="large">
                                    <Select.Option value="male">Đực (♂)</Select.Option>
                                    <Select.Option value="female">Cái (♀)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="breed" label="Giống loài">
                        <Input size="large" placeholder="Poodle, Golden, Mèo Anh..." />
                    </Form.Item>

                    <Form.Item label="Ảnh đại diện">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className={styles.avatarUploader}
                            showUploadList={false}
                            beforeUpload={handleUpload}
                        >
                            {imageUrl ? (
                                <img src={imageUrl.startsWith('http') ? imageUrl : `${ip3}${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`} alt="avatar" style={{ width: '100%', borderRadius: '8px' }} />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    {uploading ? <Activity className={styles.spin} /> : <Plus />}
                                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyPets;
