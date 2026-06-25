import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { filterOrder } from "@/features/Admin/ManagerOrder/constants/orderFilter";
import { orderFields } from "@/features/Admin/ManagerOrder/constants/orderFields";
import { ORDER_STATUS_OPTIONS } from "@/features/Admin/ManagerOrder/constants/orderStatus";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import { OrderApi } from "@/features/Admin/ManagerOrder/api/order_api";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";

import type { Order } from "@/features/Admin/ManagerOrder/type/order";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";

// Giá trị mặc định cho form quản lý đơn hàng
const defaultFormValues: Partial<Order> = {
  status: "pending",
};

const AdminManagerOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | "">("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);

  const {
    open: isModalOpen,
    mode: modalMode,
    loading,
    selectedRecord: selectedOrder,
    currentPage,
    pageSize,
    total,
    openView,
    openEdit,
    close,
    setCurrentPage,
    setPageSize,
    setTotal,
    setLoading,
  } = useFormModal<Order>();

  // Hàm fetchOrders giống hệt fetchAccounts
  const fetchOrders = useCallback(
    async (page: number, limit: number, currentFilters: Record<string, any>) => {
      try {
        setLoading(true);
        let response;

        if (Object.keys(currentFilters).length > 0) {
        //   console.log("Fetching orders with filters:", currentFilters, "page:", page, "limit:", limit);
          response = await OrderApi.filter({ ...currentFilters, page, limit });
        //   console.log("Filtered orders fetched:", response.data);
        } else {
          response = await OrderApi.getAll(page, limit);
        }

        setOrders(response.data?.orders ?? []);
        setTotal(response.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading]
  );

  useEffect(() => {
    void fetchOrders(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchOrders]);

  const handleAction = async (mode: FormModalModeType, record?: Order) => {
    if (record) {
      try {
        const response = await OrderApi.getById(record.order_id);
        const data = response.data?.order || response.data;
        // console.log("Fetched order details:", data);

        setEditingId(data.order_id);

        if (mode === FormModalMode.EDIT) {
          openEdit(data);
        } else {
          openView(data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin đơn hàng này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: Order) => {
    try {
      setLoading(true);

      if (modalMode === FormModalMode.EDIT) {
        const payloadUpdate = { status: values.status };
        await OrderApi.updateStatus(editingId, payloadUpdate);
        
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật đơn hàng thành công!",
        });
      }

      await fetchOrders(currentPage, pageSize, filters);
      close();
    } catch (error) {
      let message = "Không thể lưu đơn hàng này!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? error.message;
      }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<Order>["columns"] = [
    { title: "Mã Đơn", dataIndex: "order_id", key: "order_id" },
    { title: "Khách Hàng", dataIndex: "customer_name", key: "customer_name" },
    { title: "SĐT", dataIndex: "phone_number", key: "phone_number" },
    { title: "Tổng Tiền", dataIndex: "total_amount", key: "total_amount" },
    { 
      title: "Trạng Thái", 
      dataIndex: "status", 
      key: "status",
      render: (status: string) => {
        const statusObj = ORDER_STATUS_OPTIONS.find(opt => opt.value === status);
        const displayText = statusObj ? statusObj.label : status;

        return (
          <span className={`px-2 py-1 rounded ${status === "completed" ? "bg-green-100 text-green-800" : status === "cancelled" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
            {displayText}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => handleAction(FormModalMode.VIEW, record)}
          >
            View
          </Button>
          <Button
            type="primary"
            onClick={() => handleAction(FormModalMode.EDIT, record)}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const modalTitle =
    modalMode === FormModalMode.EDIT
      ? "Cập nhật đơn hàng"
      : "Chi tiết đơn hàng";

  return (
    <div className="flex flex-col h-full w-full mt-12 md:mt-0">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Đơn hàng</h2>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <FilterHeader
          fields={filterOrder}
          onSearch={handleFilter}
          loading={loading}
        />
        
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="order_id" 
          pagination={
            {
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }
          } 
        />
      </div>

      <FormModal<Order>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={orderFields}
        initialValues={selectedOrder || defaultFormValues as any}
        onSubmit={handleSubmitForm}
        hasChildren={false}
      />
    </div>
  );
};

export default AdminManagerOrder;