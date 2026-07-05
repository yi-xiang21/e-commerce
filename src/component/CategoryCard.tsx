interface CategoryCardProps {
  category?: {
    id: string | number
    category_name?: string
    name?: string
    image_url?: string
  }
  index: number
}

const CategoryCard = ({ category, index: _index }: CategoryCardProps) => {
  if (!category) {
    return (
      <div className="category-card">
        <div className="category-image" />
        <div className="category-label" />
      </div>
    )
  }

  const categoryName = category.category_name || category.name || 'Danh mục'
  const imageUrl = category.image_url

  return (
    <div className="category-card">
      <div className="category-image" style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f0f0f0'
      }} />
      
      <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {categoryName}
      </h3>
    </div>
  )
}

export default CategoryCard
