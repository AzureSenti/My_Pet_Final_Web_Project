import { User, Mail, Lock } from 'lucide-react';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';

const RegisterForm: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.UMI_APP_API_URL || 'http://localhost:8001'}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: values.username,
                    email: values.email,
                    password: values.password,
                    role: 'owner'
                })
            });

            if (response.ok) {
                message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                history.push('/user/login');
            } else {
                const err = await response.json();
                message.error(err.detail || 'Đăng ký thất bại!');
            }
        } catch (error) {
            message.error('Lỗi kết nối máy chủ!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
                <Input
                    prefix={<User size={18} style={{ opacity: 0.5, marginRight: 8 }} />}
                    placeholder="Họ và tên"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
            >
                <Input
                    prefix={<Mail size={18} style={{ opacity: 0.5, marginRight: 8 }} />}
                    placeholder="Email"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password
                    prefix={<Lock size={18} style={{ opacity: 0.5, marginRight: 8 }} />}
                    placeholder="Mật khẩu"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<Lock size={18} style={{ opacity: 0.5, marginRight: 8 }} />}
                    placeholder="Xác nhận mật khẩu"
                    size="large"
                />
            </Form.Item>

            <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
                Tạo tài khoản ngay
            </Button>
        </Form>
    );
};

export default RegisterForm;
