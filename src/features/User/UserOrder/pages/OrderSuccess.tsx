import { Button, Result } from "antd";

const OrderSuccess = () => {


  return (
    <Result
      status="success"
      title="Đặt hàng thành công!"
      subTitle="Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý và sẽ được giao đến bạn trong thời gian sớm nhất."
      extra={[
        <Button type="primary" key="home" href="/">
            Quay lại trang chủ
        </Button>,
        <Button key="buy">Mua lại</Button>,
      ]}
    />
  );
};

export default OrderSuccess;
