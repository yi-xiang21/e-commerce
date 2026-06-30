
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callAPI } from "@/share/lib/axios";
import { API_CONFIG } from "@/config/api";
import "../Css/Detail.css";

const DetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
   const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await callAPI.get(
          API_CONFIG.ENDPOINTS.GET_PRODUCT(id)
        );

        console.log("API Response:", res.data);

        // Nếu backend trả { product: {...} }
       const productData = res.data.product || res.data.data || res.data;

setProduct(productData);

// Tự động chọn Color - Size đầu tiên
if (productData?.variants?.length > 0) {
  setSelectedVariant(productData.variants[0]);
}
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Đang tải...</h2>;
  }

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Không tìm thấy sản phẩm</h2>;
  }


  return (
    <div className="detail-page">
      {/* LEFT */}
      <div className="detail-image">
        <img
          src={product.image_url}
          alt={product.product_name}
        />
      </div>

      {/* RIGHT */}
      <div className="detail-info">
        <h1>{product.product_name}</h1>

        <p>{product.description}</p>

        <h2>
          {selectedVariant?.price
            ? `${selectedVariant.price.toLocaleString("vi-VN")} đ`
            : "Liên hệ"}
        </h2>

        <h3>Màu sắc & Kích thước</h3>

        <div className="variants">
  {product?.variants?.length > 0 ? (
    product.variants.map((item: any) => (
      <button
        key={item.variant_id}
        onClick={() => setSelectedVariant(item)}
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

        <p>
          Số lượng trong kho: {selectedVariant?.stock_quantity ?? 0}
        </p>

        <div className="quantity">
          <button>-</button>
          <span>1</span>
          <button>+</button>
        </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <button
          type="button"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '10px',
            border: '1px solid #f5c2c7',
            background: isFavorite ? '#d4a373' : '#fff',
            color: isFavorite ? '#7c4a21' : '#999',
            fontSize: '25px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onClick={() => setIsFavorite((prev) => !prev)}
          aria-label="Yêu thích"
        >
          {isFavorite ? "❤" : "♡"}
        </button>
       <button className="add-cart">
          Thêm vào giỏ hàng
        </button>
      </div>
      </div>
    </div>
  );
};

export default DetailPage;