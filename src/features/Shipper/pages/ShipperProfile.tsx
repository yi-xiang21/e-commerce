import { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Row, Col, message } from 'antd';
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
            full_name: `${profile.first_name} ${profile.last_name}`.trim(),
            phone: profile.phone_number, 
            personal_address: profile.personal_address,
            cccd: profile.cccd,
            license_plate: profile.license_plate,
          });
        }
      } catch (error: any) {
        message.error("Không thể tải thông tin hồ sơ!", error.response?.data?.message || error.message || error);
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
      message.success('Cập nhật thông tin cá nhân thành công!');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin className="w-full mt-20 flex justify-center" size="large" />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin cá nhân Shipper</h2>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="full_name" label="Họ và Tên" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="personal_address" label="Địa chỉ thường trú" rules={[{ required: true }]}>
          <Input.TextArea size="large" rows={3} />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="cccd" label="Số CCCD" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="license_plate" label="Biển số xe" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" loading={loading} size="large" className="w-full mt-2">
          Lưu thay đổi
        </Button>
      </Form>
    </div>
  );
};

export default ShipperProfile;