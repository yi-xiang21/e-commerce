import "../features/User/Pages/Css/Home.css";
import { useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";
import CategoryCard from "../component/CategoryCard";
import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";
import slider from "@/assets/slider_1.webp";
import backgroundBestSeller from "@/assets/backgroundBestSeller.jpg";

const Home = () => {
  // Note: API calls are made inside the useEffect below.
  // Gọi API ở đây (see fetchCategories / fetchProducts functions)

  const [categories, setCategories] = useState<any[]>([]);
  const [bestSellersProducts, setBestSellersProducts] = useState<any[]>([]);
  const [mostLikedProducts, setMostLikedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = (productId: string | number) => {
    console.log("Add to cart:", productId);
  };

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        const res = await callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
        if (!mounted) return;

        const cats = res.data.categories || res.data?.data || res.data || [];
        setCategories(cats);
      } catch (err: any) {
        console.error("Failed to fetch categories", err);
        setError("Failed to load categories");
      }
    };

    const fetchProducts = async () => {
      try {
        // Best sellers
        const bestRes = await callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS, {
          params: { type: "best-sellers", limit: 8 },
        });
        //console.log('Best sellers response:', bestRes.data.products)
        if (mounted) {
          const prods =
            bestRes.data.products || bestRes.data?.data || bestRes.data || [];
          // Map product fields: product_id -> id, product_name -> title
          const mappedProds = prods.map((p: any) => ({
            id: p.product_id,
            title: p.product_name,
            description: p.description,
            price: p.variants?.[0]?.price || 0,
            final_price: p.variants?.[0]?.final_price ?? null,
            discount: p.variants?.[0]?.discount ?? null,
            image: p.image_url,
          }));
          setBestSellersProducts(mappedProds);
        }

        // Most liked
        const likedRes = await callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS, {
          params: { type: "most-liked", limit: 8 },
        });
        console.log("Most liked response:", likedRes.data.products);
        if (mounted) {
          const prods =
            likedRes.data.products ||
            likedRes.data?.data ||
            likedRes.data ||
            [];
          const mappedProds = prods.map((p: any) => ({
            id: p.product_id,
            title: p.product_name,
            description: p.description,
            price: p.variants?.[0]?.price || 0,
            final_price: p.variants?.[0]?.final_price ?? null,
            discount: p.variants?.[0]?.discount ?? null,
            image: p.image_url,
          }));
          setMostLikedProducts(mappedProds);
        }
      } catch (err: any) {
        console.error("Failed to fetch products", err);
        setError("Failed to load products");
      }
    };

    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchCategories(), fetchProducts()]);
      if (mounted) setLoading(false);
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="home-skeleton">
    
      <section className="intro-section">
          <div className="intro-banner">
            <img src={slider} alt="PeaceChill" className="hero-image" />
          </div>

          <div className="intro-content">
            <span className="intro-subtitle">PeaceChill</span>
            <h2>
              Handmade with Love,
              <br />
              Crafted for Peace.
            </h2>
            <p>
              Chào mừng bạn đến với PeaceChill – nơi hội tụ những sản phẩm đan
              móc, len sợi và phụ kiện thủ công được lựa chọn kỹ lưỡng. Chúng
              tôi mong muốn mang đến sự ấm áp, sáng tạo và cảm giác thư giãn
              trong từng sản phẩm, giúp bạn tận hưởng niềm vui từ nghệ thuật
              handmade.
            </p>

            <button className="intro-btn">Khám phá ngay</button>
          </div>
        </section>
      {/* Category Grid - bound to categories from API */}
      <section className="skeleton-section">
        <div className="section-header">Products Category</div>
        <div className="category-grid">
          {(categories.length > 0 ? categories : Array.from({ length: 4 })).map(
            (category, index) => (
              <CategoryCard key={index} category={category} index={index} />
            ),
          )}
        </div>
      </section>

      {/* Best Sellers Section - TODO: Bind with best sellers API data */}
      <section className="skeleton-section">
        <div className="section-header">Best Sellers</div>
       <section className="skeleton-hero">
        <img src={backgroundBestSeller} alt="Hero Slider" className="hero-image" />
      </section>
        <div className="product-grid">
          {(bestSellersProducts.length > 0
            ? bestSellersProducts
            : Array.from({ length: 4 })
          ).map((product, index) => (
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
        <div className="section-header">Most Liked</div>
        <div className="product-grid">
          {(mostLikedProducts.length > 0
            ? mostLikedProducts
            : Array.from({ length: 4 })
          ).map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
      {loading && <div style={{ padding: 16 }}>Đang tải dữ liệu...</div>}
      {error && <div style={{ padding: 16, color: "red" }}>{error}</div>}
    </main>
  );
};

export default Home;
