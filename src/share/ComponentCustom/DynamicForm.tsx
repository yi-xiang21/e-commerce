import type { FormField } from "@/share/types/form-field";
import { FormFieldType } from "@/share/types/type-form-field";
import { DatePicker, Input, Select, TimePicker } from "antd";
import SelectFetchCustom from "@/share/ComponentCustom/select/SelectFetchCustom";
import { formatToBE, parseToDayjs } from "./FormatTime";

type DynamicFormProps<T extends object> = {
  fields: FormField<T>[];
  values: T;
  onChange: (key: keyof T, value: unknown) => void;
  disabled?: boolean;
  error?: Record<string, string>;
};

const DynamicForm = <T extends object>({
  fields,
  values,
  onChange,
  error,
  disabled = false,
}: DynamicFormProps<T>) => {
  const renderField = (field: FormField<T>) => {
    const key = field.key;
    const value = values[key];

    switch (field.type) {
      case FormFieldType.Input:
        return (
          <Input
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );
      case FormFieldType.inputFile:
        return (
          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => onChange(key, reader.result);
                  reader.readAsDataURL(file);
                }
              }}
              disabled={disabled}
            />
            {value && typeof value === "string" && (
              <img
                src={value}
                alt="Preview"
                className="mt-2 max-h-40 object-contain"
              />
            )}

          </div>
          
        );

    case FormFieldType.ImageUpload: {
        // Đảm bảo value luôn là 1 mảng
        const currentImages = Array.isArray(value) ? value : [];

        // Hàm xử lý khi xoá 1 hình ảnh
        const handleDeleteImage = (indexToRemove: number) => {
          const newImages = currentImages.filter((_, idx) => idx !== indexToRemove);
          
          // Đánh lại số thứ tự (sort_order) cho mảng mới
          const reorderedImages = newImages.map((img: any, idx: number) => ({
            ...img, // Giữ nguyên image_id (nếu có)
            sort_order: idx + 1, 
          }));
          
          onChange(key, reorderedImages);
        };


        const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;

          const base64Promises = files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
              reader.readAsDataURL(file);
            });
          });

          try {
            const base64Images = await Promise.all(base64Promises);
            
            // Tạo mảng object hình mới
            const newImages = base64Images.map((base64) => ({
              image_url: base64,
              sort_order: 0, // Tạm thời để 0, sẽ được đánh lại ngay bên dưới
            }));

            // Gộp mảng cũ và mảng mới
            const combinedImages = [...currentImages, ...newImages];
            
            // Đánh lại toàn bộ số thứ tự (sort_order)
            const reorderedImages = combinedImages.map((img: any, idx: number) => ({
              ...img,
              sort_order: idx + 1,
            }));

            onChange(key, reorderedImages);
          } catch (error) {
            console.error("Lỗi đọc file hình ảnh:", error);
          }
        };

        return (
          <div className="flex flex-col gap-3 border p-3 rounded-md bg-slate-50">
            {/* Input thêm hình chỉ hiển thị khi không ở chế độ View */}
            {!disabled && (
              <input
                className="w-full p-2 border border-blue-300 rounded bg-white cursor-pointer"
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImages}
              />
            )}
            

            <div className="flex flex-wrap gap-4 mt-2">
              {currentImages.map((img: any, index: number) => {
                const src = typeof img === "string" ? img : img.image_url;
                
                return src ? (
                  <div key={img.image_id || index} className="relative border border-slate-300 p-2 rounded bg-white flex flex-col items-center group shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-32 object-cover rounded"
                    />

                    <div className="text-xs text-slate-600 mt-2 text-center flex flex-col">
                      <span className="font-semibold text-blue-600">Thứ tự: {img.sort_order || index + 1}</span>
                      {img.image_id && (
                        <span className="text-gray-400">ID: {img.image_id}</span>
                      )}
                    </div>

                    {/* Nút Xoá (chỉ hiện khi Form không bị disabled) */}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md transform scale-0 group-hover:scale-100 transition-transform"
                        title="Xoá hình này"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : null;
              })}
              
              {currentImages.length === 0 && (
                <span className="text-sm text-gray-400 italic">Chưa có hình ảnh nào.</span>
              )}
            </div>
          </div>
        );
      }

      case FormFieldType.TextArea:
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );

      case FormFieldType.Select:
        return (
          <Select
            placeholder={field.placeholder}
            value={value}
            mode={field.mode}
            options={field.options}
            onChange={(value) => onChange(key, value)}
            allowClear
           
            disabled={disabled}
          />
        );

      case FormFieldType.SelectFetch:
        return (
          <SelectFetchCustom
            placeholder={field.placeholder}
            value={value}
            onChange={(value) => onChange(key, value)}
            fetchOptions={field.fetchOptions}
            disabled={disabled}
            mode={field.mode}
          />
        );

      case FormFieldType.InputNumber:
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value !== undefined ? String(value) : ""}
            onChange={(e) => onChange(key, Number(e.target.value))}
            disabled={disabled}
          />
        );
      case FormFieldType.InputPassword:
        return (
          <Input.Password
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );
      case FormFieldType.TimePicker:
        return (
          <TimePicker
            placeholder={field.placeholder}
            value={parseToDayjs(value)} 
            onChange={(time) => onChange(key, formatToBE(time, 'time'))} 
            disabled={disabled}
            className="w-full" 
            format="HH:mm:ss"
          />
        );

      case FormFieldType.DatePicker:
        return (
          <DatePicker
            placeholder={field.placeholder}
            value={parseToDayjs(value)} 
            onChange={(date) => onChange(key, formatToBE(date, 'date'))} 
            disabled={disabled}
            className="w-full"
            format="YYYY-MM-DD"
          />
        );
      case FormFieldType.Checkbox:
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(key, e.target.checked)}
            disabled={disabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={String(field.key)} className="flex flex-col gap-1">
          <label className="font-medium">{field.label}</label>
          {renderField(field)}
          {error && error[String(field.key)] && (
            <span className="text-red-500 text-sm">
              {error[String(field.key)]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;