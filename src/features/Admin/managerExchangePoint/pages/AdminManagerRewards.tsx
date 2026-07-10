import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";
import { rewardsFields } from "@/features/Admin/managerExchangePoint/constants/rewardsFields";
import { RewardsApi } from "@/features/Admin/managerExchangePoint/api/rewards_api";
import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";

import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";
import type { rewards } from "@/features/Admin/managerExchangePoint/type/rewards";
import { getRewardsFieldsByMode } from "@/features/Admin/managerExchangePoint/constants/sortField";
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";


const defaultFormValues: rewards = {
  voucher_id: undefined,
  required_points: undefined,
  status: "active",
};

const AdminManagerRewards = () => {
  const [rewardsList, setRewardsList] = useState<rewards[]>([]);
  const [editingId, setEditingId] = useState<number | "">("");
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
    selectedRecord: selectedReward,
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
  } = useFormModal<rewards>();

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await RewardsApi.getRewards();
      const data = response.data?.data?.rewards || response.data?.data || response.data || [];
      const dataArray = Array.isArray(data) ? data : [];
      setRewardsList(dataArray);
      setTotal(dataArray.length);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cấu hình đổi điểm:", error);
    } finally {
      setLoading(false);
    }
  }, [setTotal, setLoading]);

  useEffect(() => {
    void fetchRewards();
  }, [fetchRewards]);

  const handleAction = async (mode: FormModalModeType, record?: rewards) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      setEditingId(record.reward_id as number);
      if (mode === FormModalMode.EDIT) {
        openEdit(record);
      } else {
        openView(record);
      }
    }
  };

  const handleSubmitForm = async (values: rewards) => {
    try {
      setLoading(true);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = {
          voucher_id: values.voucher_id,
          required_points: Number(values.required_points),
        };
        await RewardsApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo cấu hình đổi điểm mới thành công!",
        });
      } else if (modalMode === FormModalMode.EDIT) {
        const payloadUpdate = { status: values.status };
        await RewardsApi.updateReward(editingId.toString(), payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật trạng thái thành công!",
        });
      }

      await fetchRewards();
      close();
    } catch (error) {
      let message = "Không thể lưu cấu hình này!";
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
  const handleDelete = async(id: number)=>{
    try{
      setLoading(true);
      await RewardsApi.deleteReward(id.toString());
      setNotifyData({
        key: Date.now().toString(),
        type: "success",
        title: "Thành công",
        message: "Xóa cấu hình đổi điểm thành công!",
      });
      await fetchRewards();
    }catch(error){
      let message = "Không thể xóa cấu hình này!";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? error.message;
      }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message: message,
      });
    }finally{
      setLoading(false);
    }
  }

  const columns: TableProps<rewards>["columns"] = [
    { title: "ID", dataIndex: "reward_id", key: "reward_id" },
    { title: "Mã voucher", dataIndex: "voucher_code", key: "voucher_code" },
    { title: "Tên voucher", dataIndex: "voucher_name", key: "voucher_name" },
    { 
      title: "Loại giảm", 
      dataIndex: "discount_type", 
      key: "discount_type",
      render: (type, record) => type === 'percent' ? `${record.discount_value}%` : `${Number(record.discount_value).toLocaleString('vi-VN')}đ`
    },
    { title: "Điểm yêu cầu", dataIndex: "required_points", key: "required_points" },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <span className={status === 'active' ? 'text-green-600 font-bold' : 'text-gray-500 font-bold'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    { 
      title: "Ngày tạo", 
      dataIndex: "created_at", 
      key: "created_at",
      render: (text) => parseToDayjs(text)?.format("DD/MM/YYYY HH:mm") || text 
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
            Chi tiết
          </Button>
          <Button
            type="primary"
            onClick={() => handleAction(FormModalMode.EDIT, record)}
          >
            Cập nhật trạng thái
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.reward_id as number)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm cấu hình đổi điểm"
      : modalMode === FormModalMode.EDIT
      ? "Cập nhật cấu hình đổi điểm"
      : "Chi tiết cấu hình";

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
        <h2 className="text-2xl font-bold">Quản lý đổi thưởng</h2>
        <button
          className="button_user bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium shadow-sm"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Tạo gói đổi điểm
        </button>
      </div>

      <div className="mt-5 bg-slate-50 border border-slate-200 p-6 rounded-lg shadow-sm">
        <Table 
          columns={columns} 
          dataSource={rewardsList} 
          rowKey="reward_id" 
          loading={loading}
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

      <FormModal<rewards>
        isOpen={isModalOpen}
        onClose={close}
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={getRewardsFieldsByMode(rewardsFields, modalMode)}
        initialValues={selectedReward || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={false}
      />
    </div>
  );
};

export default AdminManagerRewards;
