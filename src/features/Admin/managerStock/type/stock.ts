export const TRANSACTION_TYPE = [
  { label: 'Nhập kho (Stock In)', value: 'nhap_kho' },
  { label: 'Xuất kho (Stock Out)', value: 'xuat_ban' },
  { label: 'Kiểm kho (Stock Check)', value: 'kiem_kho' },
  {
    label: 'Hoàn trả (Stock refund)', value: 'hoan_tra'
  },{
    label: 'Khac', value: 'Khac'
  }

] as const;
export type transaction_type = typeof TRANSACTION_TYPE[number]["value"];

export interface stock {
  variant_id: number;
  quantity_change?: number;
  physical_quantity?: number;
  transaction_type?: transaction_type;
  note?: string;
  sku?: string;
  
}


export interface StockHistoryItem {
  created_at : string;
  history_id : string;
  note : string;
  performed_by : string;
  quantity_change :number;
  reference_code :string | null;
  new_stock : number;
  transaction_type : transaction_type;
}

export interface StockHistory {
  sku: string;
  history: StockHistoryItem[];
}


