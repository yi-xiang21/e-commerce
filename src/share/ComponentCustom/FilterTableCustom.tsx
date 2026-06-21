import React from "react";
import { Form, Input, Select, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { FormFieldType } from "@/share/types/type-form-field";
import type { FilterField } from "@/share/types/filter_param";
import SelectFetchCustom from "@/share/ComponentCustom/select/SelectFetchCustom";

interface FilterHeaderProps {
  fields: FilterField[];
  onSearch: (values: Record<string, any>) => void;
  loading?: boolean;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  fields,
  onSearch,
  loading,
}) => {
  // Sử dụng hook useForm của Ant Design để quản lý form, tạo một instance form để có thể gọi các phương thức như resetFields
  const [form] = Form.useForm();

  // Hàm xử lý khi người dùng submit form, sẽ nhận vào giá trị của form dưới dạng một object, sau đó sẽ lọc bỏ các trường có giá trị undefined, null hoặc chuỗi rỗng,
  const handleFinish = (values: any) => {
    // Sử dụng Object.keys để lấy danh sách các key của object values, sau đó sử dụng reduce để tạo ra một object mới cleanValues chỉ chứa các trường có giá trị hợp lệ (không phải undefined, null hoặc chuỗi rỗng)
    const cleanValues = Object.keys(values).reduce(
      (acc, key) => {
        if (
          values[key] !== undefined &&
          values[key] !== null &&
          values[key] !== ""
        ) {
          if (Array.isArray(values[key]) && values[key].length === 0)
            return acc;
          acc[key] = values[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    // Gọi hàm onSearch với object cleanValues đã được lọc, để thực hiện tìm kiếm hoặc lọc dữ liệu dựa trên các trường có giá trị hợp lệ
    onSearch(cleanValues);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4 border border-gray-100">
      <Form
        form={form}
        layout="inline"
        onFinish={handleFinish}
        className="gap-y-3"
      >
        {fields.map((field) => (
          <Form.Item key={field.key} name={field.key} label={field.label}>
            {field.type === FormFieldType.Input && (
              <Input
                placeholder={field.placeholder}
                allowClear
                style={{ width: field.width || 200 }}
              />
            )}

            {field.type === FormFieldType.Select && (
              <Select
                mode={field.mode}
                placeholder={field.placeholder}
                options={field.options}
                allowClear
                style={{ width: field.width || 200 }}
              />
            )}
            {field.type === FormFieldType.SelectFetch && (
              <SelectFetchCustom
                placeholder={field.placeholder}
                fetchOptions={field.fetchOptions}
              />
            )}
          </Form.Item>
        ))}

        {/* Nút Tìm kiếm và Reset */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={handleReset}
              icon={<ReloadOutlined />}
              disabled={loading}
            >
              Làm mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterHeader;
