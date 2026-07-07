import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Table, Form, Input, Select, Button, Card, message } from 'antd';
import { ShipperPortalApi } from '../api/shipper_api';
import type { OrderDetail as IOrderDetail } from '../types/shipper';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res = await ShipperPortalApi.getOrderDetail(id);
        setOrder(res.data?.order);
      } catch (error: any) {
        message.error("Lỗi khi tải chi tiết đơn hàng!", error.response?.data?.message || error.message || error);
      }
    };
    fetchDetail();
  }, [id]);

  const onFinish = async (values: any) => {
    if (!id) return;
    try {
      setLoading(true);
      await ShipperPortalApi.updateDeliveryStatus(id, {
        status: values.status,
        failed_reason: values.failed_reason || ""
      });

      message.success("Cập nhật trạng thái thành công!");
      navigate('/shipper/my-deliveries');
    } catch (error: any) {
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const selectedStatus = Form.useWatch('status', form);

  if (!order) return <p className="p-6">Đang tải chi tiết đơn hàng...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Chi tiết đơn {order.order_id}</h2>
         <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>

      <Card title="Thông tin giao hàng">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Khách hàng">{order.customer_name}</Descriptions.Item>
          <Descriptions.Item label="Điện thoại">{order.customer_phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>{order.delivery_address}</Descriptions.Item>
          <Descriptions.Item label="Tiền thu hộ (COD)">
            <strong className="text-red-500">{Number(order.cod_amount).toLocaleString()} đ</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {Number(order.total_amount).toLocaleString()} đ
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Sản phẩm">
        <Table 
          dataSource={order.items} 
          rowKey={(record) => `${record.product_name}-${record.color}-${record.size}`}
          pagination={false}
          columns={[
            { title: 'Sản phẩm', dataIndex: 'product_name' },
            { title: 'Màu sắc', dataIndex: 'color' },
            { title: 'Size', dataIndex: 'size' },
            { title: 'SL', dataIndex: 'quantity' },
          ]}
        />
      </Card>

      {order.delivery_status === 'accepted' && (
        <Card title="Cập nhật trạng thái giao hàng" className="bg-sky-50">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="success">Giao thành công</Select.Option>
                <Select.Option value="failed">Giao thất bại</Select.Option>
              </Select>
            </Form.Item>

            {selectedStatus === 'failed' && (
              <Form.Item name="failed_reason" label="Lý do thất bại" rules={[{ required: true }]}>
                <Input.TextArea rows={3} placeholder="Ví dụ: Khách không nghe máy, boom hàng..." />
              </Form.Item>
            )}

            <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-2">
              Xác nhận hoàn tất
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default OrderDetail;