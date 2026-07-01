import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { ShipperPortalApi } from '../api/shipper_api';
import type { ShipperProfileUpdate } from '../types/shipper';

const ShipperProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await ShipperPortalApi.getProfile();
        const profile = res.data?.profile;
        if (profile) {
          form.setFieldsValue({
            full_name: `${profile.first_name} ${profile.last_name}`,
            phone: profile.phone_number,
            personal_address: profile.personal_address,
          });
        }
      } catch (error: any) {
        message.error("Không thể tải thông tin hồ sơ!", error.response?.message || '');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [form]);

  const onFinish = async (values: ShipperProfileUpdate) => {
    try {
      setLoading(true);
      await ShipperPortalApi.updateProfile(values);
      message.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      message.error(error.response?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin className="w-full mt-10" />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="full_name" label="Họ và Tên" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="personal_address" label="Địa chỉ thường trú" rules={[{ required: true }]}>
          <Input.TextArea size="large" rows={3} />
        </Form.Item>

        

        <Button type="primary" htmlType="submit" loading={loading} className="w-full">
          Lưu thay đổi
        </Button>
      </Form>
    </div>
  );
};

export default ShipperProfile;