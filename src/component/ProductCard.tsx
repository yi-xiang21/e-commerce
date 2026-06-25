interface ProductCardProps {
  product?: {
    id: string | number
    title?: string
    price?: number
  }
  index: number
  onAddToCart: (productId: string | number) => void
}

const ProductCard = ({ product, index, onAddToCart }: ProductCardProps) => {
  return (
    <div className="product-card">
      {/* TODO: Display product.image */}
      <div className="product-image" />
      
      {/* TODO: Display product.title */}
      <div className="product-line long" />
      
      {/* TODO: Display product.price */}
      <div className="product-line short" />
      
      <button 
        className="product-action"
        onClick={() => onAddToCart(product?.id || index)}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  )
}

export default ProductCard
