import { useEffect, useState } from "react";
import { Button, Spin, Empty } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchWishlistThunk, toggleWishlistThunk } from "../store/wishlist-thunk";
import { WishlistApi } from "../api/wishlist_api";
import Notification, { type NotificationType } from "@/share/ComponentCustom/Notification/Notification";

// Tạo một biến đếm toàn cục bên ngoài component để tạo key duy nhất.
let nextNotifyId = 0;

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.wishlist);
  
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
        key: `notify-${nextNotifyId++}`, // Đã thay thế Date.now()
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
        key: `notify-${nextNotifyId++}`, // Đã thay thế Date.now()
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
        ) : items.length === 0 ? (
          <Empty description="Danh sách yêu thích của bạn đang trống" className="mt-20" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.wishlist_id} className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow">
                <img 
                  src={item.image_url} 
                  alt={item.product_name} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold text-lg line-clamp-2 min-height-[56px] text-gray-800">
                  {item.product_name}
                </h3>
                <p className="text-red-600 font-sans font-medium text-lg my-2 tracking-wide">
                  {item.price.toLocaleString('vi-VN')} đ
                </p>
                
                <div className="mt-auto flex gap-2 pt-4">
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />} 
                    className="flex-1"
                    onClick={() => handleAddToCart(item.product_id)}
                  >
                    Thêm
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemove(item.product_id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;