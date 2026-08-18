import { useEffect, useState } from "react";
import { Button, Spin, Empty, Card, Tooltip } from "antd";
 import { HeartFilled } from "@ant-design/icons";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchWishlistThunk, toggleWishlistThunk } from "../store/wishlist-thunk";
// import { addProductToCartThunk } from "@/features/Cart/store/cart-thunk";
import { WishlistApi } from "../api/wishlist_api";
import Notification, { type NotificationType } from "@/share/ComponentCustom/Notification/Notification";

// Tạo một biến đếm toàn cục bên ngoài component để tạo key duy nhất, tránh lỗi ESLint.
let nextNotifyId = 0;

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  const { Meta } = Card;
  
  // Đảm bảo an toàn: Nếu items chưa phải là mảng thì trả về mảng rỗng để tránh lỗi map()
  const safeItems = Array.isArray(items) ? items : []; 
  
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    void dispatch(fetchWishlistThunk());
  }, [dispatch]);

  const handleRemove = async (product_id: string | number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?")) {
      try {
        await dispatch(toggleWishlistThunk(product_id)).unwrap();
        setNotifyData({
          key: `notify-${nextNotifyId++}`, 
          type: "success",
          title: "Thành công",
          message: "Đã xóa sản phẩm khỏi danh sách yêu thích!",
        });
      } catch (error) {
        setNotifyData({
          key: `notify-${nextNotifyId++}`, 
          type: "error",
          title: "Thất bại",
          message: error as string,
        });
      }
    }
  };

  // const handleAddToCart = async (product_id: string | number) => {
  //   try {
  //     await dispatch(addProductToCartThunk({ product_id: Number(product_id) })).unwrap();
  //     setNotifyData({
  //       key: `notify-${nextNotifyId++}`,
  //       type: "success",
  //       title: "Thành công",
  //       message: "Đã thêm sản phẩm vào giỏ hàng!",
  //     });
  //   } catch (error) {
  //     let message = "Không thể thêm vào giỏ hàng!";
  //     if (axios.isAxiosError(error)) {
  //       message = error.response?.data?.message ?? error.message;
  //     }
  //     setNotifyData({
  //       key: `notify-${nextNotifyId++}`,
  //       type: "warning",
  //       title: "Thất bại",
  //       message: message,
  //     });
  //   }
  // };

  return (
    <div className="flex flex-col h-full w-full p-6 mt-12 md:mt-0">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách yêu thích</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : safeItems.length === 0 ? (
          <Empty description="Danh sách yêu thích của bạn đang trống" className="mt-20" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {safeItems.map((item) => (
              <Card
                key={item.product_id}
                hoverable
                // Ép Card thành flex column và cao 100% để phủ kín ô grid
                className="overflow-hidden flex flex-col h-full"
                // Ép body của Card tự động giãn ra đẩy nút xuống đáy
                styles={{ body: { padding: 16, display: 'flex', flexDirection: 'column', flexGrow: 1 } }} 
                cover={
                  <div className="relative w-full h-48">
                    <img
                      alt={item.product_name}
                      src={item.image_url || "https://placehold.co/400x300?text=No+Image"}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-3 right-3 z-10">
                      <Tooltip title="Xóa khỏi danh sách yêu thích" placement="left">
                        <Button
                          shape="circle"
                          icon={<HeartFilled style={{ color: '#ef4444', fontSize: '18px' }} />} 
                          className="border-none shadow-md bg-white/90 hover:bg-white flex items-center justify-center"
                          onClick={() => handleRemove(item.product_id)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                }
              >
                <Meta
                  // Bổ sung class flex-grow cho Meta để đẩy phần description xuống dưới cùng
                  className="flex flex-col flex-grow" 
                  title={
                    <div className="text-gray-800 whitespace-normal line-clamp-2 min-h-[44px] text-base mb-2">
                      {item.product_name}
                    </div>
                  }
                  description={
                    <div className="flex flex-col gap-4 mt-auto">
                      {/* Đã sửa min-height thành min-h */}
                      <div className="flex flex-col justify-end min-h-[48px]">
                        {(() => {
                          const minPrice = Number(item.min_price || 0);
                          const finalPrice = item.final_price ? Number(item.final_price) : minPrice;
                          const isDiscounted = finalPrice > 0 && finalPrice < minPrice;

                          if (isDiscounted) {
                            return (
                              <>
                                <span className="text-gray-500 line-through text-sm font-sans mb-1">
                                  {minPrice.toLocaleString('vi-VN')} đ
                                </span>
                                <span className="text-red-600 font-sans font-semibold text-lg leading-none">
                                  {finalPrice.toLocaleString('vi-VN')} đ
                                </span>
                              </>
                            );
                          }

                          return (
                            <span className="text-red-600 font-sans font-semibold text-lg leading-none">
                              {minPrice.toLocaleString('vi-VN')} đ
                            </span>
                          );
                        })()}
                      </div>
                      
                      {/* <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className="w-full"
                        onClick={() => handleAddToCart(item.product_id)}
                      >
                        Thêm vào giỏ
                      </Button> */}
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;