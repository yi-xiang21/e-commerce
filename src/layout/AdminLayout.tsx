import { Outlet } from 'react-router-dom'
import Sildebar from '@/component/Sildebar'
import { useState } from 'react'
const AdminLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	return (
		<div className='flex h-full min-h-screen '>
			<Sildebar 
				isOpen={isSidebarOpen}
				toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
			/>
			<main className='p-4 flex-1'>
				<Outlet />
			</main>
		</div>
	)
}

export default AdminLayout
