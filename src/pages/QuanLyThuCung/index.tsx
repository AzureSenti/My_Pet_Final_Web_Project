import React, { useState, useMemo } from 'react';
import { Search, Plus, PawPrint } from 'lucide-react';
import '../TrangChu/components/style.less';
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

	const filteredPets = useMemo(() => {
		if (activeFilter === 'Tất cả') return MOCK_PETS;
		return MOCK_PETS.filter((p) => p.species === activeFilter);
	}, [activeFilter]);

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
					<div className="pc-user-profile">
						<div className="pc-user-avatar">
							<img src="https://i.pravatar.cc/150?img=12" alt="User" />
						</div>
						<div className="pc-user-info">
							<span className="pc-user-name">Nguyễn Văn A</span>
							<span className="pc-user-role">Administrator</span>
						</div>
					</div>
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
					<div className="pet-card-add">
						<div className="add-circle">
							<Plus size={28} strokeWidth={2.5} />
						</div>
						<span className="add-title">Thêm Thú Cưng Mới</span>
						<span className="add-desc">Đăng ký thú cưng mới vào cơ sở dữ liệu</span>
					</div>
				</div>
			</div>

			{/* ─── FAB ─── */}
			<button className="pet-fab" aria-label="Thêm thú cưng">
				<Plus size={26} strokeWidth={3} />
			</button>
		</div>
	);
};

export default QuanLyThuCung;
