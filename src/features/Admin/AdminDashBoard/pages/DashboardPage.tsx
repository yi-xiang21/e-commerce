import { useEffect, useState } from 'react';
import type { DashboardData } from '@/features/Admin/AdminDashBoard/type/dashboard';
import { dashboardApi } from '@/features/Admin/AdminDashBoard/api/dashboard_api';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi.getDashBoard();
        
        const dashboardData = res.data;
        
        if (dashboardData) {
          setData(dashboardData);
        } else {
          setError('Không lấy được dữ liệu thống kê.');
        }
      } catch (err: any) {
        console.error("Lỗi khi tải Dashboard:", err);
        const serverMsg = err.response?.data?.message || err.message;
        setError(serverMsg || 'Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600 font-medium">
        Đang tải dữ liệu tổng quan...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng Quan Hệ Thống</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 
                        border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500 font-medium mb-1">
            Doanh thu hôm nay
          </p>

          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(data.revenue.today)}
          </p>

          <p className={`text-xs mt-2 font-medium ${data.revenue.growth_vs_last_week >= 0 
                ? 'text-green-500' : 'text-red-500'}`}>
            {data.revenue.growth_vs_last_week >= 0 ? '↑' : '↓'} 
            {Math.abs(data.revenue.growth_vs_last_week)}% so với tuần trước
          </p>
          
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Đơn hàng chờ xử lý</p>
          <p className="text-2xl font-bold text-gray-800">{data.orders_count.pending}</p>
          <p className="text-xs mt-2 text-gray-400 font-medium">
            Đang giao: {data.orders_count.shipping} | Hoàn thành: {data.orders_count.completed}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Khách hàng hoạt động</p>
          <p className="text-2xl font-bold text-gray-800">{data.users.active_customers}</p>
          <p className="text-xs mt-2 text-purple-500 font-medium">+ {data.users.new_this_month} khách hàng mới tháng này</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-300">
          <p className="text-sm text-gray-500 font-medium mb-1">Shipper đang hoạt động</p>
          <p className="text-2xl font-bold text-gray-800">{data.users.active_shippers}</p>
          <p className="text-xs mt-2 text-orange-300 font-medium">{data.users.active_shippers} shipper đang hoạt động</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Cảnh báo kho hàng</p>
          <p className="text-2xl font-bold text-red-600">{data.inventory_alerts.out_of_stock}</p>
          <p className="text-xs mt-2 text-orange-500 font-medium">Có {data.inventory_alerts.low_stock} sản phẩm sắp hết</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Chi tiết Doanh Thu</h3>
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
            <span className="text-gray-600">Tuần này:</span>
            <span className="font-bold text-gray-800">
                {formatCurrency(data.revenue.this_week)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tháng này:</span>
            <span className="font-bold text-green-600">
                {formatCurrency(data.revenue.this_month)}
            </span>
          </div>
        </div>

        {/* Workshop Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Hoạt động Workshop</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="bg-orange-50 p-3 rounded-lg text-center">
                <p className="text-xs text-orange-600 font-medium mb-1">Đặt lịch hôm nay</p>
                <p className="text-xl font-bold text-orange-700">
                    {data.workshop_stats.bookings_today}
                </p>
             </div>
             <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">Sắp diễn ra</p>
                <p className="text-xl font-bold text-blue-700">
                    {data.workshop_stats.upcoming_count}
                </p>
             </div>
          </div>
          {data.workshop_stats.top_workshops.length > 0 && (
            <p className="text-sm text-gray-600">
              Hot nhất: <span className="font-bold">
                            {data.workshop_stats.top_workshops[0].title}
                        </span> ({data.workshop_stats.top_workshops[0].total_bookings} lượt)
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Sản Phẩm Bán Chạy Nhất</h3>
          </div>

          <table className="w-full text-left text-sm">

            <thead className="text-gray-500 bg-white">
              <tr>
                <th className="px-5 py-3 font-medium">
                    Tên Sản Phẩm
                </th>

                <th className="px-5 py-3 font-medium text-right">
                    Số lượng bán
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data.top_selling_products.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-700">
                    {item.product_name}
                  </td>

                  <td className="px-5 py-3 text-right font-bold text-orange-500">
                    {item.total_sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bảng Đơn Hàng Mới Nhất */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Đơn Hàng Nổi Bật Hôm Nay</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 bg-white">
              <tr>
                <th className="px-5 py-3 font-medium">
                    Mã Đơn
                </th>
                
                <th className="px-5 py-3 font-medium">
                    Khách Hàng
                </th>
                
                <th className="px-5 py-3 font-medium text-right">
                    Tổng Tiền
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.top_orders_today.map((order, index) => (
                <tr key={order.order_id || index} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-blue-600">
                    {order.order_id}
                  </td>

                  <td className="px-5 py-3 text-gray-700">
                    {order.customer_name}
                  </td>

                  <td className="px-5 py-3 text-right font-bold text-green-600">
                    {formatCurrency(order.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}