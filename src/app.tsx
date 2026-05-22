import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { LayoutDashboard, Users, Stethoscope, Cat, CalendarDays, LogOut, Plus, PawPrint } from 'lucide-react';
// currentRole đã được loại bỏ cùng với Keycloak auth

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: false,
		currentUser: {
			sub: 'mock-id-123',
			ssoId: 'mock-id-123',
			email: 'admin@gmail.com',
			email_verified: true,
			realm_access: {
				roles: ['admin'],
			},
			name: 'Admin Mock',
			preferred_username: 'admin',
			given_name: 'Admin',
			family_name: 'Mock',
			picture: 'https://i.pravatar.cc/150?img=12',
		},
	};
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
	errorHandler: (error: ResponseError) => {
		const { messages } = getIntl(getLocale());
		const { response } = error;

		if (response && response.status) {
			const { status, statusText, url } = response;
			const requestErrorMessage = messages['app.request.error'];
			const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
			const errorDescription = messages[`app.request.${status}`] || statusText;
			notification.error({
				message: errorMessage,
				description: errorDescription,
			});
		}

		if (!response) {
			notification.error({
				description: 'Yêu cầu gặp lỗi',
				message: 'Bạn hãy thử lại sau',
			});
		}
		throw error;
	},
	requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<NotAccessible />
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,

		onPageChange: () => {
			// Redirect / về /dashboard nếu đã đăng nhập
			if (initialState?.currentUser) {
				const { location } = history;
				if (location.pathname === '/') {
					history.replace('/dashboard');
				}
			}
		},

		menuItemRender: (item, dom) => {
			const active = history.location.pathname === item.path;
			const getLucideIcon = (path: string) => {
				switch(path) {
					case '/dashboard': return <LayoutDashboard size={18} strokeWidth={1.75} />;
					case '/quan-ly-nguoi-dung': return <Users size={18} strokeWidth={1.75} />;
					case '/quan-ly-bac-si': return <Stethoscope size={18} strokeWidth={1.75} />;
					case '/quan-ly-thu-cung': return <Cat size={18} strokeWidth={1.75} />;
					case '/appointments': return <CalendarDays size={18} strokeWidth={1.75} />;
					default: return null;
				}
			};

			return (
				<a
					className={`pc-menu-item ${active ? 'active' : ''}`}
					key={item?.path}
					href={item?.path}
					onClick={(e) => {
						e.preventDefault();
						history.push(item?.path ?? '/');
					}}
				>
					{getLucideIcon(item.path || '')}
					<span className="pc-menu-title">{item.name}</span>
				</a>
			);
		},

		childrenRender: (dom) => (
			<OIDCBounder>
				<ErrorBoundary>
					{dom}
				</ErrorBoundary>
			</OIDCBounder>
		),
		menuHeaderRender: (logo, title) => (
			<div 
				style={{ 
					display: 'flex', 
					alignItems: 'center', 
					height: '48px', 
					marginTop: '32px', 
					paddingLeft: '24px',
					gap: '12px',
					cursor: 'pointer',
				}}
			>
				<div 
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: 'linear-gradient(135deg, #D4AF37 0%, #F3D573 100%)',
						borderRadius: '12px',
						width: '36px',
						height: '36px',
						color: '#FFFFFF',
						boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
					}}
				>
					<PawPrint size={20} strokeWidth={2.5} />
				</div>
				<h2 
					style={{ 
						fontSize: '26px', 
						fontWeight: 900, 
						margin: 0, 
						letterSpacing: '-0.5px',
						background: 'linear-gradient(90deg, #1A1A1A 0%, #4A4A4A 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}
				>
					Pet<span style={{ color: '#D4AF37', WebkitTextFillColor: '#D4AF37' }}>Care</span>
				</h2>
			</div>
		),
		menuFooterRender: (props: any) => {
			if (props?.collapsed) return undefined;
			const handleLogout = () => {
				localStorage.removeItem('token');
				localStorage.removeItem('currentUser');
				history.replace('/user/login');
			};
			return (
				<div style={{ padding: '0 16px 24px' }}>
					<div className="sidebar-footer-menu" style={{ padding: '0 8px' }}>
						<button 
							type="button" 
							className="sidebar-footer-item logout" 
							onClick={handleLogout}
							style={{ 
								display: 'flex', alignItems: 'center', gap: '12px', 
								width: '100%', background: 'transparent', border: 'none', 
								color: '#1A1A1A', fontWeight: 500, fontSize: '14px', cursor: 'pointer',
								padding: '8px 0', opacity: 0.7, transition: 'all 0.2s'
							}}
							onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
							onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
						>
							<LogOut size={18} strokeWidth={1.75} /> Đăng xuất
						</button>
					</div>
				</div>
			);
		},
		...initialState?.settings,
	};
};
