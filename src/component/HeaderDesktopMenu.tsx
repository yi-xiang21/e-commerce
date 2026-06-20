import type { ActiveMenuKey } from './Header'
import { Link } from 'react-router-dom'

type HeaderDesktopMenuProps = {
  menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }>
  activeMenu: ActiveMenuKey
  setActiveMenu: (key: ActiveMenuKey) => void
}

const HeaderDesktopMenu = ({
  menuItems,
  activeMenu,
  setActiveMenu,
}: HeaderDesktopMenuProps) => {
  return (
      <ul className='items-center justify-center gap-20 text-xl font-semibold text-gray-700 mb-0! md:flex hidden'>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key
          return (
            <li key={item.key} className='relative px-2 py-5'>
              <Link
                className={`block transition-all duration-200 md:inline ${
                  isActive
                    ? '-translate-y-0.5 text-amber-800 italic'
                    : 'hover:-translate-y-0.5 hover:text-amber-800 hover:italic'
                }`}
                to={item.link}
                onClick={() => {
                  setActiveMenu(item.key)
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
  )
}

export default HeaderDesktopMenu