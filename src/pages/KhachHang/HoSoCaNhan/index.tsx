import React from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, CameraOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ip3 } from '@/utils/ip';
import styles from './style.less';

const HoSoCaNhan: React.FC = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const currentUser = initialState?.currentUser as any;

    const [form] = Form.useForm();

    const rawAvatar = currentUser?.avatar_url || currentUser?.picture || '';
    const avatarUrl = rawAvatar
        ? rawAvatar.startsWith('http')
            ? rawAvatar
            : `${ip3}${rawAvatar.replace(/^\//, '')}`
        : 'https://i.pravatar.cc/150?img=12';

    const handleSave = (values: any) => {
        // Mock save logic
        message.success('Cập nhật hồ sơ thành công!');
        setInitialState({
            ...initialState,
            currentUser: {
                ...currentUser,
                ...values,
                full_name: values.name
            }
        });
    };

    return (
        <div className={styles.profilePage}>
            <div className={styles.headerArea}>
                <h1>Hồ sơ của tôi 👤</h1>
                <p>Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.</p>
            </div>

            <Row gutter={32}>
                <Col xs={24} md={8}>
                    <div className={styles.avatarCard}>
                        <div className={styles.avatarWrapper}>
                            <Avatar src={avatarUrl} size={160} icon={<UserOutlined />} />
                            <div className={styles.uploadBtn}>
                                <CameraOutlined />
                            </div>
                        </div>
                        <h2>{currentUser?.full_name || currentUser?.name || 'Người dùng'}</h2>
                        <span className={styles.roleTag}>Thành viên PetCare</span>
                    </div>
                </Col>

                <Col xs={24} md={16}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                name: currentUser?.full_name || currentUser?.name,
                                email: currentUser?.email,
                                phone: currentUser?.phone || 'Chưa cập nhật'
                            }}
                            onFinish={handleSave}
                        >
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label="Họ và Tên" name="name">
                                        <Input prefix={<UserOutlined />} size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Email" name="email">
                                        <Input prefix={<MailOutlined />} size="large" disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Số điện thoại" name="phone">
                                        <Input prefix={<PhoneOutlined />} size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <h3 className={styles.sectionTitle} style={{ marginTop: 24 }}>Bảo mật</h3>
                            <div className={styles.securityBox}>
                                <div>
                                    <h4><SafetyCertificateOutlined /> Mật khẩu</h4>
                                    <p>Thay đổi mật khẩu để bảo mật tài khoản tốt hơn.</p>
                                </div>
                                <Button className={styles.btnOutline}>Đổi mật khẩu</Button>
                            </div>

                            <div className={styles.actionRow}>
                                <Button type="primary" htmlType="submit" className={styles.btnSave} size="large">
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HoSoCaNhan;
