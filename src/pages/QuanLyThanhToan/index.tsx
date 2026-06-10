import React, { useState, useEffect, useRef } from 'react';
import { message, Modal, Button, Tag } from 'antd';
import { useReactToPrint } from 'react-to-print';
import {
    Search,
    Download,
    Eye,
    Trash2,
    FileText,
    CheckCircle2,
    CreditCard,
    MoreHorizontal,
    Filter,
    Clock,
    AlertTriangle,
    Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';
import HeaderProfile from '@/components/HeaderProfile';
import { getPayments, updatePaymentStatus } from '@/services/QuanLyPetStore';
import './style.less';

const QuanLyThanhToan: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'details' | 'select_method' | 'qr_code' | 'success'>('details');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getPayments({ limit: 100 });
            setPayments(data.items || []);
        } catch (error) {
            message.error('Không thể lấy danh sách thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        try {
            const dataToExport = filteredData.map((item, index) => ({
                'STT': index + 1,
                'Số Hóa Đơn': item.displayId || `#INV-${item.id.substring(0, 6).toUpperCase()}`,
                'Khách Hàng': item.owner?.full_name || 'Khách vãng lai',
                'Dịch Vụ': item.appointment?.service?.name || 'Dịch vụ lẻ',
                'Số Tiền': parseFloat(item.amount),
                'Phương Thức': item.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
                'Trạng Thái': item.status === 'paid' ? 'Đã thu' : (item.status === 'pending' ? 'Chờ thu' : 'Quá hạn'),
                'Ngày Lập': new Date(item.created_at).toLocaleString('vi-VN'),
            }));

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'KetQuaSX');
            XLSX.writeFile(wb, `Bao_Cao_Thanh_Toan_${new Date().getTime()}.xlsx`);
            message.success('Đã xuất báo cáo Excel thành công!');
        } catch (error) {
            message.error('Lỗi khi xuất file Excel');
        }
    };

    const invoiceRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirmPayment = async (id: string) => {
        const success = await updatePaymentStatus(id, 'paid');
        if (success) {
            fetchData();
            setPaymentStep('success');
        }
    };

    const displayData = payments || [];

    const filteredData = displayData.filter(p =>
        (p.owner?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.displayId || p.id).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Calculate Stats
    const totalInvoices = displayData.length;
    const paidCount = displayData.filter(p => p.status === 'paid').length;

    const calculateAvgValue = () => {
        if (displayData.length === 0) return '0 VND';
        let total = 0;
        let validCount = 0;
        displayData.forEach(p => {
            const val = parseFloat(p.amount as any);
            if (!isNaN(val)) {
                total += val;
                validCount++;
            }
        });
        if (validCount === 0) return '0 VND';
        const avg = total / validCount;
        if (avg >= 1000000) return `${(avg / 1000000).toFixed(1)}m VND`;
        if (avg >= 1000) return `${Math.round(avg / 1000)}k VND`;
        return `${Math.round(avg)} VND`;
    };

    const formatId = (id: string, displayId?: string) => {
        if (displayId) return displayId;
        return `#INV-${id.substring(0, 6).toUpperCase()}`;
    };

    return (
        <div className="billing-management-wrapper">
            {/* Global Header */}
            <div className="pc-header">
                <div className="pc-header-left" />
                <div className="pc-header-center">
                    <div className="pc-header-search">
                        <Search size={18} strokeWidth={1.75} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm hóa đơn..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                <div className="pc-header-actions">
                    <HeaderProfile />
                </div>
            </div>

            <div className="billing-container">
                {/* Page Header */}
                <div className="bm-header">
                    <div className="bm-header-left">
                        <h1>Quản lý Hóa đơn</h1>
                        <p>Xem và quản lý tất cả các bản ghi thanh toán và hóa đơn.</p>
                    </div>
                    <button className="bm-export-btn" onClick={handleExportExcel}>
                        Xuất báo cáo <Download size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="bm-stats-grid">
                    <div className="bm-stat-card">
                        <div className="info">
                            <div className="label">Tổng Hóa đơn</div>
                            <div className="value">{totalInvoices}</div>
                        </div>
                        <div className="icon-wrap orange">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="bm-stat-card">
                        <div className="info">
                            <div className="label">Đã Thu Tiền</div>
                            <div className="value">{paidCount}</div>
                        </div>
                        <div className="icon-wrap teal">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="bm-stat-card">
                        <div className="info">
                            <div className="label">Giá trị trung bình</div>
                            <div className="value">{calculateAvgValue()}</div>
                        </div>
                        <div className="icon-wrap pink">
                            <CreditCard size={24} />
                        </div>
                    </div>
                </div>

                {/* Invoice List Section */}
                <div className="bm-table-section">
                    <div className="bm-table-header">
                        <h2>Hóa đơn gần đây</h2>
                        <div className="actions">
                            <button className="icon-btn"><Filter size={18} /></button>
                            <button className="icon-btn"><MoreHorizontal size={18} /></button>
                        </div>
                    </div>

                    <div className="bm-table-wrapper">
                        {/* Table Header */}
                        <div className="bm-tr header-row">
                            <div className="bm-th col-id">MÃ HÓA ĐƠN</div>
                            <div className="bm-th col-customer">KHÁCH HÀNG</div>
                            <div className="bm-th col-service">DỊCH VỤ</div>
                            <div className="bm-th col-amount">SỐ TIỀN</div>
                            <div className="bm-th col-status">TRẠNG THÁI</div>
                            <div className="bm-th col-actions">THAO TÁC</div>
                        </div>

                        {/* Table Body */}
                        {loading ? (
                            <div className="bm-empty">Đang tải dữ liệu...</div>
                        ) : currentData.length > 0 ? (
                            currentData.map((row) => (
                                <div className="bm-tr body-row" key={row.id}>
                                    <div className="bm-td col-id">
                                        <span className="id-text">{formatId(row.id, row.displayId)}</span>
                                    </div>
                                    <div className="bm-td col-customer">
                                        <div className="customer-cell">
                                            <div className="avatar">
                                                {row.owner?.full_name ? row.owner.full_name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span className="name">{row.owner?.full_name || 'Khách vãng lai'}</span>
                                        </div>
                                    </div>
                                    <div className="bm-td col-service">
                                        {row.appointment?.service?.name || 'Dịch vụ lẻ'}
                                    </div>
                                    <div className="bm-td col-amount">
                                        {parseFloat(row.amount).toLocaleString('vi-VN')} VND
                                    </div>
                                    <div className="bm-td col-status">
                                        {row.status === 'paid' ? (
                                            <span className="status-badge paid"><CheckCircle2 size={14} /> Đã thu</span>
                                        ) : row.status === 'pending' ? (
                                            <span className="status-badge pending"><Clock size={14} /> Chờ thu</span>
                                        ) : (
                                            <span className="status-badge overdue"><AlertTriangle size={14} /> Quá hạn</span>
                                        )}
                                    </div>
                                    <div className="bm-td col-actions">
                                        <button className="action-btn" onClick={() => { 
                                            setSelectedPayment(row); 
                                            setPaymentStep('details');
                                            setIsDetailModalOpen(true); 
                                        }}>
                                            <Eye size={18} />
                                        </button>
                                        <button className="action-btn delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bm-empty">Không tìm thấy hóa đơn nào.</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="bm-pagination">
                        <div className="page-info">
                            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredData.length)} trong tổng số {filteredData.length} mục
                        </div>
                        <div className="page-controls">
                            <button
                                className="text-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                Trước
                            </button>
                            <button
                                className="text-btn"
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={
                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>
                        {paymentStep === 'details' ? 'Chi tiết hóa đơn' :
                         paymentStep === 'select_method' ? 'Chọn phương thức thanh toán' :
                         paymentStep === 'confirm_cash' ? 'Xác nhận thanh toán tiền mặt' :
                         paymentStep === 'qr_code' ? 'Thanh toán chuyển khoản' : 'Hoàn tất'}
                    </h3>
                }
                visible={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={null}
                width={480}
                className="bm-modal"
            >
                {selectedPayment && paymentStep === 'details' && (
                    <div className="invoice-detail">
                        <div className="amount-display">
                            <div className="label">TỔNG TIỀN</div>
                            <div className="value">{parseFloat(selectedPayment.amount).toLocaleString('vi-VN')} VND</div>
                            {selectedPayment.status === 'paid' ? (
                                <Tag color="success" style={{ marginTop: 8, borderRadius: 12 }}>THANH TOÁN THÀNH CÔNG</Tag>
                            ) : (
                                <Tag color="warning" style={{ marginTop: 8, borderRadius: 12 }}>CHỜ THANH TOÁN</Tag>
                            )}
                        </div>

                        <div className="info-box">
                            <div className="info-row">
                                <span className="lbl">Khách hàng</span>
                                <span className="val">{selectedPayment.owner?.full_name}</span>
                            </div>
                            <div className="info-row">
                                <span className="lbl">Dịch vụ</span>
                                <span className="val">{selectedPayment.appointment?.service?.name || 'N/A'}</span>
                            </div>
                            <div className="divider" />
                            <div className="info-row">
                                <span className="lbl">Ngày tạo</span>
                                <span className="val">{new Date(selectedPayment.created_at).toLocaleString('vi-VN')}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                            <Button
                                icon={<Printer size={16} />}
                                onClick={handlePrint}
                                style={{ borderRadius: 8, height: 44 }}
                            >
                                In hóa đơn
                            </Button>
                            {selectedPayment.status !== 'paid' && (
                                <Button
                                    type="primary"
                                    onClick={() => setPaymentStep('select_method')}
                                    style={{ borderRadius: 8, height: 44, background: '#F5C842', borderColor: '#F5C842', color: 'black', fontWeight: 600 }}
                                >
                                    Xác nhận thu
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {selectedPayment && paymentStep === 'select_method' && (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                        <p style={{ marginBottom: 24, color: '#666' }}>Vui lòng chọn phương thức thanh toán cho hóa đơn trị giá <strong>{parseFloat(selectedPayment.amount).toLocaleString('vi-VN')} VND</strong></p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Button 
                                type="primary" 
                                style={{ height: 60, borderRadius: 12, fontSize: 16, background: '#10b981', borderColor: '#10b981' }}
                                onClick={() => setPaymentStep('confirm_cash')}
                            >
                                Tiền mặt
                            </Button>
                            <Button 
                                type="primary" 
                                style={{ height: 60, borderRadius: 12, fontSize: 16, background: '#3b82f6', borderColor: '#3b82f6' }}
                                onClick={() => setPaymentStep('qr_code')}
                            >
                                Chuyển khoản MB
                            </Button>
                        </div>
                        <Button type="link" style={{ marginTop: 24, color: '#999' }} onClick={() => setPaymentStep('details')}>Quay lại</Button>
                    </div>
                )}

                {selectedPayment && paymentStep === 'confirm_cash' && (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                        <p style={{ marginBottom: 24, color: '#666', fontSize: 16 }}>
                            Xác nhận thu số tiền <strong>{parseFloat(selectedPayment.amount).toLocaleString('vi-VN')} VND</strong> bằng tiền mặt từ khách hàng {selectedPayment.owner?.full_name}?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Button 
                                type="primary" 
                                style={{ height: 48, borderRadius: 8, background: '#10b981', borderColor: '#10b981', fontSize: 16, fontWeight: 'bold' }}
                                onClick={() => handleConfirmPayment(selectedPayment.id)}
                            >
                                Hoàn tất thu tiền
                            </Button>
                            <Button type="default" style={{ height: 48, borderRadius: 8 }} onClick={() => setPaymentStep('select_method')}>Quay lại</Button>
                        </div>
                    </div>
                )}

                {selectedPayment && paymentStep === 'qr_code' && (
                    <div style={{ padding: '12px 0', textAlign: 'center' }}>
                        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, display: 'inline-block', marginBottom: 20 }}>
                            <img 
                                src={`https://img.vietqr.io/image/970422-0988408295-compact.png?amount=${selectedPayment.amount}&addInfo=Thanh toan hoa don ${selectedPayment.displayId || selectedPayment.id.substring(0, 6)}&accountName=MY PET CLINIC`} 
                                alt="QR Code" 
                                style={{ width: 250, height: 250, objectFit: 'contain' }}
                            />
                        </div>
                        <p style={{ color: '#666', marginBottom: 8 }}>Vui lòng quét mã QR trên bằng ứng dụng ngân hàng để thanh toán số tiền <strong>{parseFloat(selectedPayment.amount).toLocaleString('vi-VN')} VND</strong>.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                            <Button 
                                type="primary" 
                                style={{ height: 48, borderRadius: 8, background: '#F5C842', borderColor: '#F5C842', color: '#000', fontWeight: 'bold' }}
                                onClick={() => handleConfirmPayment(selectedPayment.id)}
                            >
                                Đã nhận được tiền
                            </Button>

                            <Button type="default" style={{ height: 48, borderRadius: 8 }} onClick={() => setPaymentStep('select_method')}>Quay lại</Button>
                        </div>
                    </div>
                )}

                {paymentStep === 'success' && (
                    <div style={{ padding: '32px 0', textAlign: 'center' }}>
                        <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: 16 }} />
                        <h2 style={{ margin: 0, color: '#10b981', marginBottom: 8 }}>Thanh toán thành công!</h2>
                        <p style={{ color: '#666', marginBottom: 32 }}>Hóa đơn đã được ghi nhận thanh toán hoàn tất.</p>
                        <Button 
                            type="primary" 
                            style={{ height: 48, borderRadius: 8, padding: '0 32px' }}
                            onClick={() => setIsDetailModalOpen(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                )}
            </Modal>

            {/* Hidden Print Template */}
            <div style={{ display: 'none' }}>
                <div ref={invoiceRef} className="print-invoice-template" style={{ padding: '40px', color: '#000' }}>
                    <div style={{ textAlign: 'center', marginBottom: 30 }}>
                        <h1 style={{ margin: 0, fontSize: 28 }}>MY PET CLINIC</h1>
                        <p style={{ margin: 5 }}>Địa chỉ: 123 Đường Thú Y, Hà Nội</p>
                        <p style={{ margin: 5 }}>Hotline: 1900 1088</p>
                        <h2 style={{ marginTop: 30, textDecoration: 'underline' }}>HÓA ĐƠN THANH TOÁN</h2>
                    </div>

                    {selectedPayment && (
                        <>
                            <div style={{ marginBottom: 20 }}>
                                <p><strong>Mã hóa đơn:</strong> {selectedPayment.displayId || `#INV-${selectedPayment.id.substring(0, 6).toUpperCase()}`}</p>
                                <p><strong>Ngày lập:</strong> {new Date(selectedPayment.created_at).toLocaleString('vi-VN')}</p>
                                <p><strong>Khách hàng:</strong> {selectedPayment.owner?.full_name}</p>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #000' }}>
                                        <th style={{ textAlign: 'left', padding: '10px' }}>NỘI DUNG DỊCH VỤ</th>
                                        <th style={{ textAlign: 'right', padding: '10px' }}>THÀNH TIỀN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '10px' }}>{selectedPayment.appointment?.service?.name || 'Dịch vụ khám điều trị'}</td>
                                        <td style={{ textAlign: 'right', padding: '10px' }}>{parseFloat(selectedPayment.amount).toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ textAlign: 'right', fontSize: 18 }}>
                                <strong>TỔNG CỘNG: {parseFloat(selectedPayment.amount).toLocaleString('vi-VN')} VND</strong>
                            </div>

                            <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p>Khách hàng</p>
                                    <div style={{ marginTop: 60 }}>(Ký và ghi rõ họ tên)</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p>Người lập phiếu</p>
                                    <div style={{ marginTop: 60 }}>(Ký và ghi rõ họ tên)</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuanLyThanhToan;
