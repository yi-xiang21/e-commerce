import type { ActiveMenuKey } from './Header'
import { Link } from 'react-router-dom'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import type { Category } from '@/share/types/category'

type HeaderDesktopMenuProps = {
  menuItems: Array<{ key: ActiveMenuKey; label: string; link: string }>
  activeMenu: ActiveMenuKey
  setActiveMenu: (key: ActiveMenuKey) => void
  categories?: Category[]
}

const HeaderDesktopMenu = ({
  menuItems,
  activeMenu,
  setActiveMenu,
  categories = [],
}: HeaderDesktopMenuProps) => {

  // Chuyển đổi đệ quy cấu trúc danh mục sang antd menu items
  const mapCategoryToMenuItem = (cat: any): any => {
    if (!cat) return null;

    const children = cat.children && cat.children.length > 0
      ? cat.children.map(mapCategoryToMenuItem).filter(Boolean)
      : undefined;

    return {
      key: String(cat.id || cat.slug || cat.category_name),
      label: (
        <Link to={`/shop?category=${cat.id}`} className="text-sm font-medium">
          {cat.category_name}
        </Link>
      ),
      children: children && children.length > 0 ? children : undefined,
    };
  };

  const dropdownMenuItems: MenuProps['items'] = categories
    .map(mapCategoryToMenuItem)
    .filter(Boolean);

  return (
    <ul className='items-center justify-center gap-20 text-xl font-semibold text-gray-700 mb-0! md:flex hidden'>
      {menuItems.map((item) => {
        const isActive = activeMenu === item.key
        const isShop = item.key === 'shop'

        const linkEl = (
          <Link
            className={`block transition-all duration-200 md:inline cursor-pointer ${
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
        );

        return (
          <li key={item.key} className='relative px-2 py-5'>
            {isShop && dropdownMenuItems.length > 0 ? (
              <Dropdown
                menu={{ items: dropdownMenuItems }}
                placement="bottomLeft"
                arrow
              >
                {linkEl}
              </Dropdown>
            ) : (
              linkEl
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default HeaderDesktopMenu