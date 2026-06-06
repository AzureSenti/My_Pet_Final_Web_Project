import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, InputNumber, Switch, message, Popconfirm } from 'antd';
import {
    Search,
    Plus,
    Zap,
    Settings,
    Activity,
    Clock,
    DollarSign,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import HeaderProfile from '@/components/HeaderProfile';
import {
    getServices,
    createService,
    updateService,
    deleteService,
    Service
} from '@/services/QuanLyPetStore';
import './style.less';

const ServiceManagement: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [form] = Form.useForm();
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            message.error('Không thể tải danh sách dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setEditingService(service);
            form.setFieldsValue(service);
        } else {
            setEditingService(null);
            form.resetFields();
            form.setFieldsValue({ is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: any) => {
        if (editingService) {
            const success = await updateService(editingService.id, values);
            if (success) {
                setIsModalOpen(false);
                fetchData();
            }
        } else {
            const success = await createService(values);
            if (success) {
                setIsModalOpen(false);
                fetchData();
            }
        }
    };

    const handleDelete = async (id: string) => {
        const success = await deleteService(id);
        if (success) {
            fetchData();
        }
    };

    const columns = [
        {
            title: 'Dịch vụ',
            key: 'service',
            render: (_: any, record: Service) => (
                <div className="cell-service-info">
                    <div className="icon-wrapper">
                        <Activity size={20} />
                    </div>
                    <div className="name-box">
                        <span className="name">{record.name}</span>
                        <span className="desc">{record.description || 'Không có mô tả'}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Giá dịch vụ',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (
                <span className="cell-price">
                    {price.toLocaleString('vi-VN')} VND
                </span>
            )
        },
        {
            title: 'Thời lượng',
            dataIndex: 'duration_minutes',
            key: 'duration',
            render: (minutes: number) => (
                <div className="cell-duration">
                    <Clock size={16} />
                    <span>{minutes} phút</span>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            key: 'status',
            render: (active: boolean) => (
                <div className={`cell-status ${active ? 'active' : 'inactive'}`}>
                    {active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <span>{active ? 'Hoạt động' : 'Tạm ngưng'}</span>
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_: any, record: Service) => (
                <div className="cell-actions">
                    <button className="action-btn" onClick={() => handleOpenModal(record)}>
                        <Edit2 size={16} />
                    </button>
                    <Popconfirm
                        title="Xoá dịch vụ này? Hành động này không thể hoàn tác."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <button className="action-btn delete">
                            <Trash2 size={16} />
                        </button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="service-management-container petcare-dashboard">
            {/* Top Bar */}
            <div className="pc-header">
                <div className="pc-header-left" />
                <div className="pc-header-center">
                    <div className="pc-header-search">
                        <Search size={18} strokeWidth={1.75} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="pc-header-actions">
                    <HeaderProfile />
                </div>
            </div>

            <div className="sm-page-content">
                {/* Page Header */}
                <div className="sm-header-row">
                    <div className="sm-title-left">
                        <div className="sm-title-icon">
                            <Settings size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1>Quản lý dịch vụ</h1>
                            <p className="sm-subtitle">
                                Thiết lập danh mục dịch vụ khám chữa bệnh, spa và bảng giá dành cho phòng khám.
                            </p>
                        </div>
                    </div>
                    <div className="sm-header-actions">
                        <button className="sm-add-btn" onClick={() => handleOpenModal()}>
                            <Plus size={18} strokeWidth={2.5} /> Thêm dịch vụ mới
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="sm-metrics-grid">
                    <div className="sm-metric-card blue">
                        <div className="icon-box"><Zap size={24} /></div>
                        <div className="content">
                            <div className="label">Tổng dịch vụ</div>
                            <div className="value">{services.length}</div>
                        </div>
                    </div>
                    <div className="sm-metric-card green">
                        <div className="icon-box"><CheckCircle2 size={24} /></div>
                        <div className="content">
                            <div className="label">Đang hoạt động</div>
                            <div className="value">{services.filter(s => s.is_active).length}</div>
                        </div>
                    </div>
                    <div className="sm-metric-card yellow">
                        <div className="icon-box"><DollarSign size={24} /></div>
                        <div className="content">
                            <div className="label">Giá trung bình</div>
                            <div className="value">
                                {services.length > 0
                                    ? Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length).toLocaleString('vi-VN')
                                    : 0} VND
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="sm-table-container">
                    <Table
                        columns={columns}
                        dataSource={filteredServices}
                        pagination={false}
                        rowKey="id"
                        loading={loading}
                    />
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                title={<h3>{editingService ? 'Chỉnh sửa dịch vụ 🛠️' : 'Thêm dịch vụ mới ✨'}</h3>}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Lưu thông tin"
                cancelText="Hủy"
                destroyOnClose
                width={560}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ is_active: true, duration_minutes: 30 }}
                >
                    <Form.Item
                        name="name"
                        label="Tên dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                    >
                        <Input prefix={<Zap size={16} color="#A3865A" />} placeholder="Ví dụ: Tiêm phòng vắc-xin 5 bệnh" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả chi tiết"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Mô tả ngắn gọn về dịch vụ và các bước thực hiện..."
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            name="price"
                            label="Đơn giá (VND)"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: any) => value?.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                                step={10000}
                                placeholder="0"
                            />
                        </Form.Item>
                        <Form.Item
                            name="duration_minutes"
                            label="Thời lượng (Phút)"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={5}
                                step={5}
                                placeholder="30"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="is_active"
                        label="Trạng thái hoạt động"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm ngưng" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceManagement;
