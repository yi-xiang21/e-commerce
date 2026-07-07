import { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ShipperPortalApi } from '../api/shipper_api';
import type { MyDelivery } from '../types/shipper';

const DeliveryHistory = () => {
  const [history, setHistory] = useState<MyDelivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('delivered');
  const navigate = useNavigate();

  const fetchHistory = async (status: string) => {
    try {
      setLoading(true);
      const res = await ShipperPortalApi.getMyDeliveries(status);
      const deliveries: MyDelivery[] = res.data?.deliveries || [];

      deliveries.sort((a, b) => {
        const timeA = new Date(a.completed_at || 0).getTime();
        const timeB = new Date(b.completed_at || 0).getTime();
        return timeB - timeA;
      });

      setHistory(deliveries);
    } catch (error: any) {
      message.error("Lỗi khi tải lịch sử giao hàng!", error.response?.data?.message || error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API mỗi khi chuyển Tab
  useEffect(() => {
    fetchHistory(activeTab);
  }, [activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const columns = [
    { 
      title: 'Mã Đơn', 
      dataIndex: 'order_id', 
      key: 'order_id',
      render: (text: string) => <span className="font-semibold text-gray-700">{text}</span>
    },
    { 
      title: 'Khách hàng', 
      dataIndex: 'customer_name', 
      key: 'customer_name' 
    },
    { 
      title: 'Địa chỉ', 
      dataIndex: 'delivery_address', 
      key: 'delivery_address',
      ellipsis: true 
    },
    { 
      title: 'Tiền thu hộ (COD)', 
      dataIndex: 'cod_amount', 
      render: (val: string) => <span className="text-gray-600 font-medium">{Number(val).toLocaleString()}đ</span> 
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'delivery_status', 
      key: 'delivery_status',
      render: (status: string) => {
        if (status === 'delivered') return <Tag color="success">Thành công</Tag>;
        if (status === 'failed') return <Tag color="error">Thất bại</Tag>;
        return <Tag color="default">{status}</Tag>;
      }
    },
    { 
      title: 'Hoàn tất lúc', 
      dataIndex: 'completed_at', 
      render: (val: string) => val ? new Date(val).toLocaleString('vi-VN') : '-' 
    },
    { 
      title: 'Hành động', 
      key: 'action', 
      render: (record: MyDelivery) => (
        <Button size="small" onClick={() => navigate(`/shipper/orders/${record.order_id}`)}>
          Xem chi tiết
        </Button>
      ) 
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'delivered',
      label: 'Giao thành công',
      children: (
        <Table 
          columns={columns} 
          dataSource={history} 
          rowKey="order_id" 
          loading={loading} 
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 800 }} 
        />
      ),
    },
    {
      key: 'failed',
      label: 'Giao thất bại',
      children: (
        <Table 
          columns={columns} 
          dataSource={history} 
          rowKey="order_id" 
          loading={loading} 
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 800 }} 
        />
      ),
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử giao hàng</h2>
        <Button onClick={() => fetchHistory(activeTab)} loading={loading} type="primary" ghost>
          Làm mới
        </Button>
      </div>
      
      <Tabs 
        defaultActiveKey="delivered" 
        items={items} 
        onChange={handleTabChange} 
        size="large"
      />
    </div>
  );
};

export default DeliveryHistory;