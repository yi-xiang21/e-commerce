import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout, Menu, Card, Spin, Empty, Breadcrumb, Rate } from "antd";
import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { Category } from "@/share/types/category";

const { Sider, Content } = Layout;

interface Product {
  id: string | number;
  product_name: string;
  price: number;
  image_url?: string;
  rating?: number;
  category_id?: string | number;
}

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
        const rawData = response.data?.data || response.data;
        const categoriesList = Array.isArray(rawData)
          ? rawData
          : (rawData && Array.isArray(rawData.categories) ? rawData.categories : []);
        setCategories(categoriesList);
      } catch (err) {
        console.error("Không thể load categories cho shop page", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        let response;
        if (selectedCategory) {
          // Gửi request filter sản phẩm theo category
          response = await callAPI.post(API_CONFIG.ENDPOINTS.FiLTER_PRODUCTS, {
            category_id: selectedCategory,
          });
        } else {
          // Mặc định load toàn bộ sản phẩm
          response = await callAPI.get(API_CONFIG.ENDPOINTS.GET_PRODUCTS);
        }
        const data = response.data?.data || response.data || [];
        setProducts(data);
      } catch (err) {
        console.error("Không thể load products cho shop page", err);
        // Fallback mock data nếu API chưa chạy
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const handleCategorySelect = ({ key }: { key: string }) => {
    if (key === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", key);
    }
    setSearchParams(searchParams);
  };

  // Convert categories tree to antd menu items
  const renderMenuItems = (cats: Category[]): any[] => {
    return cats.map((cat) => {
      const hasChildren = cat.children && cat.children.length > 0;
      return {
        key: String(cat.id),
        label: cat.category_name,
        children: hasChildren ? renderMenuItems(cat.children) : undefined,
      };
    });
  };

  const menuItems = [
    {
      key: "all",
      label: "Tất cả sản phẩm",
    },
    ...renderMenuItems(categories),
  ];

  return (
    <Layout className="bg-slate-50 min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb
          className="mb-6 text-sm"
          items={[
            {
              title: <a href="/">Trang chủ</a>,
            },
            {
              title: "Cửa hàng",
            },
            ...(selectedCategory
              ? [
                  {
                    title:
                      categories.find((c) => String(c.id) === selectedCategory)
                        ?.category_name || "Lọc danh mục",
                  },
                ]
              : []),
          ]}
        />

        <Layout className="bg-transparent gap-6">
          {/* Sidebar */}
          <Sider
            width={260}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            style={{ height: "fit-content" }}
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">Danh mục sản phẩm</h3>
            </div>
            {loadingCategories ? (
              <div className="flex justify-center p-8">
                <Spin size="small" />
              </div>
            ) : (
              <Menu
                mode="inline"
                selectedKeys={[selectedCategory || "all"]}
                style={{ borderRight: 0 }}
                items={menuItems}
                onClick={handleCategorySelect}
                className="py-2"
                defaultOpenKeys={categories.map(c => String(c.id))}
              />
            )}
          </Sider>

          {/* Main Product Area */}
          <Content className="flex-1 min-h-[500px]">
            {loadingProducts ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-slate-100">
                <Spin size="large" tip="Đang tải sản phẩm..." />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    hoverable
                    className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border-slate-100"
                    cover={
                      <div className="h-48 overflow-hidden bg-slate-100 relative group flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            alt={product.product_name}
                            src={product.image_url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm italic">Chưa có hình ảnh</span>
                        )}
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="font-bold text-base text-slate-800 line-clamp-2 min-h-[48px]">
                        {product.product_name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Rate disabled defaultValue={product.rating || 5} allowHalf className="text-xs text-amber-500" />
                        <span className="text-xs text-slate-400">({product.rating || 5})</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-rose-600 font-extrabold text-lg">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <Empty description="Không tìm thấy sản phẩm nào trong danh mục này." />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </Layout>
  );
};

export default ShopPage;
