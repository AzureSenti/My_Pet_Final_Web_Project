import { message } from 'antd';

// =============================================================================
//  SECTION 1 — INTERFACES & TYPES (Aligned with schema.sql)
// =============================================================================

export interface User {
	id: string;
	full_name: string;
	email: string;
	phone?: string;
	role: 'owner' | 'vet' | 'admin';
	is_active: boolean;
	avatar_url?: string;
	created_at: string;
	last_login_at?: string;
}

export interface Pet {
	id: string;
	owner_id: string;
	name: string;
	species: string; // Chó, Mèo, ...
	breed?: string;
	date_of_birth?: string;
	gender: 'male' | 'female' | 'unknown';
	avatar_url?: string;
	created_at: string;
}

export interface Veterinarian {
	id: string;
	user_id: string;
	specialization: string;
	bio?: string;
	certificate_url?: string;
	is_active: boolean;
}

export interface Appointment {
	id: string;
	owner_id: string;
	pet_id: string;
	vet_id: string; // references veterinarians.id
	service_id: string;
	scheduled_at: string;
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
	notes?: string;
	created_at: string;
}

export interface MedicalRecord {
	id: string;
	appointment_id: string;
	pet_id: string;
	vet_id: string; // references veterinarians.id
	diagnosis: string;
	treatment: string;
	prescription?: string;
	notes?: string;
	recorded_at: string;
}

export interface Payment {
	id: string;
	appointment_id: string;
	owner_id: string;
	amount: number;
	method: 'cash' | 'card' | 'online';
	status: 'pending' | 'paid' | 'refunded';
	transaction_id?: string;
	paid_at?: string;
}

export interface Service {
	id: string;
	name: string;
	description?: string;
	price: number;
	duration_minutes: number;
	is_active: boolean;
}

// =============================================================================
//  SECTION 2 — INITIAL SAMPLE DATA (Aligned with schema.sql)
// =============================================================================

const INITIAL_USERS: User[] = [
	{
		id: 'a0000000-0000-0000-0000-000000000001',
		full_name: 'Nguyen Van Admin',
		email: 'admin@mypet.dev',
		phone: '0901234567',
		role: 'admin',
		is_active: true,
		avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
		created_at: '2026-01-01T08:00:00+07:00',
	},
	{
		id: 'a0000000-0000-0000-0000-000000000002',
		full_name: 'Trần Thị Lan',
		email: 'lan.owner@mypet.dev',
		phone: '0912345678',
		role: 'owner',
		is_active: true,
		avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
		created_at: '2026-03-15T09:30:00+07:00',
		last_login_at: '2026-05-20T10:15:00+07:00',
	},
	{
		id: 'a0000000-0000-0000-0000-000000000003',
		full_name: 'Lê Văn Minh',
		email: 'minh.owner@mypet.dev',
		phone: '0923456789',
		role: 'owner',
		is_active: true,
		avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
		created_at: '2026-04-01T14:00:00+07:00',
		last_login_at: '2026-05-19T16:45:00+07:00',
	},
	{
		id: 'a0000000-0000-0000-0000-000000000004',
		full_name: 'BS. Phạm Thị Hoa',
		email: 'hoa.vet@mypet.dev',
		phone: '0934567890',
		role: 'vet',
		is_active: true,
		avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
		created_at: '2026-02-10T08:30:00+07:00',
		last_login_at: '2026-05-20T08:00:00+07:00',
	},
	{
		id: 'a0000000-0000-0000-0000-000000000005',
		full_name: 'BS. Nguyễn Đức Thanh',
		email: 'thanh.vet@mypet.dev',
		phone: '0945678901',
		role: 'vet',
		is_active: true,
		avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
		created_at: '2026-02-20T10:00:00+07:00',
		last_login_at: '2026-05-19T09:15:00+07:00',
	},
];

const INITIAL_VETERINARIANS: Veterinarian[] = [
	{
		id: 'd0000000-0000-0000-0000-000000000001',
		user_id: 'a0000000-0000-0000-0000-000000000004',
		specialization: 'Nội khoa & Ngoại khoa thú y',
		bio: 'Bác sĩ Hoa có hơn 8 năm kinh nghiệm trong lĩnh vực nội ngoại khoa thú y, chuyên điều trị chó và mèo. Từng tu nghiệp tại Pháp và có nhiều nghiên cứu khoa học về dinh dưỡng thú cưng.',
		certificate_url: 'https://cdn.mypet.dev/certs/hoa_cert.pdf',
		is_active: true,
	},
	{
		id: 'd0000000-0000-0000-0000-000000000002',
		user_id: 'a0000000-0000-0000-0000-000000000005',
		specialization: 'Da liễu & Dinh dưỡng thú y',
		bio: 'Bác sĩ Thanh chuyên về các bệnh lý da liễu phức tạp, dị ứng thời tiết và tư vấn xây dựng khẩu phần ăn tối ưu cho từng giống thú cưng đặc thù.',
		certificate_url: 'https://cdn.mypet.dev/certs/thanh_cert.pdf',
		is_active: true,
	},
];

const INITIAL_PETS: Pet[] = [
	{
		id: 'c0000000-0000-0000-0000-000000000001',
		owner_id: 'a0000000-0000-0000-0000-000000000002',
		name: 'Bông',
		species: 'Chó',
		breed: 'Poodle',
		date_of_birth: '2022-03-15',
		gender: 'female',
		avatar_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200',
		created_at: '2022-05-20T10:00:00+07:00',
	},
	{
		id: 'c0000000-0000-0000-0000-000000000002',
		owner_id: 'a0000000-0000-0000-0000-000000000002',
		name: 'Mochi',
		species: 'Mèo',
		breed: 'Mèo Ta',
		date_of_birth: '2021-07-20',
		gender: 'male',
		avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
		created_at: '2021-09-10T11:00:00+07:00',
	},
	{
		id: 'c0000000-0000-0000-0000-000000000003',
		owner_id: 'a0000000-0000-0000-0000-000000000003',
		name: 'Max',
		species: 'Chó',
		breed: 'Golden Retriever',
		date_of_birth: '2020-01-10',
		gender: 'male',
		avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200',
		created_at: '2020-03-15T09:00:00+07:00',
	},
	{
		id: 'c0000000-0000-0000-0000-000000000004',
		owner_id: 'a0000000-0000-0000-0000-000000000003',
		name: 'Luna',
		species: 'Mèo',
		breed: 'British Shorthair',
		date_of_birth: '2023-05-01',
		gender: 'female',
		avatar_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=200',
		created_at: '2023-07-10T14:30:00+07:00',
	},
];

const INITIAL_SERVICES: Service[] = [
	{
		id: 'e0000000-0000-0000-0000-000000000001',
		name: 'Khám tổng quát',
		description: 'Kiểm tra sức khỏe toàn diện: tim, phổi, da lông, cân nặng',
		price: 150000,
		duration_minutes: 30,
		is_active: true,
	},
	{
		id: 'e0000000-0000-0000-0000-000000000002',
		name: 'Tiêm phòng',
		description: 'Tiêm vaccine định kỳ theo lịch khuyến nghị',
		price: 200000,
		duration_minutes: 20,
		is_active: true,
	},
	{
		id: 'e0000000-0000-0000-0000-000000000003',
		name: 'Tắm & Grooming',
		description: 'Tắm, sấy, cắt tỉa lông và vệ sinh tai móng chuyên nghiệp',
		price: 250000,
		duration_minutes: 60,
		is_active: true,
	},
	{
		id: 'e0000000-0000-0000-0000-000000000004',
		name: 'Xét nghiệm máu',
		description: 'Tổng phân tích tế bào máu và sinh hóa máu cơ bản để chẩn đoán sâu',
		price: 500000,
		duration_minutes: 45,
		is_active: true,
	},
	{
		id: 'e0000000-0000-0000-0000-000000000005',
		name: 'Siêu âm',
		description: 'Siêu âm ổ bụng chẩn đoán hình ảnh các bệnh nội tạng',
		price: 400000,
		duration_minutes: 40,
		is_active: true,
	},
];

const INITIAL_APPOINTMENTS: Appointment[] = [
	{
		id: 'aa000000-0000-0000-0000-000000000001',
		owner_id: 'a0000000-0000-0000-0000-000000000002',
		pet_id: 'c0000000-0000-0000-0000-000000000001', // Bông
		vet_id: 'd0000000-0000-0000-0000-000000000001', // BS. Hoa
		service_id: 'e0000000-0000-0000-0000-000000000001', // Khám tổng quát
		scheduled_at: '2026-05-22T09:00:00+07:00',
		status: 'confirmed',
		notes: 'Bông bị ho 3 ngày, biếng ăn và hơi lờ đờ.',
		created_at: '2026-05-19T10:00:00+07:00',
	},
	{
		id: 'aa000000-0000-0000-0000-000000000002',
		owner_id: 'a0000000-0000-0000-0000-000000000002',
		pet_id: 'c0000000-0000-0000-0000-000000000002', // Mochi
		vet_id: 'd0000000-0000-0000-0000-000000000002', // BS. Thanh
		service_id: 'e0000000-0000-0000-0000-000000000002', // Tiêm phòng
		scheduled_at: '2026-05-23T10:30:00+07:00',
		status: 'pending',
		notes: 'Tiêm nhắc lại mũi 3 bệnh dại và bệnh truyền nhiễm.',
		created_at: '2026-05-20T08:30:00+07:00',
	},
	{
		id: 'aa000000-0000-0000-0000-000000000003',
		owner_id: 'a0000000-0000-0000-0000-000000000003',
		pet_id: 'c0000000-0000-0000-0000-000000000003', // Max
		vet_id: 'd0000000-0000-0000-0000-000000000001', // BS. Hoa
		service_id: 'e0000000-0000-0000-0000-000000000004', // Xét nghiệm máu
		scheduled_at: '2026-05-20T14:00:00+07:00',
		status: 'completed',
		notes: 'Kiểm tra sức khỏe định kỳ 6 tháng một lần.',
		created_at: '2026-05-18T15:00:00+07:00',
	},
	{
		id: 'aa000000-0000-0000-0000-000000000004',
		owner_id: 'a0000000-0000-0000-0000-000000000003',
		pet_id: 'c0000000-0000-0000-0000-000000000004', // Luna
		vet_id: 'd0000000-0000-0000-0000-000000000002', // BS. Thanh
		service_id: 'e0000000-0000-0000-0000-000000000003', // Tắm & Grooming
		scheduled_at: '2026-05-18T11:00:00+07:00',
		status: 'completed',
		notes: 'Cắt tỉa tạo kiểu lông gấu bông, tắm khử mùi hương lavender.',
		created_at: '2026-05-17T09:00:00+07:00',
	},
	{
		id: 'aa000000-0000-0000-0000-000000000005',
		owner_id: 'a0000000-0000-0000-0000-000000000002',
		pet_id: 'c0000000-0000-0000-0000-000000000001', // Bông
		vet_id: 'd0000000-0000-0000-0000-000000000001', // BS. Hoa
		service_id: 'e0000000-0000-0000-0000-000000000005', // Siêu âm
		scheduled_at: '2026-05-10T09:30:00+07:00',
		status: 'cancelled',
		notes: 'Chủ huỷ lịch vì bận việc gia đình đột xuất.',
		created_at: '2026-05-09T08:00:00+07:00',
	},
];

const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
	{
		id: 'bb000000-0000-0000-0000-000000000001',
		appointment_id: 'aa000000-0000-0000-0000-000000000003', // Max - xét nghiệm máu
		pet_id: 'c0000000-0000-0000-0000-000000000003',
		vet_id: 'd0000000-0000-0000-0000-000000000001',
		diagnosis: 'Sức khỏe tổng thể tốt. Tuy nhiên chỉ số hồng cầu hơi thấp dưới mức trung bình nhẹ.',
		treatment: 'Bổ sung sắt, tăng cường protein trong bữa ăn hàng ngày và uống vitamin B12.',
		prescription: 'Ferrovet 1 viên/ngày uống sau ăn (liệu trình 30 ngày)',
		notes: 'Cần tái khám sau 4 tuần để làm xét nghiệm máu kiểm tra lại chỉ số hồng cầu.',
		recorded_at: '2026-05-20T14:45:00+07:00',
	},
	{
		id: 'bb000000-0000-0000-0000-000000000002',
		appointment_id: 'aa000000-0000-0000-0000-000000000004', // Luna - grooming
		pet_id: 'c0000000-0000-0000-0000-000000000004',
		vet_id: 'd0000000-0000-0000-0000-000000000002',
		diagnosis: 'Mèo khỏe mạnh hoàn toàn. Da sạch không ve rận hay nấm da, lông mượt sau khi grooming.',
		treatment: 'Không cần điều trị y khoa. Chăm sóc vệ sinh định kỳ.',
		prescription: 'Không có đơn thuốc.',
		notes: 'Nên duy trì dịch vụ Grooming tắm sấy cắt móng định kỳ mỗi 6 tuần để bảo vệ sức khỏe da lông.',
		recorded_at: '2026-05-18T12:00:00+07:00',
	},
];

const INITIAL_PAYMENTS: Payment[] = [
	{
		id: 'cc000000-0000-0000-0000-000000000001',
		appointment_id: 'aa000000-0000-0000-0000-000000000003', // Max - xét nghiệm
		owner_id: 'a0000000-0000-0000-0000-000000000003',
		amount: 500000,
		method: 'card',
		status: 'paid',
		transaction_id: 'TXN-2026052000001',
		paid_at: '2026-05-20T14:45:00+07:00',
	},
	{
		id: 'cc000000-0000-0000-0000-000000000002',
		appointment_id: 'aa000000-0000-0000-0000-000000000004', // Luna - grooming
		owner_id: 'a0000000-0000-0000-0000-000000000003',
		amount: 250000,
		method: 'cash',
		status: 'paid',
		paid_at: '2026-05-18T12:00:00+07:00',
	},
	{
		id: 'cc000000-0000-0000-0000-000000000003',
		appointment_id: 'aa000000-0000-0000-0000-000000000001', // Bông - khám tổng quát sắp tới
		owner_id: 'a0000000-0000-0000-0000-000000000002',
		amount: 150000,
		method: 'online',
		status: 'pending',
	},
];

// =============================================================================
//  SECTION 3 — HELPER STORAGE INTERFACES
// =============================================================================

function getStorageItem<T>(key: string, initialData: T[]): T[] {
	if (typeof window === 'undefined') return initialData;
	const data = localStorage.getItem(`mypet_${key}`);
	if (!data) {
		localStorage.setItem(`mypet_${key}`, JSON.stringify(initialData));
		return initialData;
	}
	return JSON.parse(data);
}

function setStorageItem<T>(key: string, data: T[]): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(`mypet_${key}`, JSON.stringify(data));
	}
}

// =============================================================================
//  SECTION 4 — EXPORTED SERVICE FUNCTIONS (Promise-based for Easy API Swapping)
// =============================================================================

import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

// ... (giữ lại các interfaces)

// --- DASHBOARD SERVICES ---

export const getDashboardStats = async (): Promise<any> => {
	const res = await axios.get(`${ip3}api/v1/admin/dashboard/stats`);
	return res.data;
};

// --- USER (OWNER) SERVICES ---

export const getOwners = async (): Promise<User[]> => {
	// Gọi API lấy danh sách user filter theo role owner
	const res = await axios.get(`${ip3}api/v1/admin/users`, {
		params: { role: 'owner', limit: 100 }
	});
	return res.data.items; // items từ backend schema
};

export const toggleUserStatus = async (id: string, active: boolean): Promise<boolean> => {
	const endpoint = active ? 'unlock' : 'lock';
	try {
		await axios.patch(`${ip3}api/v1/admin/users/${id}/${endpoint}`);
		message.success(active ? 'Đã mở khóa tài khoản thành công!' : 'Đã khóa tài khoản thành công!');
		return true;
	} catch (error) {
		message.error('Thực hiện thao tác thất bại!');
		return false;
	}
};

export const getOwnerDetails = async (ownerId: string): Promise<{
	user: User | null;
	pets: Pet[];
	appointments: (Appointment & { pet_name: string; service_name: string; vet_name: string })[];
	payments: (Payment & { service_name: string })[];
}> => {
	const users = getStorageItem<User>('users', INITIAL_USERS);
	const pets = getStorageItem<Pet>('pets', INITIAL_PETS);
	const appointments = getStorageItem<Appointment>('appointments', INITIAL_APPOINTMENTS);
	const payments = getStorageItem<Payment>('payments', INITIAL_PAYMENTS);
	const services = getStorageItem<Service>('services', INITIAL_SERVICES);

	const user = users.find((u) => u.id === ownerId && u.role === 'owner') || null;
	const ownerPets = pets.filter((p) => p.owner_id === ownerId);

	// Get appointment detail with rich information
	const ownerAppointments = appointments
		.filter((a) => a.owner_id === ownerId)
		.map((a) => {
			const pet = pets.find((p) => p.id === a.pet_id);
			const service = services.find((s) => s.id === a.service_id);
			const vetUser = users.find((u) => {
				const veterinarians = getStorageItem<Veterinarian>('veterinarians', INITIAL_VETERINARIANS);
				const vet = veterinarians.find((v) => v.id === a.vet_id);
				return u.id === vet?.user_id;
			});
			return {
				...a,
				pet_name: pet ? pet.name : 'Không rõ',
				service_name: service ? service.name : 'Dịch vụ lẻ',
				vet_name: vetUser ? vetUser.full_name : 'Bác sĩ trực ban',
			};
		});

	// Get payment details
	const ownerPayments = payments
		.filter((pay) => pay.owner_id === ownerId)
		.map((pay) => {
			const app = appointments.find((a) => a.id === pay.appointment_id);
			const service = services.find((s) => s?.id === app?.service_id);
			return {
				...pay,
				service_name: service ? service.name : 'Thanh toán dịch vụ',
			};
		});

	return {
		user,
		pets: ownerPets,
		appointments: ownerAppointments,
		payments: ownerPayments,
	};
};

// --- PET (VETERINARY MEDICAL PROFILE) SERVICES ---

export const getPets = async (filters?: { searchPet?: string; species?: string }): Promise<any[]> => {
	const res = await axios.get(`${ip3}api/v1/admin/pets`, {
		params: {
			search: filters?.searchPet,
			species: filters?.species === 'ALL' ? undefined : filters?.species,
			limit: 100
		}
	});

	// Backend trả về items có sẵn object owner
	return res.data.items.map((p: any) => ({
		...p,
		owner_name: p.owner?.full_name || 'Không rõ',
		owner_email: p.owner?.email || '',
		owner_phone: p.owner?.phone || '',
	}));
};

export const getPetMedicalRecords = async (petId: string): Promise<any> => {
	// Hiện tại mới chỉ có API xem chi tiết Pet, chưa có API xem hồ sơ bệnh án riêng.
	// Tôi sẽ gọi tạm API chi tiết để lấy thông tin Pet.
	const res = await axios.get(`${ip3}api/v1/admin/pets/${petId}`);
	return {
		pet: res.data,
		owner: res.data.owner,
		records: [] // Phần này sẽ bổ sung khi xây dựng module Medical Records ở Backend
	};
};

// --- VET / DOCTOR SERVICES ---

export const getDoctors = async (): Promise<any[]> => {
	const res = await axios.get(`${ip3}api/v1/admin/vets`, { params: { limit: 100 } });
	return res.data.items.map((v: any) => ({
		...v.user,
		vet_id: v.id,
		specialization: v.specialization,
		bio: v.bio,
		certificate_url: v.certificate_url,
		is_active: v.is_active
	}));
};

export const createDoctor = async (data: any): Promise<boolean> => {
	try {
		await axios.post(`${ip3}api/v1/admin/vets`, data);
		message.success('Thêm bác sĩ thú y mới thành công!');
		return true;
	} catch (error) {
		return false;
	}
};

export const updateDoctor = async (vetId: string, data: any): Promise<boolean> => {
	try {
		await axios.put(`${ip3}api/v1/admin/vets/${vetId}`, data);
		message.success('Cập nhật thông tin bác sĩ thành công!');
		return true;
	} catch (error) {
		return false;
	}
};

export const deleteDoctor = async (vetId: string): Promise<boolean> => {
	try {
		await axios.delete(`${ip3}api/v1/admin/vets/${vetId}`);
		message.success('Đã xóa bác sĩ khỏi hệ thống!');
		return true;
	} catch (error) {
		return false;
	}
};

export const toggleDoctorStatus = async (vetId: string): Promise<boolean> => {
	try {
		await axios.patch(`${ip3}api/v1/admin/vets/${vetId}/toggle`);
		message.success('Đã thay đổi trạng thái hoạt động của bác sĩ!');
		return true;
	} catch (error) {
		return false;
	}
};
