import React, { useEffect, useState, useRef } from 'react';
import { history, Link, useLocation, useModel } from 'umi';
import { Spin, message as antMessage } from 'antd';
import {
  ArrowLeftOutlined, EditOutlined,
  BoldOutlined, ItalicOutlined, UnorderedListOutlined,
  PaperClipOutlined, PictureOutlined, LinkOutlined,
  SendOutlined
} from '@ant-design/icons';
import {
  getConversationDetail,
  getConversationMessages,
  sendMessage,
} from '@/services/messageService/index';
import styles from './index.module.less';

const PhanHoi: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const conversationId = query.get('id');

  const { initialState } = useModel('@@initialState');
  const currentUserId = initialState?.currentUser?.id;

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchData = async () => {
    if (!conversationId) {
      antMessage.error('Không tìm thấy ID cuộc trò chuyện');
      return;
    }
    try {
      setLoading(true);
      const [convData, msgData] = await Promise.all([
        getConversationDetail(conversationId),
        getConversationMessages(conversationId, 1, 100),
      ]);
      setConversation(convData);
      setMessages(msgData.items || []);
    } catch (error) {
      console.error('Lỗi khi tải cuộc trò chuyện:', error);
      antMessage.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [conversationId]);

  const handleSend = async () => {
    if (!conversationId || !replyText.trim()) {
      antMessage.warning('Vui lòng nhập nội dung phản hồi');
      return;
    }
    try {
      setSending(true);
      await sendMessage(conversationId, replyText.trim());
      antMessage.success('Đã gửi phản hồi thành công!');
      setReplyText('');
      // Reload messages
      const msgData = await getConversationMessages(conversationId, 1, 100);
      setMessages(msgData.items || []);
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      antMessage.error('Lỗi khi gửi phản hồi');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    const participants = conversation?.participants || [];
    return participants.find((p: any) => p.id !== currentUserId) || participants[0];
  };

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const other = getOtherParticipant();

  // Tách tin nhắn: tin nhắn từ khách (không phải mình) vs tin nhắn mình gửi
  const customerMessages = messages.filter((m) => m.sender?.id !== currentUserId);

  // Lấy tin nhắn đầu tiên của khách làm "câu hỏi"
  const firstQuestion = customerMessages.length > 0 ? customerMessages[0] : null;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/bac-si/tu-van">Tư vấn trực tuyến</Link> {'>'} Phản hồi tư vấn
      </div>

      <div className={styles.pageHeader}>
        <button className={styles.btnBack} onClick={() => history.push('/bac-si/tu-van')}>
          <ArrowLeftOutlined />
        </button>
        <h1 className={styles.title}>
          Cuộc trò chuyện với {other?.full_name || 'Người dùng'}
        </h1>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column: Messages History */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.patientHeader}>
              <div className={styles.patientInfo}>
                <div className={styles.petIcon}>🐾</div>
                <div>
                  <div className={styles.petName}>{other?.full_name || 'Người dùng'}</div>
                  <div className={styles.ownerName}>{other?.email}</div>
                </div>
              </div>
              {customerMessages.length > 0 && (
                <div className={styles.tagNew}>
                  {customerMessages.length} tin nhắn
                </div>
              )}
            </div>

            {firstQuestion && (
              <>
                <div className={styles.timeInfo}>
                  🕒 Gửi lúc: {new Date(firstQuestion.created_at).toLocaleString('vi-VN')}
                </div>
                <div className={styles.quoteBox}>
                  {firstQuestion.content || '(Hình ảnh / tệp đính kèm)'}
                </div>
              </>
            )}

            {/* All messages */}
            {messages.length > 1 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#706F6C', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Lịch sử tin nhắn ({messages.length})
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {messages.map((msg) => {
                    const isMe = msg.sender?.id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          padding: '10px 14px',
                          marginBottom: '8px',
                          borderRadius: '10px',
                          background: isMe ? '#E8F5E9' : '#F5F5F5',
                          borderLeft: isMe ? '3px solid #135D54' : '3px solid #706F6C',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                          {msg.sender?.full_name} · {new Date(msg.created_at).toLocaleString('vi-VN')}
                        </div>
                        <div style={{ fontSize: '13px', color: '#333' }}>
                          {msg.content || (msg.message_type === 'image' ? '📷 Hình ảnh' : '📎 Tệp đính kèm')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <h3>
              <div className={styles.icon}><EditOutlined /></div>
              Soạn thảo phản hồi
            </h3>
          </div>

          <div className={styles.editorArea}>
            <div className={styles.toolbar}>
              <button><BoldOutlined /></button>
              <button><ItalicOutlined /></button>
              <button><UnorderedListOutlined /></button>
              <button><PaperClipOutlined /></button>
              <button><PictureOutlined /></button>
              <button><LinkOutlined /></button>
            </div>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Nhập nội dung tư vấn chuyên môn tại đây..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <div className={styles.editorFooter}>
            <div className={styles.autoSave}></div>
            <div className={styles.actions}>
              <button
                className={styles.btnDraft}
                onClick={() => history.push('/bac-si/tu-van')}
              >
                Hủy
              </button>
              <button
                className={styles.btnSend}
                onClick={handleSend}
                disabled={sending || !replyText.trim()}
                style={{ opacity: sending || !replyText.trim() ? 0.6 : 1 }}
              >
                <SendOutlined /> {sending ? 'Đang gửi...' : 'Gửi phản hồi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhanHoi;
