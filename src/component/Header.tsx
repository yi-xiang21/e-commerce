import { useState, useEffect, useRef } from 'react'
import { FaRegUser, FaShoppingCart ,FaHeart } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/Logo.png'
import Badge from 'antd/es/badge/Badge'
import HeaderDesktopMenu from '@/component/HeaderDesktopMenu'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { fetchWishlistThunk } from '@/features/User/Wishlist/store/wishlist-thunk'
import { fetchCart } from '@/features/Cart/store/cart-thunk'
import type { Product } from '@/features/Admin/ManagerProduct/type/products'
import { ProductApi } from '@/features/Admin/ManagerProduct/api/products_api'


export type ActiveMenuKey = 'home' | 'shop' | 'about' | 'workshop'

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<ActiveMenuKey>('home')

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth);
  const prevUserIdRef = useRef<string | number | null>(null);
  const [products, setProducts] = useState<Product[]>([])
  const [keyword, setKeyword] = useState<string>('')

  useEffect(() => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      setProducts([])
      return
    }

    const timeoutId = window.setTimeout(() => {
      void ProductApi.filter({ page: 1, limit: 10, keyword: trimmedKeyword })
        .then((response) => {
          setProducts(response?.data?.products)
        })
        .catch((error) => {
          console.error('Error fetching products:', error)
          setProducts([])
        })
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [keyword])

  const { items: wishlistItems } = useAppSelector((state) => state.wishlist)
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0

  const { items: cartItems } = useAppSelector((state) => state.cart)

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0

  useEffect(() => {
    if (user && user.user_id !== prevUserIdRef.current) {
      prevUserIdRef.current = user.user_id;
      void dispatch(fetchWishlistThunk());
      void dispatch(fetchCart());
    }
  }, [dispatch, user])
  
  const menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }> = [
    { key: 'home', label: 'Trang chủ', link: '/' },
    { key: 'shop', label: 'Cửa hàng', link: '/shop' },
    { key: 'about', label: 'Giới thiệu', link: '/about' },
    { key: 'workshop', label: 'workshop', link: '/workshop' },
  ]

  const router = () => {
    if (!user) return '/auth/login'

    if (user.role === 'admin') return '/admin'
    if (user.role === 'shipper') return '/shipper/available-orders'

    return '/profile'
  }

  const handleSelectProduct = (productId?: number) => {
    if (!productId) return

    navigate(`/detail/${productId}`)
    setKeyword('')
    setProducts([])
  }

  return (
    <>
      <div className='sticky top-0 z-[300] flex items-center px-6 bg-white shadow-sm'>
        <div className='mx-auto flex w-full max-w-6xl items-center gap-3 px-1 py-1'>
          <a className='text-xl font-black tracking-wider md:text-2xl' href='/'>
            <img
              alt='ShopLen'
              className='h-10 w-auto object-contain md:h-20'
              src={logo}
            />
          </a>

          <div className='flex-1'>
            <div className='relative mx-auto w-4/5'>
              <input
                className='w-full rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-xs outline-none transition-all duration-200 focus:border-amber-700 focus:bg-white focus:shadow-sm md:text-sm'
                placeholder='Tìm kiếm sản phẩm...'
                type='text'
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
              />
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                <FiSearch aria-hidden='true' className='h-3.5 w-3.5 md:h-4 md:w-4' />
              </span>

              {keyword.trim() && (
                <div className='absolute left-0 right-0 top-full z-[400] mt-2 rounded-lg border border-gray-200 bg-white shadow-lg'>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <button
                        key={product.product_id}
                        type='button'
                        className='flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-amber-50'
                        onClick={() => handleSelectProduct(product.product_id)}
                      >
                        <span>{product.product_name}</span>
                        <span className='text-xs text-gray-400'>Xem chi tiết</span>
                      </button>
                    ))
                  ) : (
                    <div className='px-4 py-2 text-sm text-gray-500'>Không tìm thấy sản phẩm</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Link
              aria-label='Tai khoan'
              className='flex items-center gap-2 rounded-full px-2 py-1 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
              type='button'
              to={router()}
            >
              <FaRegUser aria-hidden='true' className='h-5 w-5' />
            </Link>
            <Link
              aria-label='Yêu thích'
              className='rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
              to={'/wishlist'}
            >
              <Badge count={wishlistCount} size='small'>
                <FaHeart aria-hidden='true' className='h-5 w-5' />
              </Badge>
            </Link>
            <Link
              aria-label='Giỏ hàng'
              className='relative rounded-full p-2 text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50 hover:text-amber-800'
              to='/cart'
            >
              <Badge count={cartCount} size='small'>
                <FaShoppingCart aria-hidden='true' className='h-5 w-5' />
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      <header className='h-auto bg-white shadow-sm'>
        <div className='bg-white'>
          <HeaderDesktopMenu
            activeMenu={activeMenu}
            menuItems={menuItems}
            setActiveMenu={setActiveMenu}
          />
        </div>
      </header>
    </>
  )
}

export default Header