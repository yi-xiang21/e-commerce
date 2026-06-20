import { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';

export interface SelectFetchProps {
  fetchOptions?: () => Promise<{ label: string; value: string | number }[]>;
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  disabled?: boolean;
}

const SelectFetchCustom = ({ 
  fetchOptions, 
  value, 
  onChange, 
  placeholder, 
  disabled ,
  mode
}: SelectFetchProps) => {
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchOptions) return;
      
      setLoading(true);
      try {
        const data = await fetchOptions();
          setOptions(data);
      } catch (error) {
        console.error('Lỗi khi fetch options cho Select:', error);
      } finally {
          setLoading(false);
        }
      }
    fetchData();
  }, [fetchOptions]); 

  return (
    <Select
      style={{ width: '100%' }}
      mode={mode}
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled || loading} 
      placeholder={placeholder || 'Vui lòng chọn...'}
      allowClear
      notFoundContent={loading ? <Spin size="small" /> : 'Không có dữ liệu'}
    />
  );
};

export default SelectFetchCustom;