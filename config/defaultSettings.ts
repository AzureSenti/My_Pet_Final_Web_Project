import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
	pwa?: boolean;
	logo?: string;
	borderRadiusBase: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	primaryColor: process.env.APP_CONFIG_PRIMARY_COLOR,
	borderRadiusBase: '12px',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: false,
	title: 'MyPet',
	pwa: false,
	logo: 'https://cdn-icons-png.flaticon.com/512/3565/3565860.png',
	iconfontUrl: '',
	headerTheme: 'light',
	headerHeight: 56,
	siderWidth: 200,
};

export default Settings;
