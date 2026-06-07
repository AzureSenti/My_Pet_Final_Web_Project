import React, { useEffect, useState, useRef } from 'react';
import { history, useLocation, useModel } from 'umi';
import { Spin, message as antMessage } from 'antd';
import {
  Quote, Edit3, Send, Paperclip, Image, Link as LinkIcon,
  Bold, Italic, List, ListOrdered
} from 'lucide-react';
import {
  getConversationDetail,
  getConversationMessages,
  sendMessage,
  sendMessageWithAttachment,
} from '@/services/messageService';
import { ip3 } from '@/utils/ip';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!conversationId || (!replyText.trim() && !selectedFile)) {
      antMessage.warning('Vui lòng nhập nội dung phản hồi hoặc chọn tệp đính kèm');
      return;
    }
    try {
      setSending(true);
      if (selectedFile) {
        await sendMessageWithAttachment(conversationId, selectedFile, replyText.trim());
      } else {
        await sendMessage(conversationId, replyText.trim());
      }
      antMessage.success('Đã gửi phản hồi thành công!');
      setReplyText('');
      setSelectedFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const insertText = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + (selected || 'văn bản') + after + text.substring(end);
    setReplyText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected ? selected.length : 'văn bản'.length));
    }, 0);
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Very simple parsing for **bold** and *italic*
      let html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  const getOtherParticipant = () => {
    const participants = conversation?.participants || [];
    return participants.find((p: any) => p.id !== currentUserId) || participants[0];
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return isToday ? `Hôm nay, ${timeStr}` : `${date.toLocaleDateString('vi-VN')} ${timeStr}`;
  };

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const other = getOtherParticipant();
  const avatarLetter = (other?.full_name || 'K')[0].toUpperCase();

  // Tách tin nhắn: tin nhắn từ khách (không phải mình) vs tin nhắn mình gửi
  const customerMessages = messages.filter((m) => m.sender?.id !== currentUserId);

  // Lấy tin nhắn đầu tiên của khách làm "câu hỏi"
  const firstQuestion = customerMessages.length > 0 ? customerMessages[0] : null;

  return (
    <div className={styles.page}>
      
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Chi tiết tư vấn</h1>
          <p className={styles.subtitle}>Manage and respond to customer inquiries.</p>
        </div>
        <button className={styles.btnBack} onClick={() => history.push('/bac-si/tu-van')}>
          ← Back to List
        </button>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Column: Messages History */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            
            <div className={styles.customerInfo}>
              <div className={styles.avatar}>{avatarLetter}</div>
              <div className={styles.infoText}>
                <div className={styles.name}>{other?.full_name || 'Khách hàng'}</div>
                <div className={styles.badge}>Khách hàng</div>
              </div>
            </div>

            <div className={styles.messageSection}>
              <div className={styles.label}>TIN NHẮN CỦA KHÁCH</div>
              
                <div className={styles.bubble}>
                  <Quote size={20} className={styles.quoteIcon} />
                  <div>
                    {firstQuestion.message_type === 'image' && firstQuestion.attachments?.[0]?.file_url ? (
                      <div style={{ marginBottom: 8 }}>
                        <img src={`${ip3}${firstQuestion.attachments[0].file_url.replace(/^\//, '')}`} alt="attachment" style={{ maxWidth: 200, borderRadius: 8 }} />
                      </div>
                    ) : firstQuestion.message_type === 'file' && firstQuestion.attachments?.[0]?.file_url ? (
                      <div style={{ marginBottom: 8 }}>
                        <a href={`${ip3}${firstQuestion.attachments[0].file_url.replace(/^\//, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.05)', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}>
                            <Paperclip size={16} /> {firstQuestion.attachments[0].file_name || 'Tải tệp đính kèm'}
                        </a>
                      </div>
                    ) : null}
                    {renderContent(firstQuestion.content)}
                  </div>
                  <div className={styles.time}>{formatTime(firstQuestion.created_at)}</div>
                </div>
              ) : (
                <div style={{ fontStyle: 'italic', color: '#999', fontSize: 13 }}>Khách hàng chưa gửi tin nhắn nào.</div>
              )}
            </div>

            {/* All remaining messages (History) */}
            {messages.length > 1 && (
              <div className={styles.historySection}>
                <div className={styles.historyLabel}>Lịch sử trao đổi</div>
                <div className={styles.historyList}>
                  {messages.map((msg) => {
                    const isMe = msg.sender?.id === currentUserId;
                    // Bỏ qua tin nhắn đầu tiên của khách đã hiện ở trên
                    if (msg.id === firstQuestion?.id) return null;

                    return (
                      <div key={msg.id} className={`${styles.historyItem} ${isMe ? styles.mine : styles.theirs}`}>
                        <div className={styles.historyMeta}>
                          {msg.sender?.full_name} · {formatTime(msg.created_at)}
                        </div>
                        <div>
                          {msg.message_type === 'image' && msg.attachments?.[0]?.file_url ? (
                            <div style={{ marginBottom: 8 }}>
                              <img src={`${ip3}${msg.attachments[0].file_url.replace(/^\//, '')}`} alt="attachment" style={{ maxWidth: 200, borderRadius: 8 }} />
                            </div>
                          ) : msg.message_type === 'file' && msg.attachments?.[0]?.file_url ? (
                            <div style={{ marginBottom: 8 }}>
                              <a href={`${ip3}${msg.attachments[0].file_url.replace(/^\//, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.05)', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}>
                                  <Paperclip size={16} /> {msg.attachments[0].file_name || 'Tải tệp đính kèm'}
                              </a>
                            </div>
                          ) : null}
                          {renderContent(msg.content)}
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
          <div className={styles.card}>
            <div className={styles.editorHeader}>
              <h3><Edit3 size={20} /> Soạn thảo phản hồi</h3>
            </div>

            <div className={styles.toolbar}>
              <button onClick={() => insertText('**', '**')} title="In đậm"><Bold size={16} /></button>
              <button onClick={() => insertText('*', '*')} title="In nghiêng"><Italic size={16} /></button>
              <button onClick={() => insertText('\n- ', '')} title="Danh sách"><List size={16} /></button>
              <button onClick={() => insertText('\n1. ', '')} title="Danh sách số"><ListOrdered size={16} /></button>
              <button onClick={() => fileInputRef.current?.click()} title="Đính kèm tệp"><Paperclip size={16} /></button>
              <button onClick={() => fileInputRef.current?.click()} title="Thêm ảnh"><Image size={16} /></button>
              <button onClick={() => insertText('[', '](url)')} title="Chèn link"><LinkIcon size={16} /></button>
              <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
            </div>

            {selectedFile && (
              <div style={{ padding: '8px 16px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#666' }}>📎 {selectedFile.name}</span>
                <span style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }} onClick={() => setSelectedFile(null)}>X</span>
              </div>
            )}

            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Nhập nội dung phản hồi tại đây..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            <div className={styles.editorFooter}>
              <button className={styles.btnCancel} onClick={() => history.push('/bac-si/tu-van')}>
                Hủy
              </button>
              <button
                className={styles.btnSend}
                onClick={handleSend}
                disabled={sending || !replyText.trim()}
              >
                {sending ? <Spin size="small" /> : <Send size={16} />} Gửi phản hồi
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PhanHoi;
