
import './Home.css'
import ProductCard from '../component/ProductCard'
import CategoryCard from '../component/CategoryCard'

const Home = () => {
  // TODO: Fetch categories API and map to category-grid
  // API Call: GET /api/categories
  const categories = []

  // TODO: Fetch best sellers products API
  // API Call: GET /api/products?type=best-sellers
  const bestSellersProducts = []

  // TODO: Fetch most liked products API
  // API Call: GET /api/products?type=most-liked
  const mostLikedProducts = []

  const handleAddToCart = (productId: string | number) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId)
  }

  return (
    <main className="home-skeleton">
      {/* Hero Banner Section - TODO: Replace with actual hero image and text */}
      <section className="skeleton-hero">
        <div className="hero-content">
          <div className="hero-headline" />
          <div className="hero-subtext" />
          <div className="hero-action" />
        </div>
      </section>

      {/* Category Grid - TODO: Bind with categories API data */}
      <section className="skeleton-section">
        <div className="section-header" />
        <div className="category-grid">
          {(categories.length > 0 ? categories : Array.from({ length: 4 })).map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section - TODO: Bind with best sellers API data */}
      <section className="skeleton-section">
        <div className="section-header" />
        <div className="product-grid">
          {(bestSellersProducts.length > 0 ? bestSellersProducts : Array.from({ length: 4 })).map((product, index) => (
            <ProductCard 
              key={index} 
              product={product} 
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Most Liked Section - TODO: Bind with most liked API data */}
      <section className="skeleton-section">
        <div className="section-header" />
        <div className="product-grid">
          {(mostLikedProducts.length > 0 ? mostLikedProducts : Array.from({ length: 4 })).map((product, index) => (
            <ProductCard 
              key={index} 
              product={product} 
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home

