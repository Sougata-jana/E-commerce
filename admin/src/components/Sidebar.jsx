import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

// Minimal inline icons
const AddIcon = () => (
	<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 5v14M5 12h14" />
	</svg>
);
const ListIcon = () => (
	<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
	</svg>
);
const OrderIcon = () => (
	<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
		<path d="M13 2v7h7" />
	</svg>
);
const LogoutIcon = () => (
	<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		<path d="M16 17l5-5-5-5" />
		<path d="M21 12H9" />
	</svg>
);
const MenuIcon = () => (
	<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 6h18M3 12h18M3 18h18" />
	</svg>
);
const CloseIcon = () => (
	<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
);

const MENU = [
	{ to: '/add', label: 'Add Products', Icon: AddIcon },
	{ to: '/list', label: 'List Products', Icon: ListIcon },
	{ to: '/orders', label: 'Manage Orders', Icon: OrderIcon },
];

function SidebarContent({ onNavigate }) {
	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
				<img src={assets?.Logo} alt="Logo" className="h-8 w-8 rounded" />
				<div>
					<p className="text-sm font-semibold">Admin Panel</p>
					<p className="text-[11px] text-gray-400 -mt-0.5">Dashboard</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="px-3 py-3">
				<ul className="flex flex-col gap-1">
					{MENU.map(({ to, label, Icon }) => (
						<li key={to}>
							<NavLink
								to={to}
								onClick={onNavigate}
								className={({ isActive }) =>
									`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
										isActive
											? 'bg-white/10 text-white'
											: 'text-gray-300 hover:text-white hover:bg-white/5'
									}`
								}
							>
								<span className="text-gray-300 group-hover:text-white"><Icon /></span>
								<span>{label}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			{/* Footer */}
			<div className="mt-auto border-t border-white/10 px-4 py-3">
				<div className="flex items-center gap-3">
					<img
						src={assets?.profile_image || assets?.Logo}
						alt="Admin"
						className="h-9 w-9 rounded-full object-cover"
					/>
					<div className="min-w-0">
						<p className="text-sm font-semibold">Admin User</p>
						<p className="text-xs text-gray-400 truncate">admin@example.com</p>
					</div>
					<button className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/5" title="Logout" aria-label="Logout">
						<LogoutIcon />
					</button>
				</div>
			</div>
		</div>
	);
}

export default function Sidebar() {
	const [openMobile, setOpenMobile] = useState(false);

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex md:sticky md:top-16 md:self-start h-[calc(100vh-4rem)] w-64 bg-slate-900 text-white border-r border-white/10">
				<SidebarContent />
			</aside>

			{/* Mobile: floating open button */}
			<button
				type="button"
				className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900/95 text-white px-4 py-2 shadow-lg backdrop-blur-sm md:hidden"
				onClick={() => setOpenMobile(true)}
				aria-label="Open sidebar"
			>
				<MenuIcon />
				<span className="text-sm">Menu</span>
			</button>

			{/* Mobile Drawer */}
			{openMobile && (
				<>
					<div
						className="fixed inset-0 z-40 bg-black/40"
						onClick={() => setOpenMobile(false)}
					/>
					<div className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 text-white border-r border-white/10">
						<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
							<div className="flex items-center gap-3">
								<img src={assets?.Logo} alt="Logo" className="h-8 w-8 rounded" />
								<span className="text-sm font-semibold">Admin Panel</span>
							</div>
							<button
								className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/5"
								onClick={() => setOpenMobile(false)}
								aria-label="Close sidebar"
							>
								<CloseIcon />
							</button>
						</div>
						<SidebarContent onNavigate={() => setOpenMobile(false)} />
					</div>
				</>
			)}
		</>
	);
}
