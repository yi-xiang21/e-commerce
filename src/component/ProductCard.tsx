import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product?: {
    id: string | number;
    title?: string;
    description?: string;
    price?: number;
    final_price?: number | string | null;
    discount?: any;
    image?: string;
  };
  index: number;
  onAddToCart: (productId: string | number) => void;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="product-card">
        <div className="product-image" />
        <div className="product-line long" />
        <div className="product-line short" />
        <button className="product-action" disabled>
          Thêm vào giỏ hàng
        </button>
      </div>
    );
  }

  const handleCardClick = () => {
    navigate(`/detail/${product.id}`);
  };

  const originalPrice = Number(product?.price ?? 0);
  const finalPrice = Number(product?.final_price ?? 0);
  const discount = product?.discount;
  const hasDiscount = Boolean(
    discount &&
      Number.isFinite(finalPrice) &&
      finalPrice > 0 &&
      finalPrice < originalPrice
  );
  const discountValue = Number(
    discount?.value ??
      discount?.discount_value ??
      discount?.amount ??
      0
  );
  const discountType = discount?.discount_type ?? discount?.type ?? "";
  const discountLabel = hasDiscount
    ? discountType === "percent" || discountType === "percentage"
      ? `${discountValue}%`
      : `${discountValue.toLocaleString("vi-VN")} đ`
    : "";

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div
        className="product-image"
        style={{
          backgroundImage: product.image ? `url(${product.image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#f0f0f0",
        }}
      />

      <div style={{ padding: "0 8px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            margin: "8px 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.title || "Sản phẩm"}
        </h3>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#ff6b6b",
            margin: "8px 0",
          }}
        >
          {product.description && (
            <div style={{ fontSize: "12px", fontWeight: "400", color: "#666", marginBottom: "4px" }}>
              {product.description}
            </div>
          )}
          {hasDiscount ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ textDecoration: "line-through", color: "#999", fontSize: "12px" }}>
                {originalPrice.toLocaleString("vi-VN")} đ
              </span>
              <span style={{ color: "#ff6b6b", fontWeight: 700 }}>
                {finalPrice.toLocaleString("vi-VN")} đ
              </span>
              {discountLabel ? (
                <span style={{ color: "#d97706", fontSize: "12px", fontWeight: 600 }}>
                  Giảm {discountLabel}
                </span>
              ) : null}
            </div>
          ) : product.price ? (
            `${product.price.toLocaleString("vi-VN")} đ`
          ) : (
            "Giá không có"
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
