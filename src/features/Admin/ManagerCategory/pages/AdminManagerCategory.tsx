import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API_CONFIG } from "@/config/api";
import { callAPI } from "@/share/lib/axios";
import type { Category } from "@/share/types/category";
import { FormFieldType } from "@/share/types/type-form-field";
import { FormModalMode } from "@/share/types/type-form-mode";
import type { FormField } from "@/share/types/form-field";
import type { FilterField } from "@/share/types/filter_param";
import { useFormModal } from "@/share/hook/useFormModal";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";
import FormModalComponent from "@/share/ComponentCustom/ModelForm";
import { convertToSlug } from "@/share/lib/slug";
import dayjs from "dayjs";

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [filterParams, setFilterParams] = useState<Record<string, any>>({});

  const {
    open,
    mode,
    selectedRecord,
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
  } = useFormModal<Category>();

  // Load categories data
  const loadCategories = async () => {
    setLoadingTable(true);
    try {
      let response;
      // Nếu có filter params (tìm kiếm/lọc), gọi API filter
      if (Object.keys(filterParams).length > 0) {
        // Ánh xạ category_name sang keyword cho đúng tham số của backend
        const payload = {
          keyword: filterParams.category_name || "",
          page: currentPage,
          limit: pageSize,
        };
        response = await callAPI.post(API_CONFIG.ENDPOINTS.FiLTER_CATEGORIES, payload);
      } else {
        // Mặc định load toàn bộ categories
        response = await callAPI.get(API_CONFIG.ENDPOINTS.GET_CATEGORIES);
      }

      // Xử lý dữ liệu trả về theo nhiều cấu trúc có thể có từ backend
      const rawData = response.data?.data || response.data;
      const categoriesList = Array.isArray(rawData)
        ? rawData
        : (rawData && Array.isArray(rawData.categories) ? rawData.categories : []);

      const totalCount =
        rawData?.pagination?.total_items ||
        rawData?.pagination?.total ||
        response.data?.total ||
        categoriesList.length;

      setCategories(categoriesList);
      setTotal(totalCount);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
      message.error("Không thể tải danh mục sản phẩm!");
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [currentPage, pageSize, filterParams]);

  // Handle Search/Filter
  const handleSearch = (values: Record<string, any>) => {
    setFilterParams(values);
    setCurrentPage(1); // Reset về trang 1
  };

  // Delete Category with Constraints
  const handleDelete = (record: Category) => {
    // 1. Kiểm tra ràng buộc phía client: Chặn xóa nếu có danh mục con
    const hasChildren = record.children && record.children.length > 0;

    if (hasChildren) {
      Modal.warning({
        title: "Không thể xóa danh mục",
        content: `Danh mục "${record.category_name}" đang chứa các danh mục con. Vui lòng xóa các danh mục con trước.`,
        okText: "Đã hiểu",
      });
      return;
    }

    // 2. Xác nhận xóa
    Modal.confirm({
      title: "Xác nhận xóa danh mục",
      content: `Bạn có chắc chắn muốn xóa danh mục "${record.category_name}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const deleteUrl =
            typeof API_CONFIG.ENDPOINTS.DELETE_CATEGORY === "function"
              ? API_CONFIG.ENDPOINTS.DELETE_CATEGORY(String(record.id))
              : `${API_CONFIG.ENDPOINTS.DELETE_CATEGORY}/${record.id}`;

          await callAPI.delete(deleteUrl);
          message.success("Xóa danh mục thành công!");
          loadCategories();
        } catch (error: any) {
          console.error("Lỗi khi xóa danh mục:", error);
          const errMsg =
            error.response?.data?.message ||
            error.message ||
            "Có lỗi ràng buộc xảy ra.";
          Modal.error({
            title: "Xóa danh mục thất bại",
            content: `Không thể xóa danh mục này. Lỗi hệ thống: ${errMsg}. Vui lòng kiểm tra xem danh mục có đang chứa sản phẩm hay không.`,
            okText: "Đóng",
          });
        }
      },
    });
  };

  // Handle Submit Form (Create / Edit)
  const handleSubmit = async (values: Category) => {
    setLoadingSubmit(true);
    try {
      // Tự động sinh slug cho danh mục gốc nếu chưa có hoặc cập nhật lại
      const dataToSubmit = { ...values };
      if (!dataToSubmit.slug && dataToSubmit.category_name) {
        dataToSubmit.slug = convertToSlug(dataToSubmit.category_name);
      }

      // Đệ quy tự động sinh slug cho danh mục con
      const processChildrenSlugs = (childrenList: any[]): any[] => {
        if (!childrenList || !Array.isArray(childrenList)) return [];
        return childrenList.map((child) => {
          const updatedChild = { ...child };
          if (!updatedChild.slug && updatedChild.category_name) {
            updatedChild.slug = convertToSlug(updatedChild.category_name);
          }
          if (updatedChild.children && updatedChild.children.length > 0) {
            updatedChild.children = processChildrenSlugs(updatedChild.children);
          }
          return updatedChild;
        });
      };

      if (dataToSubmit.children && dataToSubmit.children.length > 0) {
        dataToSubmit.children = processChildrenSlugs(dataToSubmit.children);
      }

      if (mode === FormModalMode.CREATE) {
        await callAPI.post(API_CONFIG.ENDPOINTS.CREATE_CATEGORY, dataToSubmit);
        message.success("Tạo danh mục mới thành công!");
      } else if (mode === FormModalMode.EDIT && selectedRecord?.id) {
        const updateUrl =
          typeof API_CONFIG.ENDPOINTS.UPDATE_CATEGORY === "function"
            ? API_CONFIG.ENDPOINTS.UPDATE_CATEGORY(String(selectedRecord.id))
            : `${API_CONFIG.ENDPOINTS.UPDATE_CATEGORY}/${selectedRecord.id}`;

        await callAPI.put(updateUrl, dataToSubmit);
        message.success("Cập nhật danh mục thành công!");
      }
      close();
      loadCategories();
    } catch (error: any) {
      console.error("Lỗi submit form danh mục:", error);
      const errMsg =
        error.response?.data?.message ||
        "Đã xảy ra lỗi trong quá trình lưu dữ liệu.";
      message.error(errMsg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      key: "category_name",
      label: "Tên danh mục",
      placeholder: "Nhập tên danh mục để tìm...",
      type: FormFieldType.Input,
      width: 240,
    },
  ];

  // Form fields configuration for Modal
  const formFields: FormField<Category>[] = [
    {
      key: "category_name",
      label: "Tên danh mục",
      type: FormFieldType.Input,
      placeholder: "Nhập tên danh mục (ví dụ: Len Sợi)",
      rules: [{ required: true, message: "Tên danh mục là bắt buộc!" }],
    },
    {
      key: "slug",
      label: "Slug",
      type: FormFieldType.Input,
      placeholder: "Tự động tạo hoặc nhập thủ công (ví dụ: len-soi)",
      rules: [{ required: true, message: "Slug là bắt buộc!" }],
    },
    {
      key: "description",
      label: "Mô tả",
      type: FormFieldType.TextArea,
      placeholder: "Nhập mô tả chi tiết cho danh mục",
    },
    {
      key: "image_url",
      label: "Ảnh đại diện / Icon",
      type: FormFieldType.inputFile,
    },
  ];

  // Table Columns config
  const columns = [
    {
      title: "Hình ảnh/Icon",
      dataIndex: "image_url",
      key: "image_url",
      width: 120,
      render: (url: string) =>
        url ? (
          <img
            src={url}
            alt="Icon"
            className="h-10 w-10 object-cover rounded border shadow-sm"
          />
        ) : (
          <span className="text-gray-400 italic text-xs">Không có</span>
        ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-rose-600 font-mono">{text}</code>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => text || <span className="text-gray-400 italic text-xs">Không có mô tả</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => openView(record)}
            className="text-blue-500 font-medium"
          >
            Xem
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => openEdit(record)}
            className="text-amber-500 font-medium"
          >
            Sửa
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record)}
            className="font-medium"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const initialValues: Category = selectedRecord || {
    category_name: "",
    slug: "",
    description: "",
    image_url: "",
    children: [],
  };

  return (
    <div className="bg-slate-50 p-6 min-h-full rounded-lg shadow-sm border border-slate-100">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Quản lý Danh mục sản phẩm
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Phân loại, tổ chức cấu trúc sản phẩm theo hệ thống phân cấp nhiều cấp.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          size="large"
          className="bg-blue-600 shadow-sm"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Filter Component */}
      <FilterHeader
        fields={filterFields}
        onSearch={handleSearch}
        loading={loadingTable}
      />

      {/* Categories Tree Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey={(record) => String(record.id || record.category_name)}
          loading={loadingTable}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (totalCount) => `Tổng cộng ${totalCount} danh mục`,
          }}
        />
      </div>

      {/* Dynamic Form Modal (Handles Create/View/Edit & nested children tabs recursively) */}
      <FormModalComponent
        isOpen={open}
        onClose={close}
        mode={mode}
        title={
          mode === FormModalMode.CREATE
            ? "Thêm danh mục mới"
            : mode === FormModalMode.EDIT
              ? "Chỉnh sửa danh mục"
              : "Xem chi tiết danh mục"
        }
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={loadingSubmit}
        hasChildren={true}
        childKey="children"
        childFields={formFields}
        tabNamePrefix="Danh mục con"
        nestedLimit={2} // Hỗ trợ 2 cấp danh mục con lồng nhau (tổng cộng 3 cấp phân cấp)
      />
    </div>
  );
};

export default CategoryManager;
