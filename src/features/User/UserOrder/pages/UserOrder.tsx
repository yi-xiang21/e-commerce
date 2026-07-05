import { useCallback, useEffect, useState } from "react";
import { orderApi } from "../api/order-api";
import { userApi } from "../../UserProfile/api/user-api";
import Badge from "antd/es/badge/Badge";
import Avatar from "antd/es/avatar/Avatar";
import { Radio } from 'antd';
import type { user } from "@/features/Auth/types/auth-type";
import { useAppSelector } from "@/app/redux/hooks";

interface Billing {
  phuong_xa_id: number;
  dia_chi_giao_hang: string;
  ten_nguoi_nhan: string;
  sdt_nguoi_nhan: string;
  phieu_giam_gia_code?: string;
  phuong_thuc_thanh_toan: string;
  shipping_method_id: string;
}

const defaultBilling: Billing = {
  phuong_xa_id: 0,
  dia_chi_giao_hang: "",
  ten_nguoi_nhan: "",
  sdt_nguoi_nhan: "",
  phieu_giam_gia_code: "",
  phuong_thuc_thanh_toan: "COD",
  shipping_method_id: "GH_NHANH"
};


const UserOrder = () => {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [wards, setWards] = useState([]);
  const [billing, setBilling] = useState<Billing>(defaultBilling);
  const { user } = useAppSelector((state) => state.auth);
  const [shippingFee, setShippingFee] = useState<any[]>([]);

  const [cartItems, setCartItems] = useState<any[]>([]);

  const [voucher, setVoucher] = useState<any[]>([]);

  const userProfile = useCallback(async () => {
    setLoading(true);
    try {
      
      const citiesData = await orderApi.getCities();
      const cartItemsData = await orderApi.getCartItems();
      const voucherData = await orderApi.getMyVouchers();
      const shippingFeeData = await orderApi.getShippingFee();
      setShippingFee(shippingFeeData.data || []);
      
      setVoucher(voucherData.data.vouchers || []);
      console.log("Voucher data:", voucherData);
      
      if (user) {
        setBilling({
          ...billing,
          ten_nguoi_nhan: `${user.first_name} ${user.last_name}`,
          sdt_nguoi_nhan: user.phone_number,
        } as Billing);
      }
      setCities(citiesData.data.cities || []);
      setCartItems(cartItemsData.data.cart || []);
      // setProducts(productsData.data.products || []);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  console.log("Current billing state:", billing);
  console.log("shipping fee state:", shippingFee);


  useEffect(() => {
    userProfile();
  }, [userProfile]);

  const selectCity = (value: string | null) => {
    setSelectedCity(value);
    setWards([]);
    setBilling({ ...billing, phuong_xa_id: 0 } as Billing);
    if (value) {
      orderApi
        .getWards(value)
        .then((response) => {
          setWards(response.data.wards || []);
        })
        .catch((error) => {
          console.error("Failed to fetch wards:", error);
        });
    }
  };

  const handlePaymentMethodChange = (e: any) => {
    setBilling({ ...billing, phuong_thuc_thanh_toan: e.target.value } as Billing);
  }

  const handleSubTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  const handleTotal = () => {
  // 1. Tính phí ship riêng biệt trước để tránh lặp lại code
  const currentShippingFee = billing.shipping_method_id 
    ? (shippingFee.find(fee => fee.method_id === billing.shipping_method_id)?.fee || 0) 
    : 0;

  const subTotal = handleSubTotal();

  if (billing.phieu_giam_gia_code) {
    const selectedVoucher = voucher.find(v => v.code === billing.phieu_giam_gia_code);
    if (selectedVoucher) {
      if (selectedVoucher.discount_type === "fixed") {
        return subTotal - selectedVoucher.value + currentShippingFee;
      } else if (selectedVoucher.discount_type === "percent") {
        const discountAmount = Math.min(subTotal * (selectedVoucher.value / 100), selectedVoucher.max_discount);
        return subTotal - discountAmount + currentShippingFee;
      }
    }
  }
  
  return subTotal + currentShippingFee;
}

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  }

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        ...billing,
        cart_items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  console.log("Billing:", billing);
  console.log("Promotion:", voucher);

  return (
    <div className="flex gap-4 justify-between w-4/5 mx-auto my-8 h-screen p-4 overflow-hidden">
      <div className="flex flex-col gap-9 w-3/4 items-start overflow-y-auto">
        <h2 className="text-3xl font-bold">Thông tin thanh toán</h2>
        <div className="flex gap-4 w-full justify-between">
          <div className="flex flex-col w-full">
            <p className="font-medium">Họ và Tên * </p>
            <input
              className="font-semibold border border-gray-300 p-2 w-full text-left shadow"
              value={billing?.ten_nguoi_nhan}
              onChange={(e) =>
                setBilling({
                  ...billing,
                  ten_nguoi_nhan: e.target.value,
                } as Billing)
              }
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-medium">Email * </p>
          <input
            className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
            value={user?.email}
          />
        </div>

        <div className="flex flex-col w-full">
          <p className="font-medium">Số điện thoại * </p>
          <input
            className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
            value={user?.phone_number}
          />
        </div>

        <div className="flex flex-col w-full">
          <p className="font-medium">Thành phố * </p>
          <select
            className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
            value={selectedCity}
            onChange={(e) => selectCity(e.target.value)}
          >
            <option value="">Chọn thành phố</option>
            {cities.map((city: any) => (
              <option key={city.city_code} value={city.city_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-medium">Phường/Xã * </p>
          <select
            className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
            value={billing?.phuong_xa_id || ""}
            onChange={(e) =>
              setBilling({
                ...billing,
                phuong_xa_id: Number(e.target.value),
              } as Billing)
            }
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward: any) => (
              <option key={ward.ward_code} value={ward.ward_code}>
                {ward.ward_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-medium">Địa chỉ cụ thể </p>
          <input
            className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
            placeholder="Số nhà, tên đường..."
            onChange={(e) =>
              setBilling({
                ...billing,
                dia_chi_giao_hang: e.target.value,
              } as Billing)
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-9 w-3/5 items-start  border border-amber-800 shadow p-6 h-auto">
        <h2 className="text-3xl font-bold">Đơn hàng của bạn</h2>
        <div className="flex flex-col gap-4 w-full overflow-y-auto pr-2">
          <div className="flex justify-between w-full border-b-2 border-gray-300 pb-2">
          <p className="font-medium text-gray-700">Sản phẩm</p>
          <p className="font-medium text-gray-700">Giá</p>
        </div>

        <div className="flex justify-between w-full border-b-2 border-gray-300 pb-2">
          <div className="flex flex-col gap-4 justify-start w-full border-gray-300 pb-2">
            {cartItems.map((item) => (
              <div className="flex justify-between gap-4 items-center">
                <div className="flex gap-4 items-center w-full">
                  <Badge count={item.quantity} color="green">
                    <Avatar
                      shape="square"
                      src={
                        item.product_image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={item.product_name || "Product Image"}
                      size="large"
                    />
                  </Badge>
                  <div className="flex flex-col justify-center gap-2 pl-4">
                    <div className="font-medium">
                      {item.product_name || "Tên sản phẩm"}
                    </div>
                    <div className="text-gray-600">
                      Số lượng: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-semibold flex justify-center h-full text-gray-700">
                  {formatPrice(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between w-full border-b-2 gap-4 border-gray-300 pb-4">
          <div className="font-medium">Mã giảm giá</div>
          <select
            className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
            value={billing?.phieu_giam_gia_code || ""}
            onChange={(e) =>
              setBilling({
                ...billing,
                phieu_giam_gia_code: e.target.value,
              } as Billing)
            }
          >
            <option value="">Chọn mã giảm giá</option>
            {voucher.map((vouch: any) => (
              <option className="font-medium w-full" key={vouch.voucher_id} value={vouch.code}>
                {vouch.discount_type === "fixed" ? `Giảm ` + formatPrice(vouch.value) + ` - Đơn tối thiểu ` + formatPrice(vouch.minimum_value) : `Giảm ` + vouch.value + "%" + ` - Đơn tối thiểu ` + formatPrice(vouch.minimum_value) + ` - Giảm tối đa ` + formatPrice(vouch.max_discount)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-between w-full border-b-2 gap-4 border-gray-300 pb-4">
          <div className="font-medium">Phương thức vận chuyển</div>
          <select 
          className="font-semibold border border-gray-300 p-2  w-full text-left shadow"
          value={billing.shipping_method_id || ""}
          onChange={(e) =>
            setBilling({
              ...billing,
              shipping_method_id: e.target.value,
            } as Billing)
          }
          >
            {shippingFee.map((fee: any) => (
              <option className="font-medium w-full" key={fee.method_id} value={fee.method_id}>
                {fee.name} - {formatPrice(fee.fee)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 w-full border-b-2 border-gray-300 pb-4">
          <div className="flex justify-between w-full">
            <p>Tạm tính</p>
            <p>{formatPrice(handleSubTotal())}</p>
          </div>
          <div className="flex justify-between w-full">
            <p>Phí vận chuyển</p>
            <p>{formatPrice(billing.shipping_method_id ? shippingFee.find(fee => fee.method_id === billing.shipping_method_id)?.fee || 0 : 0)}</p>
          </div>
        </div>

        <div className="flex justify-between w-full border-b-2 border-gray-300 pb-4">
          <div className="flex justify-between w-full">
            <div className="font-bold text-lg">Tổng cộng</div>
            <div className="font-bold text-lg">{formatPrice(handleTotal())}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="font-medium text-xl text-gray-700">
            Phương thức thanh toán
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Radio
                value="COD"
                checked={billing.phuong_thuc_thanh_toan === "COD"}
                onChange={handlePaymentMethodChange}
              />
              <span>Thanh toán khi nhận hàng</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                value="MOMO"
                checked={billing.phuong_thuc_thanh_toan === "MOMO"}
                onChange={handlePaymentMethodChange}
              />
              <span>Thanh toán qua MOMO</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-500 w-full text-white p-3 items-center text-center rounded cursor-pointer">
          Thanh toán
        </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
