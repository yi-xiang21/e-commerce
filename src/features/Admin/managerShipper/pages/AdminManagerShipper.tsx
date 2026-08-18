import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";

import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";

import { ShipperApi } from "@/features/Admin/managerShipper/api/shipper_api";
import type { shipper } from "@/features/Admin/managerShipper/type/shipper";
import { shipperFields } from "@/features/Admin/managerShipper/constants/shipperFields";
import { filterShipper } from "@/features/Admin/managerShipper/constants/shipperFilter";
import { getShipperFieldsByMode } from "@/features/Admin/managerShipper/constants/sortShipperField";

const defaultFormValues: shipper = {
  shipper_id: "",
  full_name: "",
  email: "",
  phone: "",
  status: "active",
  working_city_id: "",
};

const AdminManagerShipper = () => {
  const [shippers, setShippers] = useState<shipper[]>([]);
  const [editingId, setEditingId] = useState<string>("");
  const [updateActionType, setUpdateActionType] = useState<"location" | "status" | "">("");
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
    selectedRecord: selectedShipper,
    currentPage,
    pageSize,
    total,
    openCreate,
    openView,
    openEdit,
    close,
    setCurrentPage,
    setPageSize,
    setTotal,
    setLoading,
  } = useFormModal<shipper>();

  const fetchShippers = useCallback(
    async (page: number, limit: number, currentFilters: Record<string, any>) => {
      try {
        setLoading(true);
        let response;
        if (Object.keys(currentFilters).length > 0) {
          const dataToSend = {
            ...currentFilters,
            page,
            limit,
          };
          console.log("Sending filter data:", dataToSend);
          response = await ShipperApi.getAll(dataToSend);
          console.log(response.data)
          setShippers(response.data ?? []);
        }
        else {
          response = await ShipperApi.getAll({ page, limit });
          setShippers(response.data ?? []);
        }

        setTotal(response.data?.pagination?.total_records ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách shipper:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading]
  );

  useEffect(() => {
    void fetchShippers(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchShippers]);

  const handleAction = (mode: FormModalModeType, record?: shipper, actionType?: "location" | "status") => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      setUpdateActionType("");
      openCreate();
      return;
    }

    if (record) {
      setEditingId(record.shipper_id || "");
      if (mode === FormModalMode.EDIT) {
        setUpdateActionType(actionType || "");
        openEdit(record);
      } else {
        openView(record);
      }
    }
  };

  const handleSubmitForm = async (values: shipper) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };


        await ShipperApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo shipper mới thành công!",
        });
      } else if (modalMode === FormModalMode.EDIT && editingId) {
        if (updateActionType === "location") {
          await ShipperApi.updateLocation(editingId, { working_city_id: values.working_city_id });
          setNotifyData({
            key: Date.now().toString(),
            type: "success",
            title: "Thành công",
            message: "Điều chuyển shipper thành công!",
          });
        } else if (updateActionType === "status") {
          await ShipperApi.updateStatus(editingId, { status: values.status });
          setNotifyData({
            key: Date.now().toString(),
            type: "success",
            title: "Thành công",
            message: "Cập nhật trạng thái thành công!",
          });
        }
      }

      await fetchShippers(currentPage, pageSize, filters);
      close();
    } catch (error) {
      let message = "Không thể lưu shipper này!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? error.message;
      }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message:
          message ||
          (modalMode === FormModalMode.CREATE
            ? "Không thể tạo shipper mới!"
            : "Không thể cập nhật shipper này!"),
      });
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<shipper>["columns"] = [
    { title: "Mã Shipper", dataIndex: "shipper_id", key: "shipper_id" },
    { title: "Họ và Tên", dataIndex: "full_name", key: "full_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số Điện Thoại", dataIndex: "phone", key: "phone" },
    { title: "Thành phố làm việc", dataIndex: "working_city_id", key: "working_city_id" },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => handleAction(FormModalMode.VIEW, record)}
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            onClick={() => handleAction(FormModalMode.EDIT, record, "location")}
          >
            Điều chuyển
          </Button>
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-600 border-none"
            onClick={() => handleAction(FormModalMode.EDIT, record, "status")}
          >
            Trạng thái
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
    modalMode === FormModalMode.CREATE
      ? "Thêm shipper mới"
      : modalMode === FormModalMode.EDIT
        ? updateActionType === "location"
          ? "Điều chuyển shipper (Cập nhật thành phố)"
          : "Cập nhật trạng thái shipper"
        : "Chi tiết shipper";

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
        <h2 className="text-2xl font-bold">Quản lý Shipper</h2>
        <button
          className="button_user"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm shipper
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <FilterHeader
          fields={filterShipper}
          onSearch={handleFilter}
          loading={loading}
        />

        <Table
          columns={columns}
          dataSource={shippers}
          rowKey="shipper_id"
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

      <FormModal<shipper>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getShipperFieldsByMode(shipperFields, modalMode, updateActionType as any)}
        initialValues={selectedShipper || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={false}
      />
    </div>
  );
};

export default AdminManagerShipper;
