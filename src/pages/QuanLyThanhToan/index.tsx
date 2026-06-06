import React, { useState, useEffect } from 'react';
import { Table, Select, message, Button, Modal, Tag, Space, Tooltip } from 'antd';
import {
    Search,
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle2,
    Filter,
    Download,
    Eye,
    Receipt,
    Wallet
} from 'lucide-react';
import HeaderProfile from '@/components/HeaderProfile';
import { getPayments, updatePaymentStatus } from '@/services/QuanLyPetStore';
import './style.less';

const { Option } = Select;

const QuanLyThanhToan: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getPayments({
                status: statusFilter === 'all' ? undefined : statusFilter,
                limit: 100
            });
            setPayments(data.items);
        } catch (error) {
            message.error('Không thể lấy danh sách thanh toán');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusFilter]);

    const handleConfirmPayment = async (id: string) => {
        const success = await updatePaymentStatus(id, 'paid');
        if (success) {
            fetchData();
        }
    };

    const columns = [
        {
            title: 'Mã hóa đơn',
            key: 'id',
            render: (_: any, record: any) => (
                <div className="cell-order-info">
                    <span className="order-id">#{record.id.substring(0, 8).toUpperCase()}</span>
                    <span className="order-date">
                        {new Date(record.created_at || Date.now()).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            )
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_: any, record: any) => (
                <div className="cell-customer">
                    <div className="avatar">
                        {record.owner?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <span className="name">{record.owner?.full_name || 'Khách vãng lai'}</span>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>{record.owner?.phone}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Dịch vụ',
            key: 'service',
            render: (_: any, record: any) => (
                <span>{record.appointment?.service?.name || 'Dịch vụ lẻ'}</span>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <span className="cell-amount">{amount.toLocaleString('vi-VN')} VND</span>
            )
        },
        {
            title: 'Phương thức',
            dataIndex: 'method',
            key: 'method',
            render: (method: string) => (
                <div className="payment-method">
                    {method === 'cash' ? <Wallet size={16} /> : <CreditCard size={16} />}
                    <span>{method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div className={`status-tag ${status}`}>
                    {status === 'pending' ? 'Chờ thanh toán' : status === 'paid' ? 'Đã thu tiền' : 'Đã hoàn'}
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {record.status === 'pending' && (
                        <Tooltip title="Xác nhận đã thu tiền">
                            <button
                                className="btn-confirm"
                                onClick={() => handleConfirmPayment(record.id)}
                            >
                                <CheckCircle2 size={16} />
                            </button>
                        </Tooltip>
                    )}
                    <button
                        className="pm-action-btn"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
                        onClick={() => { setSelectedPayment(record); setIsDetailModalOpen(true); }}
                    >
                        <Eye size={18} />
                    </button>
                </Space>
            )
        }
    ];

    return (
        <div className="payment-management-container petcare-dashboard">
            <div className="pc-header">
                <div className="pc-header-left" />
                <div className="pc-header-center">
                    <div className="pc-header-search">
                        <Search size={18} strokeWidth={1.75} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên khách hoặc mã HĐ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="pc-header-actions">
                    <HeaderProfile />
                </div>
            </div>

            <div className="pm-page-content">
                <div className="pm-header-row">
                    <div className="pm-title-section">
                        <div className="pm-icon-wrapper">
                            <Receipt size={28} />
                        </div>
                        <div>
                            <h1>Quản lý Hóa đơn & Thanh toán</h1>
                            <p>Theo dõi luồng tiền, xác nhận giao dịch và quản lý doanh thu dịch vụ.</p>
                        </div>
                    </div>
                    <Button icon={<Download size={16} />} style={{ borderRadius: '10px', height: '40px', fontWeight: 600 }}>
                        Xuất sao kê
                    </Button>
                </div>

                <div className="pm-filter-bar">
                    <div className="filter-item">
                        <Filter size={16} />
                        <span>Trạng thái:</span>
                        <Select value={statusFilter} onChange={setStatusFilter} bordered={false}>
                            <Option value="all">Tất cả hóa đơn</Option>
                            <Option value="pending">Chờ thanh toán</Option>
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="refunded">Đã hoàn tiền</Option>
                        </Select>
                    </div>
                </div>

                <div className="pm-table-card">
                    <Table
                        columns={columns}
                        dataSource={payments.filter(p =>
                            p.owner?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.id.includes(searchQuery)
                        )}
                        loading={loading}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>

            <Modal
                title={<h3>Chi tiết hóa đơn ✨</h3>}
                visible={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>,
                    selectedPayment?.status === 'pending' && (
                        <Button key="pay" type="primary" onClick={() => { handleConfirmPayment(selectedPayment.id); setIsDetailModalOpen(false); }}>
                            Xác nhận thanh toán ngay
                        </Button>
                    )
                ]}
                width={500}
            >
                {selectedPayment && (
                    <div className="payment-detail-content">
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ color: '#6B7280', fontSize: '13px' }}>SỐ TIỀN THANH TOÁN</div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>
                                {selectedPayment.amount.toLocaleString('vi-VN')} VND
                            </div>
                            <Tag color={selectedPayment.status === 'paid' ? 'green' : 'orange'} style={{ marginTop: '8px', borderRadius: '12px' }}>
                                {selectedPayment.status === 'paid' ? 'GIAO DỊCH THÀNH CÔNG' : 'ĐANG CHỜ THANH TOÁN'}
                            </Tag>
                        </div>

                        <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#6B7280' }}>Khách hàng</span>
                                <span style={{ fontWeight: 600 }}>{selectedPayment.owner?.full_name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#6B7280' }}>Dịch vụ</span>
                                <span style={{ fontWeight: 600 }}>{selectedPayment.appointment?.service?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#6B7280' }}>Thú cưng</span>
                                <span style={{ fontWeight: 600 }}>{selectedPayment.appointment?.pet?.name}</span>
                            </div>
                            <div style={{ borderTop: '1px dashed #D1D5DB', margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#6B7280' }}>Phương thức</span>
                                <span style={{ fontWeight: 600 }}>{selectedPayment.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6B7280' }}>Ngày tạo</span>
                                <span style={{ fontWeight: 600 }}>{new Date(selectedPayment.created_at).toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default QuanLyThanhToan;
