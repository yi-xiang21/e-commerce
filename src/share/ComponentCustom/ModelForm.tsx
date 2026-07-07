import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import DynamicForm from "@/share/ComponentCustom/DynamicForm";
import ChildTabs from "@/share/ComponentCustom/ChildTabs"; // Import component vừa tạo
import type { FormField } from "@/share/types/form-field";
import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import validateForm from "@/share/ComponentCustom/validateForm";
import { validateChildren } from "@/share/ComponentCustom/validateFormChildren";
interface FormModalProps<T extends object> {
  // Trạng thái mở/đóng của modal
  isOpen: boolean;
  onClose: () => void;
  // Chế độ của form modal (xem, tạo mới, chỉnh sửa)
  mode: FormModalModeType;
  // Tiêu đề của modal
  title: string;
  // Các trường của form, định nghĩa cấu trúc và loại của từng trường
  fields: FormField<any>[];
  // Giá trị ban đầu của form, sẽ được sử dụng để điền vào các trường khi modal mở
  initialValues: T;
  // Hàm xử lý khi người dùng submit form, nhận vào giá trị của form dưới dạng đối tượng T
  onSubmit: (values: T) => void;
  // Trạng thái loading khi submit form, có thể được sử dụng để hiển thị spinner hoặc disable nút submit
  loading?: boolean;
  // Khóa của trường con trong dữ liệu, nếu có cấu trúc dữ liệu lồng nhau
  childKey?: keyof T;
  // Nếu form có chứa các trường con (ví dụ: một danh sách các mục con), thì hasChildren sẽ được đặt thành true
  hasChildren?: boolean;
  // Các trường của form con, sẽ được sử dụng nếu hasChildren là true để định nghĩa cấu trúc của các mục con
  childFields?: FormField<any>[];
  // Tiền tố cho tên tab khi hiển thị các mục con, nếu có cấu trúc dữ liệu lồng nhau
  tabNamePrefix?: string;
  // Giới hạn số lượng mục con có thể thêm vào, nếu có cấu trúc dữ liệu lồng nhau
  nestedLimit?: number;
}

const FormModal = <T extends object>({
  isOpen,
  onClose,
  mode,
  title,
  fields,
  initialValues,
  onSubmit,
  childKey,

  loading,
  hasChildren = false,
  childFields,
  nestedLimit = 0,
  tabNamePrefix,
}: FormModalProps<T>) => {
  // State để quản lý dữ liệu của form, khởi tạo với initialValues
  const [formData, setFormData] = useState<any>(initialValues);

  // Khi modal mở hoặc initialValues thay đổi, cập nhật formData với initialValues mới
  useEffect(() => {
    if (isOpen) {
      // Khi modal mở, đặt formData về giá trị ban đầu từ initialValues
      setFormData(initialValues);
    }
  }, [isOpen, initialValues]);

  // Xác định xem form đang ở chế độ xem (VIEW) hay không, để điều chỉnh giao diện và hành vi của form
  const isViewMode = mode === FormModalMode.VIEW;
  // Nếu có childFields được cung cấp, sử dụng chúng làm activeChildFields, nếu không thì sử dụng fields làm mặc định cho các trường con vd quan ly san pham va cac bien the cua san pham thi childFields se la cac truong cua bien the san pham, con fields se la cac truong cua san pham
  const activeChildFields = childFields || fields;
  // tao state error de luu tru loi xay ra khi validate form, ban dau la mot object rong
  const [error, setError] = useState<Record<string, string>>({});
  // Xác định khóa của trường con trong dữ liệu, nếu childKey được cung cấp thì sử dụng nó, nếu không thì mặc định là "children" cau hinh key cho cac truong con, vd quan ly san pham va cac bien the cua san pham thi childKey se la "variants" de luu tru danh sach cac bien the cua san pham do, con neu quan ly danh muc va cac danh muc con thi childKey se la "children" de luu tru danh sach cac danh muc con cua danh muc do
  const activeChildKey = (childKey as string) || "children";
  
  // Hàm xử lý khi có sự thay đổi trong form, nhận vào key của trường và giá trị mới, cập nhật formData tương ứng và xóa lỗi liên quan đến trường đó nếu có
  const handleParentChange = (key: string, value: unknown) => {
    // Cập nhật formData với giá trị mới cho trường có key tương ứng
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    // Xóa lỗi liên quan đến trường đó nếu có, bằng cách tạo một bản sao của error hiện tại, xóa lỗi với key tương ứng và cập nhật lại state error

    setError((prev) => {
      const newErrors = { ...prev };

      delete newErrors[key];

      return newErrors;
    });
  };

  // Hàm xử lý khi có sự thay đổi trong các trường con (nếu hasChildren là true), nhận vào mảng mới của các mục con, cập nhật formData tương ứng và xóa lỗi liên quan đến các mục con đó nếu có
  const handleChildrenArrayChange = (newChildrenArray:any) => {
    // Cập nhật formData với mảng mới cho trường con có key tương ứng
    setFormData((prev: any) => ({
      ...prev,
      [activeChildKey]: newChildrenArray,
    }));
    // Xóa lỗi liên quan đến các mục con đó nếu có, bằng cách tạo một bản sao của error hiện tại, xóa tất cả lỗi có key bắt đầu với activeChildKey (ví dụ: "variants" hoặc "children") và cập nhật lại state error
    setError((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(activeChildKey)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  // Hàm xử lý khi người dùng submit form, thực hiện validate dữ liệu của form và các mục con (nếu có),
  //  nếu có lỗi thì cập nhật state error để hiển thị lỗi, nếu không có lỗi thì gọi onSubmit với dữ liệu của form
  const handleSubmit = () => {
    // 1. Khởi tạo mảng fields mặc định để validate
    let fieldsToValidate = fields;
    let childFieldsToValidate = activeChildFields;

    // 2. Xử lý riêng cho chế độ EDIT
    if (mode === FormModalMode.EDIT) {
      // Khai báo các type (hoặc name) của field thời gian mà bạn muốn bỏ qua
      // NOTE: Bạn hãy điều chỉnh mảng này khớp với định nghĩa trong FormField của bạn
      const timeFieldTypes = ['time', 'date', 'datetime', 'datePicker', 'timePicker'];

      // Lọc bỏ các field thời gian khỏi danh sách validate của cha
      fieldsToValidate = fields.filter(
        (field) => !timeFieldTypes.includes(field.type as string)
      );

      // Lọc bỏ các field thời gian khỏi danh sách validate của con (nếu có)
      if (hasChildren && activeChildFields) {
        childFieldsToValidate = activeChildFields.filter(
          (field) => !timeFieldTypes.includes(field.type as string)
        );
      }
    }

    // 3. Truyền danh sách fields đã được lọc vào hàm validate
    const parentErrors = validateForm(formData, fieldsToValidate);

    const childErrors = hasChildren 
      ? validateChildren(formData[activeChildKey] || [], childFieldsToValidate, activeChildKey)
      : {};

    const validationErrors = {
      ...parentErrors,
      ...childErrors,
    };

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError({});
    onSubmit?.(formData);
};

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      destroyOnHidden
      centered
      width={hasChildren ? 900 : 520}
      // Footer của modal sẽ hiển thị nút "Đóng" nếu đang ở chế độ xem (VIEW), hoặc nút "Hủy" và "Lưu lại" nếu đang ở chế độ tạo mới (CREATE) hoặc chỉnh sửa (EDIT), 
      // nút "Lưu lại" sẽ bị disable và hiển thị spinner nếu đang ở trạng thái loading, và sẽ gọi handleSubmit khi được click
      footer={[
        <Button key="cancel" onClick={onClose}>
          {isViewMode ? "Đóng" : "Hủy"}
        </Button>,
        !isViewMode && (
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            {hasChildren ? "Lưu toàn bộ" : "Lưu lại"}
          </Button>
        ),
      ]}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto p-1 flex flex-col">
        <div
          className={
            hasChildren ? "bg-white p-4 border border-blue-200 rounded-md" : ""
          }
        >
          {hasChildren && (
            <h3 className="text-lg font-bold text-blue-600 mb-4">
              Thông tin gốc
            </h3>
          )}
          {/* Hiển thị form chính (parent) với các trường được định nghĩa trong fields, truyền vào giá trị của formData, 
          hàm handleParentChange để xử lý khi có sự thay đổi trong form, */}
          <DynamicForm
          // Các trường của form chính, sẽ được sử dụng để định nghĩa cấu trúc của form chính, 
          // nếu childFields được cung cấp thì sử dụng chúng, nếu không thì sử dụng fields làm mặc định
            fields={fields}
            // Giá trị của form chính, lấy từ formData, nếu formData không có giá trị cho một trường nào đó thì mặc định sẽ là undefined
            values={formData}
            // Hàm xử lý khi có sự thay đổi trong form chính, sẽ cập nhật formData tương ứng với key và giá trị mới của trường đó
            onChange={(key, val) => handleParentChange(key as string, val)}
            // Truyền vào isViewMode để component DynamicForm có thể điều chỉnh giao diện và hành vi của các trường tương ứng, ví dụ: disable các trường khi ở chế độ xem
            disabled={isViewMode}
            // Truyền vào error để component DynamicForm có thể hiển thị lỗi tương ứng cho các trường, error sẽ chứa các key tương ứng với các trường (ví dụ: "username" hoặc "email") và giá trị là thông báo lỗi
            error={error}
          />
        </div>
        {/* Nếu hasChildren là true, hiển thị component ChildTabs để quản lý các mục con, 
        truyền vào danh sách các mục con từ formData, */}

        {hasChildren && (
          <ChildTabs
          // Dữ liệu của các mục con, lấy từ formData với key là activeChildKey (ví dụ: "variants" hoặc "children"), 
          // nếu không có thì mặc định là một mảng rỗng
            dataList={formData[activeChildKey] || []}
            // Hàm xử lý khi có sự thay đổi trong các mục con, sẽ cập nhật formData tương ứng với mảng mới của các mục con
            onChange={handleChildrenArrayChange}
            // Các trường của form con, sẽ được sử dụng để định nghĩa cấu trúc của các mục con, 
            // nếu childFields được cung cấp thì sử dụng chúng, nếu không thì sử dụng fields làm mặc định
            fields={activeChildFields}
            // Trạng thái xem (VIEW) hay không, sẽ được sử dụng để điều chỉnh giao diện và hành vi của form con
            nestedLimit={nestedLimit}
            // Truyền vào isViewMode để component ChildTabs có thể điều chỉnh giao diện và hành vi của các trường con tương ứng, ví dụ: disable các trường khi ở chế độ xem
            isViewMode={isViewMode}
            // Tiền tố cho tên tab khi hiển thị các mục con, nếu có cấu trúc dữ liệu lồng nhau, sẽ được sử dụng để tạo tên tab động dựa trên index của mục con (ví dụ: "Mục con 1", "Mục con 2", ...)
            tabNamePrefix={tabNamePrefix || "Mục con"}
            // Truyền vào error để component ChildTabs có thể hiển thị lỗi tương ứng cho các trường con, error sẽ chứa các key tương ứng với các trường con (ví dụ: "variants[0].price" hoặc "children[1].name") và giá trị là thông báo lỗi
            error={error}
            // Truyền vào parentPath để component ChildTabs có thể xác định đường dẫn đến các trường con trong dữ liệu của formData, điều này sẽ giúp việc cập nhật lỗi và giá trị của các trường con trở nên chính xác hơn, ví dụ: nếu parentPath là "variants" và có một trường con có key là "price", thì error sẽ chứa key là "variants[0].price" để lưu lỗi cho trường price của mục con đầu tiên
            parentPath={activeChildKey}
          />
        )}
      </div>
    </Modal>
  );
};

export default FormModal;
