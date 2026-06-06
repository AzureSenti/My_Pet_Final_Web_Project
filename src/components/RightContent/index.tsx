import React from 'react';
import { useModel, history } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';
import { SearchOutlined, BellOutlined, CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Popover, List, Badge, Avatar, Button, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const {
		danhSach,
		getThongBaoModel,
		unread,
		loading,
		readNotificationModel,
		setRecord,
	} = useModel('thongbao.noticeicon');

	useEffect(() => {
		getThongBaoModel();
	}, [initialState?.currentUser]);

	if (!initialState || !initialState.currentUser) {
		return null;
	}

	const handleViewAll = () => {
		const role = initialState?.currentUser?.role;
		if (role === 'vet') history.push('/bac-si/thong-bao');
		else if (role === 'owner') history.push('/khach-hang/thong-bao');
		else history.push('/dashboard'); // Hoặc trang admin thông báo nếu có
	};

	const handleItemClick = (item: any) => {
		readNotificationModel(item._id);
		// Có thể mở modal chi tiết ở đây nếu cần
	};

	const notificationContent = (
		<div className={styles.notificationCard}>
			<div className={styles.notifHeader}>
				<h3>Thông báo</h3>
				{unread > 0 && (
					<Button
						type="link"
						size="small"
						onClick={() => readNotificationModel('ALL')}
						icon={<CheckOutlined />}
					>
						Đánh dấu đã đọc
					</Button>
				)}
			</div>

			<div className={styles.notifList}>
				<Spin spinning={loading}>
					<List
						dataSource={danhSach.slice(0, 5)}
						locale={{
							emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo mới" />
						}}
						renderItem={(item: any) => (
							<List.Item
								className={`${styles.notifItem} ${!item.read ? styles.unread : ''}`}
								onClick={() => handleItemClick(item)}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											style={{ backgroundColor: item.read ? '#F1F5F9' : '#FEF3C7', color: item.read ? '#64748B' : '#F59E0B' }}
											icon={<BellOutlined />}
											size={36}
										/>
									}
									title={<div className={styles.itemTitle}>{item.title}</div>}
									description={
										<div className={styles.itemDesc}>
											<span className={styles.time}>{moment(item.createdAt).calendar()}</span>
											<p>{item.description}</p>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				</Spin>
			</div>

			<div className={styles.notifFooter}>
				<Button type="text" block icon={<RightOutlined />} onClick={handleViewAll}>
					Xem tất cả thông báo
				</Button>
			</div>
		</div>
	);

	return (
		<div className={styles.right}>
			<div className={styles.headerSearch}>
				<SearchOutlined className={styles.searchIcon} />
				<input type="text" placeholder="Tìm kiếm thú cưng, khách hàng..." />
			</div>

			<Popover
				content={notificationContent}
				trigger="click"
				placement="bottomRight"
				overlayClassName={styles.notifPopover}
				arrowPointAtCenter
			>
				<button className={styles.notificationBtn} type="button">
					<Badge dot={unread > 0} offset={[-2, 2]}>
						<BellOutlined />
					</Badge>
				</button>
			</Popover>

			<AvatarDropdown menu />
		</div>
	);
};

export default GlobalHeaderRight;
