import { useEffect, useState } from "react";
import { Button, Spin, Empty, Card, Tooltip } from "antd";
import { ShoppingCartOutlined, HeartFilled } from "@ant-design/icons";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchWishlistThunk, toggleWishlistThunk } from "../store/wishlist-thunk";
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

  const handleAddToCart = async (product_id: string | number) => {
    try {
      await WishlistApi.addToCart(product_id);
      setNotifyData({
        key: `notify-${nextNotifyId++}`,
        type: "success",
        title: "Thành công",
        message: "Đã thêm sản phẩm vào giỏ hàng!",
      });
    } catch (error) {
      let message = "Không thể thêm vào giỏ hàng!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? error.message;
      }
      setNotifyData({
        key: `notify-${nextNotifyId++}`,
        type: "warning",
        title: "Thất bại",
        message: message,
      });
    }
  };

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

      <div className="bg-white p-6 rounded-lg shadow-sm min-height-[400px]">
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
                className="overflow-hidden"
                bodyStyle={{ padding: 16 }} // Thu gọn padding cho vừa vặn
                cover={
                  <div className="relative w-full h-48">
                    <img
                      alt={item.product_name}
                      src={item.image_url || "https://placehold.co/400x300?text=No+Image"}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* BỌC ABSOLUTE Ở ĐÂY: Chuyển absolute ra thẻ div bên ngoài Tooltip */}
                    <div className="absolute top-3 right-3 z-10">
                      <Tooltip title="Xóa khỏi danh sách yêu thích" placement="left">
                        <Button
                          shape="circle"
                          // Dùng style cứng để Ant Design không đè màu xanh lên trái tim
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
                  title={
                    <div className="text-gray-800 whitespace-normal line-clamp-2 min-h-[44px] text-base mb-2">
                      {item.product_name}
                    </div>
                  }
                  description={
                    <div className="flex flex-col gap-4">
                      {/* Dùng font sans-serif chuẩn để hiển thị giá tiền rõ ràng */}
                      <span className="text-red-600 font-sans font-semibold text-lg">
                        {Number(item.min_price || 0).toLocaleString('vi-VN')} đ
                      </span>
                      
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className="w-full"
                        onClick={() => handleAddToCart(item.product_id)}
                      >
                        Thêm vào giỏ
                      </Button>
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