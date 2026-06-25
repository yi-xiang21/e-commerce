export const ORDER_STATUS_OPTIONS = [
  { label: 'Chờ xử lý (Pending)', value: 'pending' },
  { label: 'Đang xử lý (Processing)', value: 'processing' },
  { label: 'Đang giao (Shipping)', value: 'shipping' },
  { label: 'Hoàn thành (Completed)', value: 'completed' },
  { label: 'Đã hủy (Cancelled)', value: 'cancelled' },
] as const;