import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";
import type {
  Category,
  CategoryFormValues,
} from "@/features/Admin/managerCatelogy/type/catelogy";
import { categoryFields } from "../constants/categoryFields";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import { categoryApi } from "@/features/Admin/managerCatelogy/api/cate_api";
import { childCategoryFields } from "../constants/catrgoryChildrenField";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";
import { filterCategory } from "../constants/cataFilter";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";

const defaultFormValues: CategoryFormValues = {
  category_name: "",
  description: "",
  image_url: "",
  children: [],
};

const AdminManagerCatelogries = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string>("");
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
    selectedRecord: selectedCategory,
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
  } = useFormModal<CategoryFormValues>();

  const fetchCategories = useCallback(
    async (
      page: number,
      limit: number,
      currentFilters: Record<string, any>,
    ) => {
      try {
        setLoading(true);
        let response;

        if (Object.keys(currentFilters).length > 0) {
          response = await categoryApi.filter({
            ...currentFilters,
            page,
            limit,
          });
          console.log("Fetched filtered categories:", response);
        } else {
          response = await categoryApi.getAll(page, limit);
          console.log("Fetched categories:", response.data?.categories);
        }

        setCategories(response.data?.categories ?? []);
        setTotal(response.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading],
  );

  useEffect(() => {
    void fetchCategories(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchCategories]);

  const handleAction = async (mode: FormModalModeType, record?: Category) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        const response = await categoryApi.getById(record.id);
        const data = response;
        console.log("Fetched category details:", data);

        setEditingId(data.data?.id as unknown as string);

        const mapChildren = (childrenArray: any[]): any[] => {
          if (!childrenArray) return [];
          return childrenArray.map((child: any) => ({
            id: child.id,
            category_name: child.category_name,
            description: child.description,
            children: mapChildren(child.children),
          }));
        };

        const mappedData: CategoryFormValues = {
          id: data.data?.id as unknown as string,
          category_name: data.data?.category_name,
          description: data.data?.description,
          image_url: data.data?.image_url,
          children: mapChildren(data.data?.children),
        };

        if (mode === FormModalMode.EDIT) {
          openEdit(mappedData);
        } else {
          openView(mappedData);
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin danh mục này!",
        });
      }
    }
  };

  const handleSubmitForm = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      console.log("Form values on submit:", values);
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };
        delete payloadCreate.id;
        console.log("Payload for creating category:", payloadCreate);

        await categoryApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo danh mục mới thành công!",
        });
      } else {
        const payloadUpdate = {
          ...values,
          parent_category_id: null,
        };
        await categoryApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật danh mục thành công!",
        });
      }

      await fetchCategories(currentPage, pageSize, filters);
      close();
    } catch (error) {
      let message = "trung ten danh muc con";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? error.message;
      }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message:
          message || modalMode === FormModalMode.CREATE
            ? "Không thể tạo danh mục mới!"
            : "Không thể cập nhật danh mục này!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setLoading(true);
        await categoryApi.delete(id);
        await fetchCategories(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa danh mục thành công!",
        });
      } catch (error) {
        let message = "khong thể xóa danh mục này!";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message ?? error.message;
        }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa danh mục",
          message: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const columns: TableProps<Category>["columns"] = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "category_name", key: "category_name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) =>
        text ? (
          <img
            src={text}
            alt="Category"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span className="italic text-gray-500">No Image</span>
        ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text) => <span className="italic text-gray-500">{text}</span>,
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
            danger
            onClick={() => handleDeleteCategory(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm danh mục mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật danh mục"
        : "Chi tiết danh mục";

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
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm danh mục
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">
        <FilterHeader
          fields={filterCategory}
          onSearch={handleFilter}
          loading={loading}
        />
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
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

      <FormModal<CategoryFormValues>
        isOpen={isModalOpen}
        onClose={close}
        childKey="children"
        loading={loading}
        mode={modalMode}
        title={modalTitle}
        fields={categoryFields}
        childFields={childCategoryFields}
        initialValues={selectedCategory || defaultFormValues}
        onSubmit={handleSubmitForm}
        hasChildren={true}
        nestedLimit={1}
      />
    </div>
  );
};

export default AdminManagerCatelogries;
