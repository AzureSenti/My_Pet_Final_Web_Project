import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, message, Popconfirm } from 'antd';
import {
    Search,
    Plus,
    ListTodo,
    CheckCircle2,
    Tag,
    Edit2,
    Trash2,
    Activity
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
    const [activeTab, setActiveTab] = useState('Tất cả');

    const tabs = ['Tất cả', 'Khám bệnh', 'Spa & Grooming', 'Phẫu thuật'];

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getServices();
            setServices(data || []);
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
            form.setFieldsValue({ is_active: true, duration_minutes: 30 });
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

    const calculateAvgPrice = () => {
        if (!services || services.length === 0) return '0 VND';
        let total = 0;
        let validCount = 0;
        services.forEach(s => {
            const p = parseFloat(s.price as any);
            if (!isNaN(p)) {
                total += p;
                validCount++;
            }
        });
        if (validCount === 0) return '0 VND';
        const avg = total / validCount;
        if (avg >= 1000000) {
            return `${(avg / 1000000).toFixed(1)}m VND`;
        }
        if (avg >= 1000) {
            return `${Math.round(avg / 1000)}k VND`;
        }
        return `${Math.round(avg)} VND`;
    };

    const activeCount = services.filter(s => s.is_active).length;
    const activePercent = services.length > 0 ? Math.round((activeCount / services.length) * 100) : 0;

    const filteredServices = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTab = true;
        const nameLower = s.name.toLowerCase();
        if (activeTab === 'Khám bệnh') {
            matchesTab = nameLower.includes('khám') || nameLower.includes('tiêm') || nameLower.includes('xét nghiệm') || nameLower.includes('vaccine');
        } else if (activeTab === 'Spa & Grooming') {
            matchesTab = nameLower.includes('spa') || nameLower.includes('tỉa') || nameLower.includes('tắm') || nameLower.includes('lông');
        } else if (activeTab === 'Phẫu thuật') {
            matchesTab = nameLower.includes('phẫu thuật') || nameLower.includes('triệt sản') || nameLower.includes('mổ');
        }

        return matchesSearch && matchesTab;
    });

    return (
        <div className="clinic-service-wrapper">
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

            <div className="clinic-service-container">
                {/* Header */}
                <div className="cs-header">
                    <div className="cs-header-left">
                        <h1>Quản lý dịch vụ</h1>
                        <p>Danh mục khám chữa bệnh và chăm sóc thú cưng</p>
                    </div>
                    <button className="cs-add-btn" onClick={() => handleOpenModal()}>
                        <Plus size={18} strokeWidth={2.5} />
                        Thêm Dịch Vụ Mới
                    </button>
                </div>

                {/* Metrics Grid */}
                <div className="cs-metrics-grid">
                    <div className="cs-metric-card">
                        <div className="icon-wrapper orange">
                            <ListTodo size={24} />
                        </div>
                        <div className="info">
                            <div className="label">Tổng số dịch vụ</div>
                            <div className="value">{services.length}</div>
                        </div>
                    </div>
                    <div className="cs-metric-card">
                        <div className="icon-wrapper teal">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="info">
                            <div className="label">Đang hoạt động</div>
                            <div className="value-wrap">
                                <div className="value">{activeCount}</div>
                                {services.length > 0 && <span className="badge teal">{activePercent}%</span>}
                            </div>
                        </div>
                    </div>
                    <div className="cs-metric-card">
                        <div className="icon-wrapper purple">
                            <Tag size={24} />
                        </div>
                        <div className="info">
                            <div className="label">Giá trung bình</div>
                            <div className="value">{calculateAvgPrice()}</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="cs-toolbar">
                    <div className="cs-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                className={`cs-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List of Services */}
                <div className="cs-list">
                    {loading ? (
                        <div className="loading-state">Đang tải dữ liệu...</div>
                    ) : filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                            <div key={service.id} className="cs-list-item">
                                <div className="item-icon">
                                    <Activity size={20} />
                                </div>
                                <div className="item-details">
                                    <h4 className="item-name">{service.name}</h4>
                                    <p className="item-desc">{service.description || 'Không có mô tả chi tiết'}</p>
                                </div>
                                <div className="item-price">
                                    {parseFloat(service.price as any).toLocaleString('vi-VN')} đ
                                </div>
                                <div className="item-status">
                                    {service.is_active ? (
                                        <span className="status-pill active">Hoạt động</span>
                                    ) : (
                                        <span className="status-pill inactive">Tạm ngưng</span>
                                    )}
                                </div>
                                <div className="item-actions">
                                    <button className="action-btn edit" onClick={() => handleOpenModal(service)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <Popconfirm
                                        title="Xoá dịch vụ này?"
                                        onConfirm={() => handleDelete(service.id)}
                                        okText="Xoá"
                                        cancelText="Hủy"
                                        okButtonProps={{ danger: true }}
                                    >
                                        <button className="action-btn delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            Không tìm thấy dịch vụ nào phù hợp.
                        </div>
                    )}
                </div>

                {/* Modal */}
                <Modal
                    title={<h3 style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h3>}
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={() => form.submit()}
                    okText="Lưu thông tin"
                    cancelText="Hủy"
                    destroyOnClose
                    width={500}
                    className="cs-modal"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ is_active: true, duration_minutes: 30 }}
                        style={{ marginTop: 24 }}
                    >
                        <Form.Item
                            name="name"
                            label="Tên dịch vụ"
                            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                        >
                            <Input placeholder="Nhập tên dịch vụ" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả chi tiết"
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Mô tả về dịch vụ..."
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
        </div>
    );
};

export default ServiceManagement;
