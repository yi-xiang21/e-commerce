import { createAsyncThunk } from "@reduxjs/toolkit";
import { ShopApi } from "../api/shop_api";

// 1. Thunk lấy danh mục sản phẩm
export const fetchCategoriesThunk = createAsyncThunk(
  "shop/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await ShopApi.getCategories(); 
      const rawCategories = res.data?.categories || res.data?.data?.categories || res.data?.data || res.data || [];
      if (!Array.isArray(rawCategories)) return thunkAPI.rejectWithValue("Dữ liệu danh mục không đúng");

      return rawCategories
        .map((cat: any) => ({
          category_id: Number(cat?.category_id ?? cat?.id ?? cat?.type_id ?? 0), 
          category_name: cat?.category_name ?? cat?.name ?? cat?.type_name ?? "Danh mục chưa đặt tên",
        }))
        .filter((cat: any) => cat.category_name && !cat.category_name.toLowerCase().includes("workshop"));
    } catch (error) {
      return thunkAPI.rejectWithValue("Không thể tải danh mục");
    }
  }
);

// 2. Thunk lấy danh sách sản phẩm & Thực hiện Mapping nhóm danh mục
export const fetchProductsThunk = createAsyncThunk(
  "shop/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { selectedCategory, minPrice, maxPrice, sortBy } = state.shop.filters;
      const categories = state.shop.categories || [];

      // Lấy tất cả sản phẩm về để xử lý lọc ở Front-end
      const params: any = { minPrice, maxPrice };
      const res = await ShopApi.getProducts(params);
      const rawProducts = res.data?.products || res.data?.data?.products || res.data?.data || res.data || [];

      // Lọc bỏ workshop và phân nhóm danh mục chuẩn
      const filteredProducts = rawProducts.filter((item: any) => {
        const actualProduct = item && item.product ? item.product : item;
        if (!actualProduct) return false;

        // Loại bỏ các sản phẩm liên quan đến workshop
        const title = (actualProduct.product_name || actualProduct.title || "").toLowerCase();
        if (title.includes("workshop")) return false;

        // Nếu chọn "Tất cả", hiển thị toàn bộ sản phẩm hợp lệ
        if (!selectedCategory || String(selectedCategory) === "all") return true;

        const productCategoryId = Number(actualProduct.category_id ?? actualProduct.type_id ?? 0);
        
        // Tìm tên của danh mục hiện tại đang được click trên UI
        const currentCatObj = categories.find((c: any) => String(c.category_id) === String(selectedCategory));
        if (!currentCatObj) return false;

        const uiCategoryName = currentCatObj.category_name.toLowerCase().trim();
        
        // Nhóm 1: Dụng cụ đan móc (Bao gồm các sản phẩm có ID là 3, 4, 5 hoặc tên chứa dụng cụ/kim/móc)
        if (uiCategoryName.includes("dụng cụ đan móc")) {
          const isToolId = [3, 4, 5].includes(productCategoryId);
          const isToolName = title.includes("kim") || title.includes("móc") || title.includes("kéo") || title.includes("thước");
          return isToolId || isToolName;
        }

        // Nhóm 2: Thành phẩm len (Ví dụ: Thú bông, Khăn len, Áo Cardigan)
        if (uiCategoryName.includes("thành phẩm len")) {
          const isFinishedId = [6, 7, 8, 9].includes(productCategoryId);
          const isFinishedProduct = title.includes("áo") || title.includes("khăn") || title.includes("thú bông") || title.includes("cardigan");
          const isFinishedCat = (actualProduct.category_name || "").toLowerCase().includes("thời trang") || (actualProduct.category_name || "").toLowerCase().includes("amigurumi");
          return isFinishedProduct || isFinishedCat || isFinishedId;
        }

        // Nhóm 3: Len đan / Cuộn len nguyên liệu (Bao gồm các sản phẩm có ID là 1, 2, 11 hoặc: Len Cotton, Sợi dệt...)
        if (uiCategoryName.includes("len đan")) {
          const isYarnId = [1, 2, 11].includes(productCategoryId);
          const isYarnName = title.includes("cuộn") || title.includes("len cotton") || title.includes("sợi dệt") || title.includes("len nhung");
          return isYarnId || isYarnName;
        }

        // Nhóm 4: Nguyên liệu len phụ trợ (ID: 10)
        if (uiCategoryName.includes("nguyên liệu len phụ trợ")) {
          const isSupportId = [10].includes(productCategoryId);
          const isSupportName = title.includes("bông gòn") || title.includes("phụ liệu") || title.includes("mắt thú");
          return isSupportId || isSupportName;
        }

        // Phương án dự phòng cuối cùng: Nếu trùng khớp ID hoặc trùng khớp chính xác Tên
        if (String(productCategoryId) === String(selectedCategory)) return true;
        if ((actualProduct.category_name || "").toLowerCase().trim() === uiCategoryName) return true;

        return false;
      });

      // Chuẩn hóa cấu trúc dữ liệu sản phẩm để đưa lên UI
      const formattedProducts = filteredProducts.map((item: any) => {
        const actualProduct = item && item.product ? item.product : item;
        const firstVariant = actualProduct.variants?.[0];
        const itemPrice = firstVariant?.price ?? actualProduct.price;
        const finalPrice = firstVariant?.final_price ?? null;

        return {
          id: actualProduct.product_id || actualProduct.id,
          title: actualProduct.product_name || actualProduct.title,
          description: actualProduct.description || "",
          price: itemPrice !== undefined ? Number(itemPrice) : 0,
          final_price: finalPrice !== undefined && finalPrice !== null ? Number(finalPrice) : null,
          discount: firstVariant?.discount ?? null,
          image: actualProduct.image_url || actualProduct.image || ""
        };
      });

      // Sắp xếp sản phẩm theo giá
      if (sortBy === "price_asc") formattedProducts.sort((a: any, b: any) => a.price - b.price);
      else if (sortBy === "price_desc") formattedProducts.sort((a: any, b: any) => b.price - a.price);

      // Tính toán lại tổng số trang sau khi đã gom nhóm và lọc sạch sẽ
      const ITEMS_PER_PAGE = 9;
      const totalPages = Math.ceil(formattedProducts.length / ITEMS_PER_PAGE); 

      return {
        products: formattedProducts,
        totalPages: totalPages > 0 ? totalPages : 1,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Không thể tải sản phẩm");
    }
  }
);