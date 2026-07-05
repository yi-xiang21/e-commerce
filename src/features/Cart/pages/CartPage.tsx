import React, { useEffect } from "react";
import {
  Card,
  Button,
  Popconfirm,
  Typography,
  Empty,
  Image,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  fetchCart,
  updateItemQuantity,
  removeCartItem,
} from "../store/cart-thunk";
import { getCartItemPriceInfo } from "../utils/cart-price";

const { Text } = Typography;

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (
    variant_id: number,
    newQuantity: number,
    stock: number,
  ) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      dispatch(updateItemQuantity({ variant_id, quantity: newQuantity }));
    }
  };

  const handleRemove = (variant_id: number) => {
    dispatch(removeCartItem(variant_id));
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">Đang tải giỏ hàng...</div>
    );
  }

  return (
    <div className="container px-4 py-10 mx-auto max-w-7xl">
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <Card className="py-12 border-dashed rounded-2xl">
          <Empty
            description={
              <span className="text-gray-500">Giỏ hàng đang trống.</span>
            }
          />
          <div className="mt-6 text-center">
            <Button
              type="primary"
              size="large"
              href="/shop"
              className="bg-blue-600"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cột Danh sách sản phẩm */}
          <div className="w-full lg:w-2/3 flex flex-col gap-5">
            {items.map((item) => (
              <Card
                key={item.variant_id}
                bordered={true}
                className="transition-shadow overflow-hidden rounded-xl shadow-sm hover:shadow-md"
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <Image
                      src={item.image_url || "/placeholder.png"}
                      alt={item.product_name}
                      width={90}
                      height={90}
                      className="object-cover rounded-lg"
                      fallback="/placeholder.png"
                      preview={false}
                    />
                    <div className="flex flex-col">
                        <Text strong className="mb-1 text-lg text-gray-800">{item.product_name}</Text>
                        <Text type="secondary" className="mb-2">Màu: {item.color} | Size: {item.size}</Text>

                        <div className="flex flex-col items-start mt-1 gap-1">
                          {(() => {
                            const priceInfo = getCartItemPriceInfo(item);

                            return (
                              <>
                                {priceInfo.hasDiscount ? (
                                  <>
                                    <Text delete type="secondary" className="font-sans text-sm">
                                      {formatCurrency(priceInfo.originalPrice)}
                                    </Text>
                                    <Text strong className="font-sans text-base text-red-600">
                                      {formatCurrency(priceInfo.effectivePrice)}
                                    </Text>
                                    <Text className="text-green-600 text-sm font-medium">
                                      Giảm {priceInfo.discountPercent.toFixed(0)}%
                                    </Text>
                                  </>
                                ) : (
                                  <Text strong className="font-sans text-base text-red-600">
                                    {formatCurrency(priceInfo.effectivePrice)}
                                  </Text>
                                )}
                              </>
                            );
                          })()}
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full gap-8 sm:w-auto sm:justify-end">
                    <div className="flex overflow-hidden items-center border border-gray-300 rounded-lg">
                      <Button
                        type="text"
                        icon={<MinusOutlined className="text-xs" />}
                        onClick={() =>
                          handleQuantityChange(
                            item.variant_id,
                            item.quantity - 1,
                            item.stock_quantity,
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="flex justify-center items-center w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-none"
                      />
                      <div className="flex justify-center items-center w-12 h-9 font-medium text-gray-800 border-x border-gray-300">
                        {item.quantity}
                      </div>
                      <Button
                        type="text"
                        icon={<PlusOutlined className="text-xs" />}
                        onClick={() =>
                          handleQuantityChange(
                            item.variant_id,
                            item.quantity + 1,
                            item.stock_quantity,
                          )
                        }
                        disabled={item.quantity >= item.stock_quantity}
                        className="flex justify-center items-center w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-none"
                      />
                    </div>

                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ?"
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                      onConfirm={() => handleRemove(item.variant_id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined className="text-lg" />}
                        className="flex justify-center items-center p-2"
                      />
                    </Popconfirm>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Cột Tóm tắt đơn hàng */}
          <div className="w-full lg:w-1/3 sticky top-24 m-0">
            <Card
              className="border-gray-200 shadow-sm rounded-xl m-0"
              bodyStyle={{ padding: "24px" }}
            >
              <h2 className="mb-6 text-lg font-bold text-gray-800">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex justify-between mb-4">
                <Text type="secondary" className="text-base">
                  Tổng sản phẩm:
                </Text>
                <Text strong className="text-base">
                  {items.length} mục
                </Text>
              </div>

              <Divider className="my-4" />

              <div className="flex justify-between items-center mb-8">
                <Text strong className="text-lg">
                  Tổng tiền:
                </Text>
                <Text strong className="font-sans text-xl text-red-600">
                  {formatCurrency(
                    items.reduce((total, item) => {
                      const priceInfo = getCartItemPriceInfo(item);
                      return total + priceInfo.effectivePrice * item.quantity;
                    }, 0),
                  )}
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                block
                href={user ? "/checkout" : "/auth/login"}
                className="font-medium bg-blue-600 rounded-lg hover:bg-blue-700 h-12 text-base border-none"
              >
                {user ? "Tiến hành thanh toán" : "Đăng nhập để thanh toán"}
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;