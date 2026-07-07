import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchCategoriesThunk, fetchProductsThunk } from "../store/shop-thunk";
import { updateFilters, setCurrentPage } from "../store/shop-slice";
import ProductCard from "../../../../component/ProductCard";
import type { RootState } from "@/app/redux/store";
import "../css/Shop.css";

const Shop = () => {
    const dispatch = useAppDispatch();
    const { products, categories, isLoading, error, filters } = useAppSelector((state: RootState) => state.shop);

    useEffect(() => {
        dispatch(fetchCategoriesThunk());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProductsThunk());
    }, [dispatch, filters.selectedCategory, filters.minPrice, filters.maxPrice, filters.sortBy, filters.currentPage]);

    // Phân trang 
    const ITEMS_PER_PAGE = 9;
    const startIndex = (filters.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    // Mảng chứa đúng số sản phẩm của trang hiện tại 
    const displayedProducts = products ? products.slice(startIndex, endIndex) : [];

    return (
        <div className="shop-container">
            <aside className="shop-sidebar">
                <div className="sidebar-category-group">
                    <h3>Danh mục</h3>
                    <button
                        className={`category-list-btn ${(!filters.selectedCategory || String(filters.selectedCategory) === "all") ? "active" : ""}`}
                        onClick={() => dispatch(updateFilters({ selectedCategory: "all" }))}
                    >
                        Tất cả
                    </button>

                    {categories && categories.map((cat: any) => {
                        const isCategoryActive =
                            filters.selectedCategory &&
                            filters.selectedCategory !== "all" &&
                            String(filters.selectedCategory) === String(cat.category_id);

                        return (
                            <button
                                key={String(cat.category_id)}
                                className={`category-list-btn ${isCategoryActive ? "active" : ""}`}
                                onClick={() => dispatch(updateFilters({ selectedCategory: cat.category_id }))}
                            >
                                {cat.category_name}
                            </button>
                        );
                    })}
                </div>

                {/* Sắp xếp theo giá */}
                <div className="sidebar-sort-group">
                    <h3>Sắp xếp</h3>
                    <select
                        className="shop-sort-select"
                        value={filters.sortBy}
                        onChange={(e) => dispatch(updateFilters({ sortBy: e.target.value }))}
                    >
                        <option value="price_asc">Giá tăng dần</option>
                        <option value="price_desc">Giá giảm dần</option>
                    </select>
                </div>
            </aside>

            {/* DANH SÁCH SẢN PHẨM & PHÂN TRANG */}
            <section className="shop-main-content">
                {error && <p className="shop-error-message">{error}</p>}

                {!isLoading && filters.selectedCategory !== "all" && products.length === 0 && (
                    <div className="shop-no-products-message">
                        Hiện tại danh mục chưa có sản phẩm nào. <br />Cửa hàng sẽ cập nhật sớm nhất, bạn vui lòng quay lại sau hoặc xem các danh mục khác nhé!
                    </div>
                )}

                <div className="shop-content-wrapper">
                    {isLoading ? (
                        <p className="shop-loading-text">Đang tải dữ liệu...</p>
                    ) : (
                        <div className="shop-product-grid">
                            {displayedProducts.map((product: any, index: number) => (
                                <ProductCard
                                    key={product.id || index}
                                    product={product}
                                    index={index}
                                    onAddToCart={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="shop-pagination">
                    <button
                        disabled={filters.currentPage === 1}
                        onClick={() => dispatch(setCurrentPage(filters.currentPage - 1))}
                    >
                        Trước
                    </button>
                    <span>Trang {filters.currentPage} / {filters.totalPages}</span>
                    <button
                        disabled={filters.currentPage === filters.totalPages || filters.totalPages === 0}
                        onClick={() => dispatch(setCurrentPage(filters.currentPage + 1))}
                    >
                        Sau
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Shop;