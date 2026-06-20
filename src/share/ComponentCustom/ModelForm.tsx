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
  isOpen: boolean;
  onClose: () => void;
  mode: FormModalModeType;
  title: string;
  fields: FormField<any>[];
  initialValues: T;
  onSubmit: (values: T) => void;
  loading?: boolean;
  childKey?: keyof T;
  hasChildren?: boolean;
  childFields?: FormField<any>[];
  tabNamePrefix?: string;
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
  const [formData, setFormData] = useState<any>(initialValues);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues);
    }
  }, [isOpen, initialValues]);

  const isViewMode = mode === FormModalMode.VIEW;
  const activeChildFields = childFields || fields;
  const [error, setError] = useState<Record<string, string>>({});
  const activeChildKey = (childKey as string) || "children";
  

  const handleParentChange = (key: string, value: unknown) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));

    setError((prev) => {
      const newErrors = { ...prev };

      delete newErrors[key];

      return newErrors;
    });
  };

  const handleChildrenArrayChange = (newChildrenArray:any) => {
    setFormData((prev: any) => ({
      ...prev,
      [activeChildKey]: newChildrenArray,
    }));
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

  const handleSubmit = () => {
    const parentErrors = validateForm(formData, fields);

    const childErrors = hasChildren 
      ? validateChildren(formData[activeChildKey] || [], activeChildFields, activeChildKey)
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
    onSubmit(formData);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      destroyOnHidden
      centered
      width={hasChildren ? 900 : 520}
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
          <DynamicForm
            fields={fields}
            values={formData}
            onChange={(key, val) => handleParentChange(key as string, val)}
            disabled={isViewMode}
            error={error}
          />
        </div>

        {hasChildren && (
          <ChildTabs
            dataList={formData[activeChildKey] || []}
            onChange={handleChildrenArrayChange}
            fields={activeChildFields}
            nestedLimit={nestedLimit}
            isViewMode={isViewMode}
            tabNamePrefix={tabNamePrefix || "Mục con"}
            error={error}
            parentPath={activeChildKey}
          />
        )}
      </div>
    </Modal>
  );
};

export default FormModal;
