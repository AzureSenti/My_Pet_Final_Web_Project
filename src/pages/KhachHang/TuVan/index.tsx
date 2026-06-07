import React, { useEffect, useState } from 'react';
import { Avatar, Spin, Modal, message, Typography } from 'antd';
import { Search, Plus, Clock, ChevronRight, Video, CheckCircle2 } from 'lucide-react';
import { history } from 'umi';
import { getConversations, getUnreadCount, createConversation } from '@/services/messageService';
import { getOwnerVets } from '@/services/QuanLyPetStore';
import styles from './index.less';

const { Text } = Typography;

const TuVan: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('tat-ca');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  // For New Conversation Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vets, setVets] = useState<any[]>([]);
  const [selectedVet, setSelectedVet] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [convData, unreadData, vetsData] = await Promise.all([
        getConversations(1, 50),
        getUnreadCount(),
        getOwnerVets()
      ]);
      setConversations(convData.items || []);
      setTotalUnread(unreadData.total_unread || 0);
      setVets(vetsData || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tư vấn:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateConversation = async () => {
    if (!selectedVet) {
      message.warning('Vui lòng chọn bác sĩ để nhắn tin!');
      return;
    }
    setCreating(true);
    try {
      const res = await createConversation({
        participant_ids: [selectedVet],
      });
      message.success('Tạo cuộc trò chuyện thành công!');
      setIsModalVisible(false);
      history.push(`/khach-hang/tu-van/phan-hoi?id=${res.id}`);
    } catch (error) {
      console.error('Lỗi tạo chat:', error);
      message.error('Không thể tạo cuộc trò chuyện lúc này.');
    } finally {
      setCreating(false);
    }
  };

  const getOtherParticipant = (conv: any) => {
    const participants = conv.participants || [];
    return participants.find((p: any) => p.role === 'vet' || p.role === 'admin') || participants[0];
  };

  const filtered = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    const vetName = (other?.full_name || '').toLowerCase();
    
    // Search query filter
    if (searchQuery && !vetName.includes(searchQuery.toLowerCase())) {
        return false;
    }

    // Tab filter
    if (activeFilter === 'chua-doc') return c.unread_count > 0;
    if (activeFilter === 'da-doc') return c.unread_count === 0;
    return true;
  });

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${Math.max(1, minutes)} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const getSpecialtyBadgeClass = (specialty: string) => {
      const sp = (specialty || '').toLowerCase();
      if (sp.includes('mèo') || sp.includes('cat')) return styles.cat;
      if (sp.includes('chó') || sp.includes('dog')) return styles.dog;
      if (sp.includes('ngoại') || sp.includes('surgery')) return styles.surgery;
      if (sp.includes('da') || sp.includes('derma')) return styles.derma;
      return styles.general;
  };

  // Filter vets for Modal
  const filteredVets = vets.filter(vet => 
    vet.full_name?.toLowerCase().includes(modalSearch.toLowerCase()) || 
    vet.specialization?.toLowerCase().includes(modalSearch.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Tư vấn trực tuyến</h1>
            <p className={styles.subtitle}>Quản lý các cuộc trò chuyện và tư vấn với bác sĩ thú y</p>
          </div>
          <button 
            className={styles.btnNewChat} 
            onClick={() => {
                setModalSearch('');
                setSelectedVet(null);
                setIsModalVisible(true);
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            Tạo cuộc hội thoại mới
          </button>
        </div>

        {/* Toolbar: Filters & Search */}
        <div className={styles.toolbar}>
            <div className={styles.filters}>
                <div 
                    className={`${styles.filterPill} ${activeFilter === 'tat-ca' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('tat-ca')}
                >
                    Tất cả
                </div>
                <div 
                    className={`${styles.filterPill} ${activeFilter === 'chua-doc' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('chua-doc')}
                >
                    Chưa đọc {totalUnread > 0 ? `(${totalUnread})` : ''}
                </div>
                <div 
                    className={`${styles.filterPill} ${activeFilter === 'da-doc' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('da-doc')}
                >
                    Đã đọc
                </div>
            </div>
            <div className={styles.searchBox}>
                <Search size={18} className={styles.icon} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm bác sĩ..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Conversation cards */}
        <Spin spinning={loading}>
          <div className={styles.cardList}>
            {filtered.length === 0 && !loading ? (
              <div className={styles.emptyState}>
                Không tìm thấy cuộc hội thoại nào.
              </div>
            ) : (
              filtered.map((conv) => {
                const other = getOtherParticipant(conv);
                const isUnread = conv.unread_count > 0;
                const lastMsg = conv.last_message;
                const specialtyClass = getSpecialtyBadgeClass(other?.specialization || 'Đa khoa');

                return (
                  <div
                    key={conv.id}
                    className={`${styles.consultCard} ${isUnread ? styles.unreadCard : ''}`}
                    onClick={() => history.push(`/khach-hang/tu-van/phan-hoi?id=${conv.id}`)}
                  >
                    {/* Left: Avatar */}
                    <div className={styles.cardAvatar}>
                        <Avatar src={other?.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'} />
                        <div className={styles.onlineDot}></div>
                        {isUnread && <div className={styles.redDot}></div>}
                    </div>

                    {/* Middle: Info */}
                    <div className={styles.cardInfo}>
                        <div className={styles.topRow}>
                            <span className={styles.vetName}>BS. {other?.full_name || 'Bác sĩ'}</span>
                            <span className={`${styles.badgeSpecialty} ${specialtyClass}`}>
                                {other?.specialization || 'Đa khoa'}
                            </span>
                        </div>
                        <div className={styles.msgPreview}>
                            {lastMsg?.sender_name ? `${lastMsg.sender_name}: ` : ''}
                            {lastMsg?.content || (lastMsg?.message_type === 'image' ? '📷 Hình ảnh' : 'Chưa có tin nhắn')}
                        </div>
                        <div className={styles.timeRow}>
                            <Clock size={14} />
                            <span>{lastMsg?.created_at ? formatTime(lastMsg.created_at) : formatTime(conv.updated_at)}</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className={styles.cardAction}>
                        {isUnread && (
                            <span className={styles.unreadBadge}>{conv.unread_count} tin nhắn mới</span>
                        )}
                        <button className={`${styles.btnAction} ${isUnread ? styles.btnUnread : styles.btnRead}`}>
                            {isUnread ? (
                                <>Xem tin nhắn <ChevronRight size={16}/></>
                            ) : (
                                <>Xem lại <Clock size={16}/></>
                            )}
                        </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Spin>
      </div>

      {/* Footer */}
      <footer className={styles.customFooter}>
        <div className={styles.fLogo}>PetCare</div>
        <div className={styles.fLinks}>
            <a href="#">Support</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
        </div>
      </footer>

      {/* Custom Modal Tạo Chat Mới */}
      <Modal
        title={null}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={560}
        centered
        className={styles.modernModal}
        closeIcon={<span className={styles.closeIcon}>×</span>}
      >
        <div className={styles.modalHeader}>
            <h2>Bắt đầu trò chuyện</h2>
            <p>Chọn một bác sĩ thú y để nhận tư vấn chuyên môn</p>
        </div>

        <div className={styles.modalSearch}>
            <Search size={18} className={styles.searchIcon} />
            <input 
                type="text" 
                placeholder="Tìm kiếm theo tên hoặc chuyên khoa..." 
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
            />
        </div>

        <div className={styles.doctorList}>
            {filteredVets.length === 0 ? (
                <div className={styles.emptyDoctor}>Không tìm thấy bác sĩ nào</div>
            ) : (
                filteredVets.map(vet => {
                    const isSelected = selectedVet === vet.id;
                    const specialtyClass = getSpecialtyBadgeClass(vet.specialization || 'Đa khoa');
                    return (
                        <div 
                            key={vet.id} 
                            className={`${styles.doctorCard} ${isSelected ? styles.selected : ''}`}
                            onClick={() => setSelectedVet(vet.id)}
                        >
                            <div className={styles.docAvatar}>
                                <Avatar size={48} src={vet.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'} />
                                <div className={styles.docOnline}></div>
                            </div>
                            <div className={styles.docInfo}>
                                <h4>BS. {vet.full_name}</h4>
                                <span className={`${styles.badgeSpecialty} ${specialtyClass}`}>
                                    {vet.specialization || 'Đa khoa'}
                                </span>
                            </div>
                            <div className={styles.docCheck}>
                                {isSelected ? <CheckCircle2 size={24} color="#FFBA49" fill="#FFFBEB" /> : <div className={styles.circle}></div>}
                            </div>
                        </div>
                    );
                })
            )}
        </div>

        <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={() => setIsModalVisible(false)}>
                Hủy bỏ
            </button>
            <button 
                className={`${styles.btnConfirm} ${!selectedVet ? styles.disabled : ''}`} 
                onClick={handleCreateConversation}
                disabled={!selectedVet || creating}
            >
                {creating ? <Spin size="small" /> : 'Bắt đầu nhắn tin'}
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default TuVan;
