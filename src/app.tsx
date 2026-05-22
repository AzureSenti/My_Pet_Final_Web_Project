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

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => (
			<OIDCBounder>
				<ErrorBoundary>
					{dom}
				</ErrorBoundary>
			</OIDCBounder>
		),
		menuHeaderRender: undefined,
		menuFooterRender: (props: any) => {
			if (props?.collapsed) return undefined;
			const handleLogout = () => {
				localStorage.removeItem('token');
				localStorage.removeItem('currentUser');
				history.replace('/user/login');
			};
			return (
				<div style={{ padding: '0 12px 12px' }}>

					<div className="sidebar-footer-menu">
						<button type="button" className="sidebar-footer-item logout" onClick={handleLogout}>
							<span>🚪</span> Đăng xuất
						</button>
					</div>
				</div>
			);
		},
		...initialState?.settings,
	};
};
