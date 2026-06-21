import { useState } from 'react';
import { FormModalMode, type FormModalModeType } from '@/share/types/type-form-mode';


export const useFormModal = <T>() => {
  // Biến open sẽ lưu trạng thái mở hay đóng của modal, được sử dụng để hiển thị hoặc ẩn modal trên giao diện
  const [open, setOpen] = useState(false);
  // Biến mode sẽ lưu trạng thái hiện tại của modal, có thể là CREATE, VIEW hoặc EDIT, được sử dụng để điều chỉnh giao diện và hành vi của modal dựa trên mục đích sử dụng
  const [mode, setMode] = useState<FormModalModeType>(FormModalMode.CREATE);
  // Biến selectedRecord sẽ lưu bản ghi hiện tại được chọn, có kiểu dữ liệu là T hoặc null nếu không có bản ghi nào được chọn
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
  // Biến loading sẽ lưu trạng thái tải dữ liệu, được sử dụng để hiển thị hiệu ứng loading khi đang thực hiện các thao tác liên quan đến dữ liệu
  const [loading, setLoading] = useState(false);
  // Biến currentPage sẽ lưu trang hiện tại, được sử dụng để hiển thị và điều khiển phân trang
  const [currentPage, setCurrentPage] = useState(1);
  // Biến pageSize sẽ lưu số lượng bản ghi hiển thị trên mỗi trang, được sử dụng để tính toán phân trang và gửi yêu cầu lấy dữ liệu với số lượng phù hợp
  const [pageSize, setPageSize] = useState(10);
  // Biến total sẽ lưu tổng số bản ghi, được sử dụng để hiển thị thông tin phân trang và tính toán số trang
  const [total, setTotal] = useState(0);


  // Hàm openCreate sẽ được gọi khi người dùng muốn tạo mới một bản ghi, nó sẽ đặt mode thành CREATE, xóa selectedRecord và mở modal
  const openCreate = () => {
    setMode(FormModalMode.CREATE);
    setSelectedRecord(null);
    setOpen(true);
  };
  // Hàm openView sẽ được gọi khi người dùng muốn xem chi tiết một bản ghi, nó sẽ nhận vào item cần xem, đặt mode thành VIEW, đặt selectedRecord thành item đó và mở modal

  const openView = (item: T) => {
    setMode(FormModalMode.VIEW);
    setSelectedRecord(item);
    setOpen(true);
  };
  // Hàm openEdit sẽ được gọi khi người dùng muốn chỉnh sửa một bản ghi, nó sẽ nhận vào item cần chỉnh sửa, đặt mode thành EDIT, đặt selectedRecord thành item đó và mở modal

  const openEdit = (item: T) => {
    setMode(FormModalMode.EDIT);
    setSelectedRecord(item);
    setOpen(true);
  };
  // Hàm close sẽ được gọi khi người dùng muốn đóng modal, nó sẽ đặt open thành false để ẩn modal

  const close = () => {
    setOpen(false);
  };

  return {
    open,
    mode,
    loading,
    selectedRecord,
    currentPage,
    pageSize,
    total,

    openCreate,
    openView,
    openEdit,
    close,
    setLoading,
    setCurrentPage,
    setPageSize,
    setTotal,
 

    setSelectedRecord,
  };
};
