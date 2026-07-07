import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchWishlistThunk,
  toggleWishlistThunk,
} from "@/features/User/Wishlist/store/wishlist-thunk";
import { addToCartThunk } from "@/features/Cart/store/cart-thunk";
import type { ICartItem } from "@/features/Cart/type/cart-type";
import { notification } from "antd";
import "../Css/Detail.css";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const { user } = useAppSelector((state) => state.auth);

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWishlistThunk());
  }, [dispatch]);

  const fetchRelatedProducts = async (productData: any, currentId: string) => {
    const categoryId =
      productData?.category_id ??
      productData?.category?.id ??
      productData?.category?.category_id ??
      productData?.categoryId;

    if (!categoryId) {
      setRelatedProducts([]);
      return;
    }

    const candidateParams = [
      { category_id: categoryId, limit: 4, exclude: currentId },
      { category: categoryId, limit: 4, exclude: currentId },
      { categoryId, limit: 4, exclude: currentId },
    ];

    for (const params of candidateParams) {
      try {
        const res = await callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS, {
          params,
        });

        const items =
          res.data.products || res.data.data || res.data || [];
        const list = Array.isArray(items)
          ? items.filter(
              (item: any) =>
                String(item.product_id ?? item.id) !== String(currentId)
            )
          : [];

        if (list.length > 0) {
          setRelatedProducts(list.slice(0, 4));
          return;
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm liên quan:", error);
      }
    }

    setRelatedProducts([]);
  };

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCT(id));

        const productData =
          res.data.product || res.data.data || res.data;

        setProduct(productData);

        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }

        setQuantity(1);
        await fetchRelatedProducts(productData, id);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    const maxQuantity = Number(selectedVariant?.stock_quantity || 1);
    const nextQuantity = Math.min(Math.max(value, 1), Math.max(maxQuantity, 1));
    setQuantity(nextQuantity);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.variant_id) {
      setCartMessage("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    const maxQuantity = Number(selectedVariant.stock_quantity || 0);
    if (quantity < 1 || quantity > maxQuantity) {
      setCartMessage(`Số lượng tối đa hiện tại là ${maxQuantity}`);
      return;
    }

    try {
      setIsAddingToCart(true);
      setCartMessage(null);

      const cartItem: ICartItem = {
        cart_id: 0,
        variant_id: Number(selectedVariant.variant_id),
        quantity,
        sku: selectedVariant.sku || "",
        slug: product?.slug || "",
        price: selectedVariant.price ?? 0,
        discount: selectedVariant.discount || null,
        final_price: selectedVariant.final_price || null,
        color: selectedVariant.color || "",
        size: selectedVariant.size || "",
        product_id: Number(product?.product_id ?? id ?? 0),
        product_name: product?.product_name ?? "",
        stock_quantity: maxQuantity,
        image_url: product?.image_url || "",
      };

      await dispatch(addToCartThunk(cartItem)).unwrap();
      setCartMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      setCartMessage("Không thể thêm vào giỏ hàng lúc này");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isFavorite = Array.isArray(wishlistItems)
    ? wishlistItems.some((item: any) => String(item.product_id) === String(id))
    : false;

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Đang tải...</h2>;
  }

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Không tìm thấy sản phẩm</h2>;
  }

  return (
    <div className="detail-page">
      <div className="detail-image">
        <img src={product.image_url} alt={product.product_name} />
      </div>

      <div className="detail-info">
        <h1>{product.product_name}</h1>

        <p>{product.description}</p>

        <h2>
          {selectedVariant?.price
            ? `${Number(selectedVariant.price).toLocaleString("vi-VN")} đ`
            : "Liên hệ"}
        </h2>

        <h3>Màu sắc & Kích thước</h3>

        <div className="variants">
          {product?.variants?.length > 0 ? (
            product.variants.map((item: any) => (
              <button
                key={item.variant_id}
                onClick={() => {
                  setSelectedVariant(item);
                  setQuantity(1);
                }}
                className={
                  selectedVariant?.variant_id === item.variant_id
                    ? "variant-active"
                    : ""
                }
              >
                {item.color} - {item.size}
              </button>
            ))
          ) : (
            <p>Không có phiên bản.</p>
          )}
        </div>

        <p>Số lượng trong kho: {selectedVariant?.stock_quantity ?? 0}</p>

        <div className="quantity">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={selectedVariant?.stock_quantity ?? 1}
            value={quantity}
            onChange={(event) =>
              handleQuantityChange(Number(event.target.value || 1))
            }
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= (selectedVariant?.stock_quantity || 1)}
          >
            +
          </button>
        </div>

        {cartMessage ? <p className="cart-message">{cartMessage}</p> : null}

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "auto",
          }}
        >
          <button
            type="button"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "10px",
              border: "1px solid #f5c2c7",
              background: isFavorite ? "#d4a373" : "#fff",
              color: isFavorite ? "#7c4a21" : "#999",
              fontSize: "25px",
              cursor: isTogglingWishlist ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              opacity: isTogglingWishlist ? 0.6 : 1,
            }}
            disabled={isTogglingWishlist}
            onClick={async () => {
              if (!id) return;

              if (!user) {
                notification.info({
                  message: "Vui lòng đăng nhập",
                  description: "Bạn cần đăng nhập để thêm sản phẩm vào wishlist",
                });
                navigate("/auth/login");
                return;
              }

              try {
                setIsTogglingWishlist(true);

                await dispatch(toggleWishlistThunk(id)).unwrap();
                await dispatch(fetchWishlistThunk()).unwrap();
              } catch (err) {
                console.error("Lỗi toggle wishlist:", err);
              } finally {
                setIsTogglingWishlist(false);
              }
            }}
            aria-label="Yêu thích"
          >
            {isTogglingWishlist ? "" : isFavorite ? "❤" : "♡"}
          </button>

          <button
            className="add-cart"
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedVariant?.variant_id}
          >
            {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

      <div className="related-products-section">
        <h3>Sản phẩm liên quan</h3>
        {relatedProducts.length > 0 ? (
          <div className="related-products">
            {relatedProducts.map((item: any) => {
              const itemId = item.product_id ?? item.id;
              const firstVariant = item.variants?.[0];

              return (
                <div
                  key={itemId}
                  className="related-product-card"
                  onClick={() => navigate(`/detail/${itemId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      navigate(`/detail/${itemId}`);
                    }
                  }}
                >
                  <img src={item.image_url} alt={item.product_name} />
                  <div className="related-product-info">
                    <h4>{item.product_name}</h4>
                    <p>
                      {firstVariant?.price
                        ? `${Number(firstVariant.price).toLocaleString("vi-VN")} đ`
                        : "Liên hệ"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Chưa có sản phẩm liên quan.</p>
        )}
      </div>
    </div>
  );
};

export default DetailPage;