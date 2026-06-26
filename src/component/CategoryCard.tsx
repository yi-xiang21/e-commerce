interface CategoryCardProps {
  category?: {
    id: string | number
    name?: string
  }
  index: number
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <div className="category-card">
      {/* TODO: Display category.image */}
      <div className="category-image" />
      
      {/* TODO: Display category.name */}
      <div className="category-label" />
    </div>
  )
}

export default CategoryCard
