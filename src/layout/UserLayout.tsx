import Header from '@/component/Header'
import Footer from '@/component/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout
