import { MessageOutlined } from '@ant-design/icons';
import { Button, Tag, Tabs, Typography, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getConversations, getUnreadCount } from '@/services/messageService';
import styles from './index.module.less';

const { Title, Text } = Typography;

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
    // Lấy participant không phải mình (bác sĩ)
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

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} className={styles.title}>Tư vấn trực tuyến</Title>
          <Text className={styles.subtitle}>
            {totalUnread > 0 ? (
              <>Bạn có <strong>{totalUnread} cuộc trò chuyện</strong> chưa đọc.</>
            ) : (
              'Tất cả cuộc trò chuyện đã được phản hồi.'
            )}
          </Text>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.filterTabs}
        >
          <Tabs.TabPane tab="Tất cả" key="tat-ca" />
          <Tabs.TabPane tab="Chờ phản hồi" key="cho-phan-hoi" />
          <Tabs.TabPane tab="Đã phản hồi" key="da-phan-hoi" />
        </Tabs>
      </div>

      {/* Conversation cards */}
      <Spin spinning={loading}>
        <div className={styles.cardList}>
          {filtered.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
              Không có cuộc trò chuyện nào
            </div>
          ) : (
            filtered.map((conv) => {
              const other = getOtherParticipant(conv);
              const isUnread = conv.unread_count > 0;
              const lastMsg = conv.last_message;

              return (
                <div
                  key={conv.id}
                  className={`${styles.consultCard} ${isUnread ? styles.cardUrgent : styles.cardReplied}`}
                >
                  {/* Card header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLeft}>
                      <div className={styles.petIconBg}>🐾</div>
                      <div>
                        <div className={styles.consultTitle}>
                          {other?.full_name || 'Người dùng'}
                        </div>
                        <div className={styles.consultMeta}>
                          <span>👤 {other?.email}</span>
                          {other?.phone && <span>📞 {other?.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardRight}>
                      <div className={styles.badgeGroup}>
                        <Tag
                          className={`${styles.statusTag} ${isUnread ? styles.tagPending : styles.tagDone}`}
                        >
                          {isUnread ? `Chưa đọc (${conv.unread_count})` : 'Đã phản hồi'}
                        </Tag>
                      </div>
                      <div className={styles.timeText}>
                        THỜI GIAN<br />
                        {lastMsg?.created_at ? formatTime(lastMsg.created_at) : formatTime(conv.updated_at)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  {lastMsg && (
                    <div className={styles.contentBox}>
                      <div className={styles.contentLabel}>
                        {lastMsg.sender_name ? `${lastMsg.sender_name}:` : 'Tin nhắn mới nhất:'}
                      </div>
                      <div className={styles.contentText}>
                        {lastMsg.content || (lastMsg.message_type === 'image' ? '📷 Hình ảnh' : '📎 Tệp đính kèm')}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <Button
                      type="primary"
                      size="small"
                      icon={<MessageOutlined />}
                      className={styles.btnReply}
                      onClick={() => history.push(`/bac-si/tu-van/phan-hoi?id=${conv.id}`)}
                    >
                      {isUnread ? 'Phản hồi' : 'Xem cuộc trò chuyện'}
                    </Button>
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
