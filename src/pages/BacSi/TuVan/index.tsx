import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { history } from 'umi';
import { PawPrint, Mail, Phone, MessageCircle, Eye } from 'lucide-react';
import { getConversations, getUnreadCount } from '@/services/messageService';
import styles from './index.module.less';

const TuVan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tat-ca');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [convData, unreadData] = await Promise.all([
          getConversations(1, 50),
          getUnreadCount(),
        ]);
        setConversations(convData.items || []);
        setTotalUnread(unreadData.total_unread || 0);
      } catch (error) {
        console.error('Lỗi khi tải cuộc trò chuyện:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = conversations.filter((c) => {
    if (activeTab === 'cho-phan-hoi') return c.unread_count > 0;
    if (activeTab === 'da-phan-hoi') return c.unread_count === 0;
    return true;
  });

  const getOtherParticipant = (conv: any) => {
    const participants = conv.participants || [];
    const other = participants.find((p: any) => p.role !== 'vet') || participants[0];
    return other;
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${Math.max(1, minutes)} PHÚT TRƯỚC`;
    if (hours < 24) return `${hours} GIỜ TRƯỚC`;
    return `${days} NGÀY TRƯỚC`;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Tư vấn trực tuyến</h1>
          <p className={styles.subtitle}>
            {totalUnread > 0 ? (
              <>Bạn có <strong>{totalUnread} cuộc trò chuyện</strong> chờ phản hồi.</>
            ) : (
              'Tất cả cuộc trò chuyện đã được phản hồi.'
            )}
          </p>
        </div>
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterPill} ${activeTab === 'tat-ca' ? styles.active : ''}`}
            onClick={() => setActiveTab('tat-ca')}
          >
            Tất cả
          </button>
          <button 
            className={`${styles.filterPill} ${activeTab === 'cho-phan-hoi' ? styles.active : ''}`}
            onClick={() => setActiveTab('cho-phan-hoi')}
          >
            Chờ phản hồi
          </button>
          <button 
            className={`${styles.filterPill} ${activeTab === 'da-phan-hoi' ? styles.active : ''}`}
            onClick={() => setActiveTab('da-phan-hoi')}
          >
            Đã phản hồi
          </button>
        </div>
      </div>

      {/* Conversation cards */}
      <Spin spinning={loading}>
        <div className={styles.cardList}>
          {filtered.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              Không tìm thấy cuộc trò chuyện nào phù hợp.
            </div>
          ) : (
            filtered.map((conv) => {
              const other = getOtherParticipant(conv);
              const isUnread = conv.unread_count > 0;
              const lastMsg = conv.last_message;

              return (
                <div key={conv.id} className={styles.consultCard}>
                  
                  {/* Card header */}
                  <div className={styles.cardTop}>
                    <div className={styles.cardLeft}>
                      <div className={styles.avatar}>
                        <PawPrint size={28} strokeWidth={2.5} />
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>
                          {other?.full_name || 'Khách hàng'}
                        </div>
                        <div className={styles.contactInfo}>
                          {other?.email && (
                            <span><Mail size={14} /> {other.email}</span>
                          )}
                          {other?.phone && (
                            <span><Phone size={14} /> {other.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.cardRight}>
                      {isUnread ? (
                        <div className={`${styles.badge} ${styles.unread}`}>
                          Chưa đọc ({conv.unread_count})
                        </div>
                      ) : (
                        <div className={`${styles.badge} ${styles.read}`}>
                          Đã phản hồi
                        </div>
                      )}
                      <div className={styles.timeDisplay}>
                        THỜI GIAN / {lastMsg?.created_at ? formatTime(lastMsg.created_at) : formatTime(conv.updated_at)}
                      </div>
                    </div>
                  </div>

                  {/* Message Preview (Only for unread) */}
                  {isUnread && lastMsg && (
                    <div className={styles.previewBox}>
                      <div className={styles.previewLabel}>
                        {lastMsg.sender_name?.toUpperCase() || 'KHÁCH HÀNG'} ĐÃ GỬI:
                      </div>
                      <div className={styles.previewText}>
                        "{lastMsg.content || (lastMsg.message_type === 'image' ? '📷 Đã gửi một hình ảnh' : '📎 Đã gửi một tệp đính kèm')}"
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button
                      className={isUnread ? styles.btnReply : styles.btnView}
                      onClick={() => history.push(`/bac-si/tu-van/phan-hoi?id=${conv.id}`)}
                    >
                      {isUnread ? (
                        <><MessageCircle size={16} /> Phản hồi</>
                      ) : (
                        <><Eye size={16} /> Xem cuộc trò chuyện</>
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
  );
};

export default TuVan;
