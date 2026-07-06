import { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShipperPortalApi } from '../api/shipper_api';
import type { MyDelivery } from '../types/shipper';

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState<MyDelivery[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await ShipperPortalApi.getMyDeliveries('accepted');
      setDeliveries(res.data?.deliveries || []);
    } catch (error: any) {
      message.error("Lỗi khi tải danh sách công việc!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const columns = [
    { title: 'Mã Đơn', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Khách hàng', dataIndex: 'customer_name', key: 'customer_name' },
    { title: 'Số điện thoại', dataIndex: 'customer_phone', key: 'customer_phone' },
    { title: 'Địa chỉ giao', dataIndex: 'delivery_address', key: 'delivery_address' },
    { 
      title: 'COD', 
      dataIndex: 'cod_amount', 
      render: (val: string) => <strong className="text-red-500">{Number(val).toLocaleString()}đ</strong> 
    },
    { 
      title: 'Hành động', 
      key: 'action', 
      render: (record: MyDelivery) => (
        <Button type="primary" onClick={() => navigate(`/shipper/orders/${record.order_id}`)}>
          Chi tiết & Giao
        </Button>
      ) 
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Đơn hàng đang giao</h2>
        <Button onClick={fetchDeliveries} loading={loading}>Làm mới</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={deliveries} 
        rowKey="order_id" 
        loading={loading} 
      />
    </div>
  );
};

export default MyDeliveries;