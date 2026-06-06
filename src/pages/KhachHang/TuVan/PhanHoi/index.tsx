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
} from '@/services/messageService';
import styles from './index.less';

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
      antMessage.warning('Vui lòng nhập nội dung tin nhắn');
      return;
    }
    try {
      setSending(true);
      await sendMessage(conversationId, replyText.trim());
      setReplyText('');
      // Reload messages
      const msgData = await getConversationMessages(conversationId, 1, 100);
      setMessages(msgData.items || []);
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      antMessage.error('Lỗi khi gửi tin nhắn');
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

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/khach-hang/tu-van">Tư vấn trực tuyến</Link> {'>'} Trò chuyện
      </div>

      <div className={styles.pageHeader}>
        <button className={styles.btnBack} onClick={() => history.push('/khach-hang/tu-van')}>
          <ArrowLeftOutlined />
        </button>
        <h1 className={styles.title}>
          BS. {other?.full_name || 'Bác sĩ'}
        </h1>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column: Messages History */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.patientHeader}>
              <div className={styles.patientInfo}>
                <div className={styles.petIcon}>👨‍⚕️</div>
                <div>
                  <div className={styles.petName}>BS. {other?.full_name || 'Bác sĩ'}</div>
                  <div className={styles.ownerName}>{other?.email}</div>
                </div>
              </div>
            </div>

            {/* All messages */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#706F6C', marginBottom: '8px', textTransform: 'uppercase' }}>
                Lịch sử tin nhắn ({messages.length})
              </div>
              <div style={{ height: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Chưa có tin nhắn nào. Bắt đầu trò chuyện ngay!</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?.id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          padding: '10px 14px',
                          marginBottom: '12px',
                          borderRadius: '10px',
                          background: isMe ? '#E8F5E9' : '#F5F5F5',
                          borderLeft: isMe ? '3px solid #135D54' : '3px solid #706F6C',
                          marginLeft: isMe ? '40px' : '0',
                          marginRight: isMe ? '0' : '40px',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                          {isMe ? 'Bạn' : msg.sender?.full_name} · {new Date(msg.created_at).toLocaleString('vi-VN')}
                        </div>
                        <div style={{ fontSize: '14px', color: '#333' }}>
                          {msg.content || (msg.message_type === 'image' ? '📷 Hình ảnh' : '📎 Tệp đính kèm')}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <h3>
              <div className={styles.icon}><EditOutlined /></div>
              Soạn thảo tin nhắn
            </h3>
          </div>

          <div className={styles.editorArea}>
            <div className={styles.toolbar}>
              <button><BoldOutlined /></button>
              <button><ItalicOutlined /></button>
              <button><UnorderedListOutlined /></button>
              <button><PictureOutlined /></button>
              <button><PaperClipOutlined /></button>
            </div>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Nhập nội dung tin nhắn gửi tới Bác sĩ..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>

          <div className={styles.editorFooter}>
            <div className={styles.autoSave}></div>
            <div className={styles.actions}>
              <button
                className={styles.btnSend}
                onClick={handleSend}
                disabled={sending || !replyText.trim()}
                style={{ opacity: sending || !replyText.trim() ? 0.6 : 1 }}
              >
                <SendOutlined /> {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhanHoi;
