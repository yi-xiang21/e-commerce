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

  const getErrorsForTab = (index: number) => {
    const result: Record<string, string> = {};
    
    const prefix = `${parentPath}.${index}.`;

    Object.entries(error || {}).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        result[key.replace(prefix, '')] = value;
      }
    });
    return result;
  };

 
  const handleAddTab = () => {
    onChange([...dataList, {}]); 
  };

  const handleRemoveTab = (indexToRemove: number) => {
    const newData = [...dataList];
    newData.splice(indexToRemove, 1);
    onChange(newData);
  };

  const handleFormChange = (index: number, key: string, value: unknown) => {
    const newData = [...dataList];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const handleNestedChildrenChange = (index: number, newChildrenArray: any[]) => {
    const newData = [...dataList];
    newData[index] = { ...newData[index], children: newChildrenArray };
    onChange(newData);
  };

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

                <DynamicForm
                  fields={fields}
                  values={item}
                  onChange={(key, val) => handleFormChange(index, key as string, val)}
                  error={getErrorsForTab(index)}
                  disabled={isViewMode}
                />

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
        <p className="text-gray-400 italic text-sm"> Bấm nút thêm để bắt đầu.</p>
      )}
    </div>
  );
};

export default ChildTabs;