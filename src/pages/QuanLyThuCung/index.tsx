import React, { useState, useMemo } from 'react';
import { Search, Plus, PawPrint } from 'lucide-react';
import { Modal, Form, Input, Select, message } from 'antd';
import '../TrangChu/components/style.less';
import HeaderProfile from '@/components/HeaderProfile';
import './style.less';

interface PetData {
	id: string;
	name: string;
	species: 'Chó' | 'Mèo' | 'Khác';
	breed: string;
	age: string;
	gender: 'male' | 'female';
	health: 'Khỏe mạnh' | 'Đến lịch khám' | 'Khẩn cấp' | 'Mới nhập';
	imageUrl: string;
	ownerName: string;
	ownerAvatar: string;
}

const MOCK_PETS: PetData[] = [
	{
		id: '1',
		name: 'Buddy',
		species: 'Chó',
		breed: 'Golden Retriever',
		age: '3 năm tuổi',
		gender: 'male',
		health: 'Khỏe mạnh',
		imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400',
		ownerName: 'Sarah Johnson',
		ownerAvatar: 'https://i.pravatar.cc/150?u=sarah',
	},
	{
		id: '2',
		name: 'Luna',
		species: 'Mèo',
		breed: 'Anh lông ngắn',
		age: '2 năm tuổi',
		gender: 'female',
		health: 'Đến lịch khám',
		imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400',
		ownerName: 'Michael Chen',
		ownerAvatar: 'https://i.pravatar.cc/150?u=michael',
	},
	{
		id: '3',
		name: 'Oliver',
		species: 'Chó',
		breed: 'French Bulldog',
		age: '5 năm tuổi',
		gender: 'male',
		health: 'Khỏe mạnh',
		imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400&h=400',
		ownerName: 'Emily White',
		ownerAvatar: 'https://i.pravatar.cc/150?u=emily',
	},
	{
		id: '4',
		name: 'Cooper',
		species: 'Chó',
		breed: 'Siberian Husky',
		age: '1 năm tuổi',
		gender: 'female',
		health: 'Mới nhập',
		imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=400&h=400',
		ownerName: 'David Wilson',
		ownerAvatar: 'https://i.pravatar.cc/150?u=david',
	},
	{
		id: '5',
		name: 'Misty',
		species: 'Mèo',
		breed: 'Mèo Calico',
		age: '4 năm tuổi',
		gender: 'female',
		health: 'Khỏe mạnh',
		imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=400&h=400',
		ownerName: 'Anna Lee',
		ownerAvatar: 'https://i.pravatar.cc/150?u=anna',
	},
	{
		id: '6',
		name: 'Nala',
		species: 'Chó',
		breed: 'Welsh Corgi',
		age: '6 năm tuổi',
		gender: 'female',
		health: 'Khẩn cấp',
		imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400&h=400',
		ownerName: 'James Park',
		ownerAvatar: 'https://i.pravatar.cc/150?u=james',
	},
];

const FILTER_TABS = ['Tất cả', 'Chó', 'Mèo', 'Khác'] as const;

const QuanLyThuCung: React.FC = () => {
	const [activeFilter, setActiveFilter] = useState<string>('Tất cả');
	const [pets, setPets] = useState<PetData[]>(MOCK_PETS);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const handleAddPet = (values: any) => {
		const newPet: PetData = {
			id: String(pets.length + 1),
			name: values.name,
			species: values.species,
			breed: values.breed,
			age: `${values.age} tuổi`,
			gender: values.gender,
			health: values.health || 'Khỏe mạnh',
			imageUrl: values.imageUrl || `https://images.unsplash.com/photo-${[
				'1543466835-00a7907e9de1',
				'1514888286974-6c03e2ca1dba',
				'1583511655857-d19b40a7a54e',
				'1605568427561-40dd23c2acea'
			][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=400&h=400`,
			ownerName: values.ownerName,
			ownerAvatar: `https://i.pravatar.cc/150?u=${values.ownerName.toLowerCase().replace(/\s+/g, '')}`
		};
		setPets([...pets, newPet]);
		setIsModalOpen(false);
		form.resetFields();
		message.success('Thêm thú cưng mới thành công!');
	};

	const filteredPets = useMemo(() => {
		if (activeFilter === 'Tất cả') return pets;
		return pets.filter((p) => p.species === activeFilter);
	}, [activeFilter, pets]);

	const getHealthBadgeClass = (health: PetData['health']) => {
		switch (health) {
			case 'Khỏe mạnh': return 'badge-healthy';
			case 'Đến lịch khám': return 'badge-checkup';
			case 'Khẩn cấp': return 'badge-urgent';
			case 'Mới nhập': return 'badge-new';
			default: return 'badge-healthy';
		}
	};

	return (
		<div className="petcare-dashboard">
			{/* ─── Top Header Bar ─── */}
			<div className="pc-header">
				<div className="pc-header-left" />
				<div className="pc-header-center">
					<div className="pc-header-search">
						<Search size={18} strokeWidth={1.75} className="search-icon" />
						<input type="text" placeholder="Tìm kiếm thú cưng..." />
					</div>
				</div>
				<div className="pc-header-actions">
					<HeaderProfile />
				</div>
			</div>

			{/* ─── Page Content ─── */}
			<div className="pet-page-content">
				{/* ─── Page Title + Filter Row ─── */}
				<div className="pet-title-row">
					<div className="pet-title-left">
						<div className="pet-title-icon">
							<PawPrint size={22} strokeWidth={2.5} />
						</div>
						<div>
							<h1>Quản Lý Thú Cưng</h1>
							<p className="pet-subtitle">
								Tra cứu hồ sơ thú cưng, thông tin chủ nuôi và lịch sử bệnh án
							</p>
						</div>
					</div>
					<div className="pet-filter-pills">
						{FILTER_TABS.map((tab) => (
							<button
								key={tab}
								className={`filter-pill ${activeFilter === tab ? 'active' : ''}`}
								onClick={() => setActiveFilter(tab)}
							>
								{tab}
							</button>
						))}
					</div>
				</div>

				{/* ─── Pet Card Grid ─── */}
				<div className="pet-card-grid">
					{filteredPets.map((pet, idx) => (
						<div
							className="pet-card"
							key={pet.id}
							style={{ animationDelay: `${idx * 0.06}s` }}
						>
							{/* Photo */}
							<div className="pet-card-photo">
								<img src={pet.imageUrl} alt={pet.name} />
								<span className={`health-badge ${getHealthBadgeClass(pet.health)}`}>
									{pet.health}
								</span>
							</div>

							{/* Info */}
							<div className="pet-card-body">
								<div className="pet-name-row">
									<span className="pet-name">{pet.name}</span>
									<span className={`gender-icon ${pet.gender === 'male' ? 'male' : 'female'}`}>
										{pet.gender === 'male' ? '♂' : '♀'}
									</span>
								</div>
								<span className="pet-breed">{pet.breed} • {pet.age}</span>

								{/* Owner */}
								<div className="pet-owner-row">
									<img className="owner-avatar" src={pet.ownerAvatar} alt={pet.ownerName} />
									<div className="owner-text">
										<span className="owner-label">Chủ nuôi</span>
										<span className="owner-name">{pet.ownerName}</span>
									</div>
								</div>
							</div>
						</div>
					))}

					{/* ─── Add New Card ─── */}
					<div className="pet-card-add" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
						<div className="add-circle">
							<Plus size={28} strokeWidth={2.5} />
						</div>
						<span className="add-title">Thêm Thú Cưng Mới</span>
						<span className="add-desc">Đăng ký thú cưng mới vào cơ sở dữ liệu</span>
					</div>
				</div>
			</div>

			{/* ─── FAB ─── */}
			<button className="pet-fab" aria-label="Thêm thú cưng" onClick={() => setIsModalOpen(true)}>
				<Plus size={26} strokeWidth={3} />
			</button>

			{/* Modal Thêm thú cưng */}
			<Modal
				title={<h3>Đăng ký thú cưng mới 🐶</h3>}
				visible={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				okText="Lưu lại"
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical" onFinish={handleAddPet}>
					<Form.Item
						name="name"
						label="Tên thú cưng"
						rules={[{ required: true, message: 'Vui lòng nhập tên thú cưng!' }]}
					>
						<Input placeholder="Ví dụ: Buddy" />
					</Form.Item>
					<Form.Item
						name="species"
						label="Loài"
						rules={[{ required: true, message: 'Vui lòng chọn loài!' }]}
						initialValue="Chó"
					>
						<Select>
							<Select.Option value="Chó">Chó 🐶</Select.Option>
							<Select.Option value="Mèo">Mèo 🐱</Select.Option>
							<Select.Option value="Khác">Khác 🐾</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="breed"
						label="Giống"
						rules={[{ required: true, message: 'Vui lòng nhập giống thú cưng!' }]}
					>
						<Input placeholder="Ví dụ: Golden Retriever, Anh lông ngắn" />
					</Form.Item>
					<Form.Item
						name="age"
						label="Tuổi (năm)"
						rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
					>
						<Input type="number" placeholder="Ví dụ: 3" min={0} />
					</Form.Item>
					<Form.Item
						name="gender"
						label="Giới tính"
						rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
						initialValue="male"
					>
						<Select>
							<Select.Option value="male">Đực (♂)</Select.Option>
							<Select.Option value="female">Cái (♀)</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="health"
						label="Tình trạng sức khỏe"
						initialValue="Khỏe mạnh"
					>
						<Select>
							<Select.Option value="Khỏe mạnh">Khỏe mạnh (Healthy)</Select.Option>
							<Select.Option value="Đến lịch khám">Đến lịch khám (Checkup)</Select.Option>
							<Select.Option value="Khẩn cấp">Khẩn cấp (Urgent)</Select.Option>
							<Select.Option value="Mới nhập">Mới nhập (New)</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="ownerName"
						label="Tên chủ nuôi"
						rules={[{ required: true, message: 'Vui lòng nhập tên chủ nuôi!' }]}
					>
						<Input placeholder="Ví dụ: John Smith" />
					</Form.Item>
					<Form.Item
						name="imageUrl"
						label="Đường dẫn ảnh thú cưng (URL)"
					>
						<Input placeholder="Tùy chọn. Để trống sẽ tự sinh ảnh ngẫu nhiên." />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyThuCung;
