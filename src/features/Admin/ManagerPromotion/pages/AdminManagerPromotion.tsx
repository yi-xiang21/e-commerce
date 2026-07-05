import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { filterPromotion } from "@/features/Admin/ManagerPromotion/constants/promotionFilter";
import { promotionFields } from "@/features/Admin/ManagerPromotion/constants/promotionFields";
import { promotionChildrenFields } from "@/features/Admin/ManagerPromotion/constants/promotionChildrenFields";
import { getPromotionFieldsByMode } from "@/features/Admin/ManagerPromotion/constants/sortField";

import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import { PromotionApi } from "@/features/Admin/ManagerPromotion/api/promotion_api";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";

import type { promotion } from "@/features/Admin/ManagerPromotion/type/Promotion";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";

const defaultFormValues: promotion= {
  promotion_id: 0,
  title: "",
  discount_type: "percent",
  value: 0,
  min_order_value: 0,
  start_date: "",
  end_date: "",
  status: "active",
  applicable_products: [],
};

const AdminManagerPromotion = () => {
  const [promotions, setPromotions] = useState<promotion[]>([]);
  const [editingId, setEditingId] = useState<number | "">("");
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
    selectedRecord: selectedPromotion,
    currentPage,
    pageSize,
    total,
    openView,
    openEdit,
    openCreate,
    close,
    setCurrentPage,
    setPageSize,
    setTotal,
    setLoading,
  } = useFormModal<promotion>();

  const fetchPromotions = useCallback(
    async (page: number, limit: number, currentFilters: Record<string, any>) => {
      try {
        setLoading(true);
        let response;

        if (Object.keys(currentFilters).length > 0) {
          response = await PromotionApi.filter({ ...currentFilters, page, limit });
        } else {
          response = await PromotionApi.getAll(page, limit);
        }

        console.log("Response from API:", response.data);
        setPromotions(response.data?.promotions ?? []);
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
    void fetchPromotions(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchPromotions]);

  const handleAction = async (mode: FormModalModeType, record?: promotion) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }
    if (record) {
      try {
        const response = await PromotionApi.getById(record.promotion_id);

        const data = response.data?.promotion;


        setEditingId(data.promotion_id);

        if (mode === FormModalMode.EDIT) {
          openEdit(data);
        } else {
          openView(data);
        }
      } catch (error) {
        console.error("Error fetching promotion details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin khuyến mãi này!",
        });
      }
    }
  };


  const handleSubmitForm = async (values: promotion) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        await PromotionApi.create(values);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo khuyến mãi thành công!",
        });
      } else  {
        await PromotionApi.update(editingId, values);
        
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật khuyến mãi thành công!",
        });
      }

      await fetchPromotions(currentPage, pageSize, filters);
      close();
    } catch (error) {
      let message = "Không thể lưu khuyến mãi này!";
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
  const handleDeletePromotion = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        setLoading(true);
        // Gọi API để xóa tài khoản dựa trên id, sau đó gọi hàm fetchAccounts để làm mới danh sách tài khoản trên giao diện, đảm bảo rằng tài khoản đã bị xóa không còn hiển thị, hiển thị thông báo thành công nếu thao tác xóa thành công
        await PromotionApi.delete(id);
        // Sau khi xóa tài khoản thành công, gọi hàm fetchAccounts để làm mới danh sách tài khoản trên giao diện, đảm bảo rằng tài khoản đã bị xóa không còn hiển thị
        await fetchPromotions(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa khuyến mãi thành công!",
        });
      } catch (error) {
          let message = "Không thể xóa khuyến mãi này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa khuyến mãi",
          message: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const columns: TableProps<promotion>["columns"] = [
    { title: "Mã khuyến mãi", dataIndex: "promotion_id", key: "promotion_id" },
    { title: "Tên khuyến mãi", dataIndex: "title", key: "title" },
    { title: "Loại giảm giá", dataIndex: "discount_type", key: "discount_type" },
    { title: "Giá trị giảm", dataIndex: "value", key: "value" },
    { title: "Giá trị đơn hàng tối thiểu", dataIndex: "min_order_value", key: "min_order_value" },
    { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date" , render: (text) => parseToDayjs(text)?.format("YYYY-MM-DD") || text},
    { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date" , render: (text) => parseToDayjs(text)?.format("YYYY-MM-DD") || text},
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
          <Button
            type="primary"
            onClick={() => handleDeletePromotion(record.promotion_id || 0)}
          >
            Delete
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
      ? "Cập nhật trạng thái khuyến mãi"
      : "Chi tiết khuyến mãi";

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
        <h2 className="text-2xl font-bold">Quản lý khuyến mãi</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          // Khi người dùng click vào nút "Thêm tài khoản", hàm handleAction sẽ được gọi với tham số FormModalMode.CREATE để mở modal ở chế độ tạo mới tài khoản
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm tài khoản
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <FilterHeader
          fields={filterPromotion}
          onSearch={handleFilter}
          loading={loading}
        />
        
        <Table 
          columns={columns} 
          dataSource={promotions} 
          rowKey="promotion_id" 
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

      <FormModal<promotion>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}

        fields={getPromotionFieldsByMode(promotionFields, modalMode)}
        initialValues={selectedPromotion || defaultFormValues }
        onSubmit={handleSubmitForm}

        hasChildren={true}
        childFields={promotionChildrenFields}
        childKey="applicable_products"
        tabNamePrefix="Khuyến mãi áp dụng cho sản phẩm"
      />
    </div>
  );
};

export default AdminManagerPromotion;