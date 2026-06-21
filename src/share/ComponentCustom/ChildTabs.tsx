import React from 'react';
import { Tabs, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import DynamicForm from '@/share/ComponentCustom/DynamicForm';
import type { FormField } from '@/share/types/form-field';

interface ChildTabsProps {
  dataList: any[];
  onChange: (newDataList: any[]) => void;
  fields: FormField<any>[];
  error?: Record<string, string>;
  nestedLimit: number;
  currentDepth?: number;
  isViewMode: boolean;
  tabNamePrefix?: string;
  parentPath?: string; 
}

const ChildTabs: React.FC<ChildTabsProps> = ({
  dataList = [],
  onChange,
  fields,
  error,
  nestedLimit,
  currentDepth = 1,
  isViewMode,
  tabNamePrefix = 'Mục con',
  parentPath = 'children',
}) => {

  // Hàm getErrorsForTab sẽ nhận vào index của tab hiện tại và trả về một object chứa các lỗi tương ứng với các trường của tab đó,
  const getErrorsForTab = (index: number) => {
    const result: Record<string, string> = {};
    
    const prefix = `${parentPath}.${index}.`;

    // Sử dụng Object.entries để lấy danh sách các cặp key-value của object error, sau đó sử dụng forEach để duyệt qua từng cặp,
    //  nếu key bắt đầu bằng prefix tương ứng với tab hiện tại thì sẽ thêm vào result một trường mới với key đã được loại bỏ prefix và value là thông báo lỗi tương ứng
    Object.entries(error || {}).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        result[key.replace(prefix, '')] = value;
      }
    });
    return result;
  };


  // Hàm handleAddTab sẽ được gọi khi người dùng click vào nút "Thêm mục con", 
  // nó sẽ thêm một object rỗng vào cuối danh sách dataList và gọi onChange để cập nhật lại danh sách
  const handleAddTab = () => {
    onChange([...dataList, {}]); 
  };

  // Hàm handleRemoveTab sẽ nhận vào index của tab cần xóa,
  //  sau đó sẽ tạo một bản sao của dataList, sử dụng splice để xóa phần tử tại index đó và gọi onChange để cập nhật lại danh sách
  const handleRemoveTab = (indexToRemove: number) => {
    const newData = [...dataList];
    newData.splice(indexToRemove, 1);
    onChange(newData);
  };

  // Hàm handleFormChange sẽ nhận vào index của tab hiện tại, key của trường bị thay đổi và giá trị mới của trường đó,
  //  sau đó sẽ tạo một bản sao của dataList, cập nhật trường tương ứng trong tab đó với giá trị mới và gọi onChange để cập nhật lại danh sách
  const handleFormChange = (index: number, key: string, value: unknown) => {
    const newData = [...dataList];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  // Hàm handleNestedChildrenChange sẽ nhận vào index của tab hiện tại và một mảng mới chứa các mục con đã được cập nhật,
  //  sau đó sẽ tạo một bản sao của dataList, cập nhật trường children của tab đó với mảng mới và gọi onChange để cập nhật lại danh sách
  const handleNestedChildrenChange = (index: number, newChildrenArray: any[]) => {
    const newData = [...dataList];
    newData[index] = { ...newData[index], children: newChildrenArray };
    onChange(newData);
  };

  // Biến canHaveNestedChildren sẽ xác định xem tab hiện tại có thể chứa các mục con hay không, dựa trên currentDepth và nestedLimit,
  const canHaveNestedChildren = currentDepth <= nestedLimit;

  return (
    <div className="bg-slate-50 p-4 border border-slate-200 rounded-md mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-slate-700">Danh sách {tabNamePrefix}</h4>
        {!isViewMode && (
          <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddTab} size="small" className="border-blue-400 text-blue-500">
            Thêm {tabNamePrefix}
          </Button>
        )}
      </div>

{/* Nếu dataList có phần tử thì hiển thị Tabs, nếu không thì hiển thị một thông báo yêu cầu người dùng thêm mục con để bắt đầu */}
      {dataList.length > 0 ? (
        <Tabs
          type="card"
          items={dataList.map((item: any, index: number) => ({
           
            key: item.id?.toString() || index.toString(),
            label: `${tabNamePrefix} ${index + 1}`,
            children: (
              <div className="p-4 bg-white border border-t-0 border-slate-200 flex flex-col gap-4">
                {!isViewMode && (
                  <div className="flex justify-end">
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveTab(index)}>
                      Xóa {tabNamePrefix} này
                    </Button>
                  </div>
                )}
                {/*  Hiển thị form của tab hiện tại với các trường được định nghĩa trong fields, truyền vào giá trị của item, hàm handleFormChange để xử lý khi có sự thay đổi trong form,
                error sẽ chứa các lỗi tương ứng với các trường của tab hiện tại, được lấy từ hàm getErrorsForTab(index) */}

                <DynamicForm
                  fields={fields}
                  values={item}
                  onChange={(key, val) => handleFormChange(index, key as string, val)}
                  error={getErrorsForTab(index)}
                  disabled={isViewMode}
                />

{/* // Nếu canHaveNestedChildren là true thì hiển thị component ChildTabs để quản lý các mục con của tab hiện tại, truyền vào danh sách các mục con từ item.children,
//  hàm handleNestedChildrenChange để xử lý khi có sự thay đổi trong danh sách mục con, fields để định nghĩa cấu trúc của form cho các mục con, 
// nestedLimit và currentDepth để kiểm soát độ sâu của các mục con, isViewMode để điều chỉnh giao diện và hành vi của component, 
// tabNamePrefix để đặt tên cho các mục con, error để hiển thị lỗi tương ứng cho các trường của mục con, parentPath để xác định đường dẫn đến trường children trong dữ liệu của tab hiện tại */}
                {canHaveNestedChildren && (
                  <ChildTabs
                    dataList={item.children || []}
                    onChange={(newChildren) => handleNestedChildrenChange(index, newChildren)}
                    fields={fields}
                    nestedLimit={nestedLimit}
                    currentDepth={currentDepth + 1}
                    isViewMode={isViewMode}
                    tabNamePrefix={`Con của ${tabNamePrefix}`}
                    error={error}
                    parentPath={`${parentPath}.${index}.children`} 
                  />
                )}
              </div>
            ),
          }))}
        />
      ) : (
        // Hiển thị thông báo khi dataList rỗng, yêu cầu người dùng thêm mục con để bắt đầu
        <p className="text-gray-400 italic text-sm"> Bấm nút thêm để bắt đầu.</p>
      )}
    </div>
  );
};

export default ChildTabs;