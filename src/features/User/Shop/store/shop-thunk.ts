import { createAsyncThunk } from "@reduxjs/toolkit";
import { ShopApi } from "../api/shop_api";

// 1. Thunk lấy danh mục sản phẩm
export const fetchCategoriesThunk = createAsyncThunk(
  "shop/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const res = await ShopApi.getCategories(); 
      const rawCategories = res.data?.categories || res.data?.data?.categories || res.data?.data || res.data || [];
      
      if (!Array.isArray(rawCategories)) {
        return thunkAPI.rejectWithValue("Dữ liệu danh mục không đúng cấu trúc mảng");
      }

      return rawCategories
        .map((cat: any) => {
          const actualId = cat?.category_id ?? cat?.id ?? cat?.type_id;
          const actualName = cat?.category_name ?? cat?.name ?? cat?.type_name;

          return {
            category_id: actualId !== undefined && actualId !== null ? Number(actualId) : Math.floor(Math.random() * 100000), 
            category_name: actualName || "Danh mục chưa đặt tên",
          };
        })
        .filter((cat: any) => cat.category_name && !cat.category_name.toLowerCase().includes("workshop"));
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Không thể tải danh mục sản phẩm");
    }
  }
);

// 2. Thunk lấy danh sách sản phẩm & Thực hiện lọc + Sắp xếp chuẩn hóa
export const fetchProductsThunk = createAsyncThunk(
  "shop/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const { selectedCategory, minPrice, maxPrice, sortBy, currentPage } = state.shop.filters;
      const categories = state.shop.categories || [];

      const params: any = {
        page: currentPage,
        limit: 12, 
        minPrice,
        maxPrice,
        sort: sortBy, // Gửi param lên cho backend (nếu backend hỗ trợ)
      };
      
      if (selectedCategory && selectedCategory !== "all") {
        params.category_id = Number(selectedCategory);
      }

      const res = await ShopApi.getProducts(params);
      const rawProducts = res.data?.products || res.data?.data?.products || res.data?.data || res.data || [];

      // Bước 1: Thực hiện bộ lọc danh mục và loại bỏ workshop
      const filteredProducts = rawProducts.filter((item: any) => {
        const actualProduct = item && item.product ? item.product : item;
        if (!actualProduct) return false;

        const title = (actualProduct.product_name || actualProduct.title || "").toLowerCase();
        if (title.includes("workshop")) return false;

        if (selectedCategory && String(selectedCategory) !== "all") {
          const productCategoryId = actualProduct.category_id ?? actualProduct.type_id;
          if (productCategoryId !== undefined && productCategoryId !== null) {
            if (String(productCategoryId) === String(selectedCategory)) return true;
          }

          const currentCatObj = categories.find((c: any) => String(c.category_id) === String(selectedCategory));
          if (currentCatObj) {
            const targetName = currentCatObj.category_name.toLowerCase().trim();
            const productCatName = (actualProduct.category_name || "").toLowerCase().trim();
            if (productCatName.includes(targetName) || targetName.includes(productCatName)) return true;

            if (title.includes("kim") || title.includes("móc") || title.includes("kéo") || title.includes("thước")) {
              if (targetName.includes("dụng cụ") || targetName.includes("đan móc")) return true;
            }
          }
          return false;
        }
        return true;
      });

      // Bước 2: Chuẩn hóa cấu trúc dữ liệu và bóc tách giá (price) ra ngoài để chuẩn bị sort
      const formattedProducts = filteredProducts.map((item: any) => {
        const actualProduct = item && item.product ? item.product : item;
        
        // Bóc tách giá từ variant đầu tiên, nếu không có thì lấy giá gốc
        const itemPrice = actualProduct.variants?.[0]?.price ?? actualProduct.price;

        return {
          id: actualProduct.product_id || actualProduct.id,
          title: actualProduct.product_name || actualProduct.title, 
          description: actualProduct.description || "",
          price: itemPrice !== undefined ? Number(itemPrice) : 0,
          image: actualProduct.image_url || actualProduct.image || ""
        };
      });

      // 🔥 BƯỚC THẦN THÁNH: Thực hiện Sắp xếp (Sort) trực tiếp ở Frontend 
      // Việc này giúp bọc lót hoàn hảo trong trường hợp API của Backend chưa kịp xử lý sort theo variant giá
      if (sortBy === "price_asc") {
        formattedProducts.sort((a: any, b: any) => a.price - b.price); // Giá tăng dần
      } else if (sortBy === "price_desc") {
        formattedProducts.sort((a: any, b: any) => b.price - a.price); // Giá giảm dần
      }

      return {
        products: formattedProducts,
        totalPages: res.data?.totalPages || res.data?.data?.totalPages || 1,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Không thể tải danh sách sản phẩm");
    }
  }
);