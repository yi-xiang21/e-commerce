import { useCallback, useEffect, useState } from "react";
import type { voucher } from "../type/Voucher";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import { useFormModal } from "@/share/hook/useFormModal";
import { VoucherApi } from "../api/voucher_api";
import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import axios from "axios";
import { Button, Table, type TableProps } from "antd";
import Notification from "@/share/ComponentCustom/Notification/Notification";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import { filterVoucher } from "../constants/voucherFilter";
import FormModal from "@/share/ComponentCustom/ModelForm";
import { getVoucherFieldsByMode } from "../constants/sortField";
import { voucherFields } from "../constants/voucherFields";
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";

const defaultFormValues: voucher = {
  voucher_id: 0,
  code: "",
  voucher_name: "",
  discount_type: "percent",
  value: 0,
  minimum_value: 0,
  max_discount: 0,
  quantity: 0,
  used_count: 0,
  start_date: "",
  end_date: "",
};
const AdminManagerVoucher = () => {
  const [vouchers, setVouchers] = useState<voucher[]>([]);
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
    mode: modelMode,
    loading,
    selectedRecord: selectedVoucher,
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
  } = useFormModal<voucher>();

  const fetchVouchers = useCallback(
    async (
      page: number,
      limit: number,
      currentFilters: Record<string, any>,
    ) => {
      try {
        setLoading(true);
        let response;

        if (Object.keys(currentFilters).length > 0) {
          response = await VoucherApi.filter({
            ...currentFilters,
            page,
            limit,
          });
        } else {
          response = await VoucherApi.getAll(page, limit);
        }

        console.log("Response from API:", response.data);
        setVouchers(response.data?.vouchers ?? []);
        setTotal(response.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading],
  );
  useEffect(() => {
    void fetchVouchers(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchVouchers]);

  const handleAction = async (mode: FormModalModeType, record?: voucher) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }
    if (record) {
      try {
          const response = await VoucherApi.getById(record.voucher_id);
          
    

        const data = response.data?.voucher;

        setEditingId(data.voucher_id);

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
          message: "Không thể lấy thông tin voucher này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: voucher) => {
    try {
      setLoading(true);
      if (modelMode === FormModalMode.CREATE) {
        await VoucherApi.create(values);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo voucher thành công!",
        });
      } else {
        await VoucherApi.update(editingId, values);

        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật voucher thành công!",
        });
      }

      await fetchVouchers(currentPage, pageSize, filters);
      close();
    } catch (error) {
      let message = "Không thể lưu voucher này!";
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
  const handleDeleteVoucher = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        setLoading(true);
        // Gọi API để xóa  dựa trên id, sau đó gọi hàm fetchVoucher để làm mới danh sách trên giao diện, đảm bảo rằng voucher đã bị xóa không còn hiển thị, hiển thị thông báo thành công nếu thao tác xóa thành công
        await VoucherApi.delete(id);
        // Sau khi xóa  thành công, gọi hàm fetchVoucher để làm mới danh sách trên giao diện, đảm bảo rằng voucher đã bị xóa không còn hiển thị
        await fetchVouchers(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa voucher thành công!",
        });
      } catch (error) {
        let message = "Không thể xóa voucher này!";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message ?? error.message;
        }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa voucher",
          message: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };
  const columns: TableProps<voucher>["columns"] = [
    { title: "Mã voucher", dataIndex: "voucher_id", key: "voucher_id" },
    { title: "Mã code", dataIndex: "code", key: "code" },
    { title: "Tên voucher", dataIndex: "voucher_name", key: "voucher_name" },
    { title: "Loại voucher", dataIndex: "discount_type", key: "discount_type" },
    { title: "Mức voucher", dataIndex: "value", key: "value" },
    {
      title: "Giá trị voucher tối thiểu",
      dataIndex: "minimum_value",
      key: "minimum_value",
    },
    {
      title: "Giá trị voucher tối đa",
      dataIndex: "max_discount",
      key: "max_discount",
    },
    { title: "Số lượng voucher", dataIndex: "quantity", key: "quantity" },
    {
      title: "Số lượng voucher đã sử dụng",
      dataIndex: "used_count",
      key: "used_count",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => parseToDayjs(text)?.format("YYYY-MM-DD") || text,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => parseToDayjs(text)?.format("YYYY-MM-DD") || text,
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
          <Button
            type="primary"
            onClick={() => handleDeleteVoucher(record.voucher_id || 0)}
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
    modelMode === FormModalMode.EDIT
      ? "Cập nhật trạng thái voucher"
      : "Chi tiết voucher";

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
        <h2 className="text-2xl font-bold">Quản lý voucher</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm voucher
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <FilterHeader
          fields={filterVoucher}
          onSearch={handleFilter}
          loading={loading}
        />

        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="voucher_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>

      <FormModal<voucher>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modelMode}
        title={modalTitle}
        fields={getVoucherFieldsByMode(voucherFields, modelMode)}
        initialValues={selectedVoucher || defaultFormValues}
        onSubmit={handleSubmitForm}
        
      />
    </div>
  );
};
export default AdminManagerVoucher;
