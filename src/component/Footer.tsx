import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'

const footerSections = [
  {
    key: 'shop',
    title: 'Shop',
    links: ['All Yarns', 'Merino Wool', 'Alpaca Blend', 'Organic Cotton', 'Hand-Dyed Specialty'],
  },
  {
    key: 'learn',
    title: 'Learn',
    links: ['Workshops', 'Tutorials', 'Patterns', 'Blog', 'Community'],
  },
  {
    key: 'customer-care',
    title: 'Customer Care',
    links: ['Contact Us', 'Shipping & Returns', 'FAQ', 'Store Locations', 'About Us'],
  },
]

const Footer = () => {
  return (
    <footer className='bg-[#e7dde4] px-6 py-14 text-left text-[#2e2742] md:px-10'>
      <div className='mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-4 md:gap-12'>
        <section className='space-y-4'>
          <h3 className='text-lg font-semibold tracking-tight text-[#e6417d] md:text-2xl'>PeaceChill</h3>
          <p className='max-w-xs text-xs leading-relaxed text-[#3a324f] md:text-base md:leading-tight'>
            Creating beautiful things, one stitch at a time.
          </p>
          <div className='flex items-center gap-5 pt-2 text-[#e6417d]'>
            <a aria-label='Facebook' className='transition hover:opacity-70' href='#'>
              <FaFacebookF className='h-5 w-5' />
            </a>
            <a aria-label='Instagram' className='transition hover:opacity-70' href='#'>
              <FaInstagram className='h-5 w-5' />
            </a>
            <a aria-label='Youtube' className='transition hover:opacity-70' href='#'>
              <FaYoutube className='h-5 w-5' />
            </a>
          </div>
        </section>

        {footerSections.map((section) => (
          <section key={section.key}>
            <h4 className='mb-4 text-base font-semibold text-[#7b5d49] md:text-xl'>{section.title}</h4>
            <ul className='space-y-2 text-xs leading-tight text-[#2e2742] md:text-base'>
              {section.links.map((link) => (
                <li key={link}>
                  <a className='transition hover:opacity-70' href='#'>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </footer>
  )
}

export default Footer
