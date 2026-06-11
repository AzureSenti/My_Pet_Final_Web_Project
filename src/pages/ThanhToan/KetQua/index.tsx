import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Card } from 'antd';
import { history, useLocation } from 'umi';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const KetQuaThanhToan: React.FC = () => {
    const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
    const [message, setMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const responseCode = queryParams.get('vnp_ResponseCode');

        if (responseCode === '00') {
            setStatus('success');
            setMessage('Giao dịch của bạn đã được thực hiện thành công.');
        } else {
            setStatus('error');
            setMessage('Giao dịch không thành công hoặc đã bị hủy.');
        }
    }, [location]);

    if (status === 'loading') {
        return (
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
                <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f0f2f5',
            padding: '50px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Card style={{ maxWidth: 600, width: '100%', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {status === 'success' ? (
                    <Result
                        status="success"
                        title="Thanh toán thành công"
                        subTitle={message}
                        extra={[
                            <Button type="primary" key="home" onClick={() => history.push('/')} size="large" style={{ borderRadius: 8 }}>
                                Về trang chủ
                            </Button>,
                            <Button key="dashboard" onClick={() => history.push('/khach-hang/dashboard')} size="large" style={{ borderRadius: 8 }}>
                                Xem lịch hẹn
                            </Button>
                        ]}
                    />
                ) : (
                    <Result
                        status="error"
                        title="Thanh toán thất bại"
                        subTitle={message}
                        extra={[
                            <Button type="primary" key="retry" onClick={() => history.push('/khach-hang/dashboard')} size="large" style={{ borderRadius: 8 }}>
                                Thử lại
                            </Button>,
                            <Button key="home" onClick={() => history.push('/')} size="large" style={{ borderRadius: 8 }}>
                                Về trang chủ
                            </Button>
                        ]}
                    />
                )}
            </Card>
        </div>
    );
};

export default KetQuaThanhToan;
