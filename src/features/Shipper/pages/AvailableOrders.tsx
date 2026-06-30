import { useEffect, useState } from 'react';
import { Table, Button, Tag, message } from 'antd';
import type { TableProps } from 'antd/es/table';
import { ShipperPortalApi } from '../api/shipper_api';
import type { AvailableOrder } from '../types/shipper';

const AvailableOrders = () => {
  const [orders, setOrders] = useState<AvailableOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ShipperPortalApi.getAvailableOrders();
      setOrders(response.data || []);
    } catch (error: any) {
      message.error("Lỗi khi tải danh sách đơn hàng!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const res = await ShipperPortalApi.acceptOrder(orderId);
      message.success(res.data?.message || "Nhận đơn thành công!");
      fetchOrders();
    } catch (error: any) {
      message.error(error.response?.message || "Không thể nhận đơn!");
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<AvailableOrder>['columns'] = [
    { title: 'Mã Đơn', dataIndex: 'order_id', key: 'order_id', width: 100 },
    { title: 'Địa chỉ lấy hàng', dataIndex: 'pickup_address', key: 'pickup_address' },
    { title: 'Địa chỉ giao hàng', dataIndex: 'delivery_address', key: 'delivery_address' },
    { 
      title: 'Tiền thu hộ (COD)', 
      dataIndex: 'cod_amount', 
      key: 'cod_amount',
      render: (amount: string) => <span className="font-semibold text-red-600">{Number(amount).toLocaleString()} đ</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="blue">{status}</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" loading={loading} onClick={() => handleAcceptOrder(record.order_id)}>
          Nhận đơn
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đơn hàng chờ lấy</h2>
        <Button onClick={fetchOrders} loading={loading}>Làm mới</Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="order_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AvailableOrders;