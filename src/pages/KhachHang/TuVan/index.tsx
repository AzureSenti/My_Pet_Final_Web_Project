import { MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Tabs, Typography, Spin, Modal, Select, message, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getConversations, getUnreadCount, createConversation } from '@/services/messageService';
import { getOwnerVets } from '@/services/QuanLyPetStore';
import styles from './index.less';

const { Title, Text } = Typography;
const { Option } = Select;

const TuVan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tat-ca');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  // For New Conversation Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vets, setVets] = useState<any[]>([]);
  const [selectedVet, setSelectedVet] = useState<string | null>(null);
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

  const filtered = conversations.filter((c) => {
    if (activeTab === 'chua-doc') return c.unread_count > 0;
    if (activeTab === 'da-doc') return c.unread_count === 0;
    return true;
  });

  const getOtherParticipant = (conv: any) => {
    const participants = conv.participants || [];
    // Tìm bác sĩ
    const other = participants.find((p: any) => p.role === 'vet' || p.role === 'admin') || participants[0];
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
              <>Bạn có <strong>{totalUnread} tin nhắn</strong> chưa đọc từ Bác sĩ.</>
            ) : (
              'Bạn có thể nhắn tin trực tiếp với Bác sĩ thú y để nhận tư vấn.'
            )}
          </Text>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{ borderRadius: '8px', background: '#7A631B', borderColor: '#7A631B' }}
          >
            Bắt đầu trò chuyện mới
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className={styles.filterTabs}
          >
            <Tabs.TabPane tab="Tất cả" key="tat-ca" />
            <Tabs.TabPane tab="Chưa đọc" key="chua-doc" />
            <Tabs.TabPane tab="Đã đọc" key="da-doc" />
        </Tabs>
      </div>

      {/* Conversation cards */}
      <Spin spinning={loading}>
        <div className={styles.cardList}>
          {filtered.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
              Bạn chưa có cuộc trò chuyện nào. Hãy chọn Bắt đầu trò chuyện mới để liên hệ Bác sĩ.
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
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLeft}>
                      <div className={styles.petIconBg}>👨‍⚕️</div>
                      <div>
                        <div className={styles.consultTitle}>
                          BS. {other?.full_name || 'Bác sĩ'}
                        </div>
                        <div className={styles.consultMeta}>
                          <span>Khoa/Chuyên khoa</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardRight}>
                      <div className={styles.badgeGroup}>
                        <Tag
                          className={`${styles.statusTag} ${isUnread ? styles.tagPending : styles.tagDone}`}
                        >
                          {isUnread ? `Chưa đọc (${conv.unread_count})` : 'Đã đọc'}
                        </Tag>
                      </div>
                      <div className={styles.timeText}>
                        THỜI GIAN<br />
                        {lastMsg?.created_at ? formatTime(lastMsg.created_at) : formatTime(conv.updated_at)}
                      </div>
                    </div>
                  </div>

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

                  <div className={styles.cardActions}>
                    <Button
                      type="primary"
                      size="small"
                      icon={<MessageOutlined />}
                      className={styles.btnReply}
                      onClick={() => history.push(`/khach-hang/tu-van/phan-hoi?id=${conv.id}`)}
                    >
                      {isUnread ? 'Trả lời ngay' : 'Xem cuộc trò chuyện'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Spin>

      {/* Modal Tạo Chat Mới */}
      <Modal
        title={<b>Bắt đầu trò chuyện với Bác sĩ</b>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateConversation}
        confirmLoading={creating}
        okText="Bắt đầu nhắn tin"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#7A631B', borderColor: '#7A631B' } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Vui lòng chọn bác sĩ mà bạn muốn nhận tư vấn. Bạn có thể gửi câu hỏi và bác sĩ sẽ trả lời sớm nhất.</Text>
        </div>
        <Select
          showSearch
          placeholder="Chọn bác sĩ..."
          style={{ width: '100%' }}
          size="large"
          value={selectedVet}
          onChange={(val) => setSelectedVet(val)}
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {vets.map(vet => (
            <Option key={vet.id} value={vet.id}>
              <div className={styles.vetItem}>
                <Avatar src={vet.avatar_url} size="small" />
                <span style={{ marginLeft: 8 }}>BS. {vet.full_name} - {vet.specialization}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default TuVan;
