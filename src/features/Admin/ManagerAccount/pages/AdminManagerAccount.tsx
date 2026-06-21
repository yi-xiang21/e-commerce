import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd/es/table";

import { filterAccount } from "@/features/Admin/ManagerAccount/constants/accountFilter";
import { accountFields } from "@/features/Admin/ManagerAccount/constants/accountFields";
import { useFormModal } from "@/share/hook/useFormModal";
import Notification from "@/share/ComponentCustom/Notification/Notification";

import {
  FormModalMode,
  type FormModalModeType,
} from "@/share/types/type-form-mode";
import FormModal from "@/share/ComponentCustom/ModelForm";
import {AccountApi } from "@/features/Admin/ManagerAccount/api/account_api";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import axios from "axios";

import type { account } from "@/features/Admin/ManagerAccount/type/account";
import FilterHeader from "@/share/ComponentCustom/FilterTableCustom";


// Giá trị mặc định cho form quản lý tài khoản, được sử dụng khi tạo mới tài khoản hoặc khi không có tài khoản nào được chọn để hiển thị chi tiết
const defaultFormValues: account = {
  user_id: 0,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  status: { active: "active", inactive: "inactive" },
  role: { customer: "customer", admin: "admin" },
 
};

const AdminManagerAccount = () => {
  // Biến accounts sẽ lưu danh sách tài khoản được lấy từ API, được sử dụng để hiển thị trong bảng
  const [accounts, setAccounts] = useState<account[]>([]);
  // Biến editingId sẽ lưu ID của tài khoản đang được chỉnh sửa, được sử dụng để xác định tài khoản nào đang được cập nhật trong form
  const [editingId, setEditingId] = useState<number | "">("");
  // Biến filters sẽ lưu các điều kiện lọc hiện tại, được sử dụng để gửi yêu cầu lấy dữ liệu với các bộ lọc phù hợp
  const [filters, setFilters] = useState<Record<string, any>>({});
  // Biến notifyData sẽ lưu thông tin về thông báo cần hiển thị, bao gồm key, type, title và message, được sử dụng để hiển thị các thông báo thành công hoặc lỗi khi thực hiện các thao tác liên quan đến tài khoản
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);

  // Sử dụng custom hook useFormModal để quản lý trạng thái của modal form, bao gồm việc mở/đóng modal, chế độ hiện tại của modal (CREATE, VIEW, EDIT), tài khoản được chọn để hiển thị chi tiết hoặc chỉnh sửa, trạng thái loading khi thực hiện các thao tác liên quan đến dữ liệu, và các thông tin phân trang như trang hiện tại, số lượng bản ghi trên mỗi trang và tổng số bản ghi
  const {
    open: isModalOpen,
    mode: modalMode,
    loading,
    selectedRecord: selectedAccount,
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
  } = useFormModal<account>();


  // Hàm fetchAccounts sẽ được sử dụng để lấy danh sách tài khoản từ API, nó nhận vào các tham số page, limit và currentFilters để gửi yêu cầu với các điều kiện phân trang và lọc phù hợp, sau đó cập nhật state accounts và total dựa trên phản hồi từ API
  const fetchAccounts = useCallback(
      async (page: number, limit: number, currentFilters: Record<string, any>) => {
        try {
          setLoading(true); 
          let response;
  
          // Kiểm tra nếu có bộ lọc nào được áp dụng (currentFilters có chứa các key), nếu có thì gọi API với các bộ lọc, nếu không thì gọi API để lấy tất cả tài khoản mà không áp dụng bộ lọc
  
          if (Object.keys(currentFilters).length > 0) {
           
            console.log("Fetching accounts with filters:",currentFilters, "page:", page, "limit:", limit);
            response = await AccountApi.filter({ ...currentFilters, page, limit });
            console.log("Filtered accounts fetched:", response.data);
          } 
          else {
            response = await AccountApi.getAll(page, limit);
          
          }
  
          setAccounts(response.data?.data?.users ?? []);
          setTotal(response.data?.data?.pagination?.total_items ?? 0);
        } catch (error) {
          console.error("Lỗi khi tải danh sách tài khoản:", error);
        } finally {
          setLoading(false);
        }
      },
      [setTotal, setLoading]
    );
  
  
    // Sử dụng useEffect để gọi hàm fetchAccounts mỗi khi currentPage, pageSize, filters hoặc fetchAccounts thay đổi, đảm bảo rằng danh sách tài khoản được cập nhật đúng khi người dùng thay đổi trang, số lượng bản ghi trên mỗi trang hoặc các điều kiện lọc
    useEffect(() => {
      void fetchAccounts(currentPage, pageSize, filters);
    }, [currentPage, pageSize, filters, fetchAccounts]);
    

    // Hàm handleAction sẽ được gọi khi người dùng click vào các nút View, Update hoặc Delete trong bảng, nó nhận vào mode để xác định hành động nào được thực hiện và record để biết tài khoản nào đang được thao tác, sau đó thực hiện các hành động tương ứng như mở modal với chế độ phù hợp hoặc gọi API để xóa tài khoản
  const handleAction = async (mode: FormModalModeType, record?: account) => {
    if (mode === FormModalMode.CREATE) {
      setEditingId("");
      openCreate();
      return;
    }

    if (record) {
      try {
        // Gọi API để lấy chi tiết tài khoản dựa trên user_id của record, sau đó cập nhật editingId và mở modal với dữ liệu chi tiết của tài khoản đó
        const response = await AccountApi.getById(record.user_id);
        const data = response.data;
        console.log("Fetched account details:", data);

        // Cập nhật editingId với user_id của tài khoản được chọn, sau đó xóa trường password khỏi dữ liệu để tránh hiển thị hoặc chỉnh sửa mật khẩu trong form
        setEditingId(data.user_id);
        delete data.password;

        // Mở modal với chế độ VIEW hoặc EDIT tùy thuộc vào mode được truyền vào, và truyền dữ liệu chi tiết của tài khoản để hiển thị trong form
        if (mode === FormModalMode.EDIT) {
          openEdit(data);
        } else {
          openView(data);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thất bại",
          message: "Không thể lấy thông tin tài khoản này!",
        });
      }
    }
  };

  // Hàm handleSubmitForm sẽ được gọi khi người dùng submit form trong modal, nó nhận vào values là dữ liệu của tài khoản được nhập trong form, sau đó thực hiện các hành động tương ứng dựa trên modalMode (CREATE hoặc EDIT) như gọi API để tạo mới hoặc cập nhật tài khoản, hiển thị thông báo thành công hoặc lỗi, và làm mới danh sách tài khoản sau khi thao tác hoàn tất
  const handleSubmitForm = async (values: account) => {
    try {
      setLoading(true);
      // Kiểm tra modalMode để xác định xem đang tạo mới tài khoản hay cập nhật tài khoản, sau đó chuẩn bị payload phù hợp và gọi API tương ứng, hiển thị thông báo thành công nếu thao tác thành công
      if (modalMode === FormModalMode.CREATE) {
        const payloadCreate = { ...values };
        // Loại bỏ trường user_id vì nó sẽ được tạo tự động bởi backend khi tạo mới tài khoản, loại bỏ trường status vì khi tạo mới tài khoản sẽ mặc định có trạng thái active và không cần thiết phải gửi trường này trong payload
        delete payloadCreate.user_id;
        delete payloadCreate.status;
        // Gọi API để tạo mới tài khoản với payload đã chuẩn bị, sau đó hiển thị thông báo thành công nếu thao tác tạo mới thành công

        await AccountApi.create(payloadCreate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Tạo tai khoan mới thành công!",
        });
        //
      } else {
        // Chuẩn bị payload để cập nhật tài khoản, loại bỏ trường user_id vì nó không cần thiết khi cập nhật và có thể
        const payloadUpdate = { ...values };
        delete payloadUpdate.user_id;
        
        // Loại bỏ trường password nếu nó không có giá trị, vì khi cập nhật tài khoản mà không muốn thay đổi mật khẩu thì trường này sẽ để trống và không nên gửi lên API
        await AccountApi.update(editingId, payloadUpdate);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Cập nhật tài khoản thành công!",
        });
      }

      // Sau khi tạo mới hoặc cập nhật tài khoản thành công, gọi hàm fetchAccounts để làm mới danh sách tài khoản trên giao diện, đảm bảo rằng các thay đổi được phản ánh ngay lập tức, sau đó đóng modal
      await fetchAccounts(currentPage, pageSize, filters);
      close();
    } catch (error) {
        let message = "khong the luu tai khoan này!";
        if (axios.isAxiosError(error)) {
          message =
            error.response?.data?.message ??
            error.message;
        }
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thất bại",
        message:
  message ||
  (
    modalMode === FormModalMode.CREATE
      ? "Không thể tạo tài khoản mới!"
      : "Không thể cập nhật tài khoản này!"
  ),
      });
    } finally {
      setLoading(false);
    }
  };
  // Hàm handleDeleteAccount sẽ được gọi khi người dùng click vào nút Delete trong bảng, nó nhận vào id của tài khoản cần xóa, hiển thị hộp thoại xác nhận trước khi xóa, nếu người dùng xác nhận thì gọi API để xóa tài khoản, hiển thị thông báo thành công hoặc lỗi, và làm mới danh sách tài khoản sau khi thao tác hoàn tất

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        setLoading(true);
        // Gọi API để xóa tài khoản dựa trên id, sau đó gọi hàm fetchAccounts để làm mới danh sách tài khoản trên giao diện, đảm bảo rằng tài khoản đã bị xóa không còn hiển thị, hiển thị thông báo thành công nếu thao tác xóa thành công
        await AccountApi.delete(id);
        // Sau khi xóa tài khoản thành công, gọi hàm fetchAccounts để làm mới danh sách tài khoản trên giao diện, đảm bảo rằng tài khoản đã bị xóa không còn hiển thị
        await fetchAccounts(currentPage, pageSize, filters);
        setNotifyData({
          key: Date.now().toString(),
          type: "success",
          title: "Thành công",
          message: "Xóa tài khoản thành công!",
        });
      } catch (error) {
          let message = "khong thể xóa tài khoản này!";
          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ??
              error.message;
          }
        setNotifyData({
          key: Date.now().toString(),
          type: "warning",
          title: "Lỗi xóa tài khoản",
          message: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Định nghĩa các cột cho bảng hiển thị danh sách tài khoản, bao gồm các cột như user_id, Name, Email, Phone Number, Status, Role, First Name, Last Name và Action, trong đó cột Action sẽ chứa các nút để xem chi tiết, cập nhật hoặc xóa tài khoản tương ứng với từng bản ghi

  const columns: TableProps<account>["columns"] = [
    { title: "user_id", dataIndex: "user_id", key: "id" },
    { title: "Name", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phone_number", key: "phone_number" },
    { title: "Status", dataIndex: "status", key: "status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
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
            onClick={() => handleDeleteAccount(record.user_id as number)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  // Hàm handleFilter sẽ được gọi khi người dùng thực hiện tìm kiếm hoặc thay đổi các điều kiện lọc trong FilterHeader,
  //  nó nhận vào newFilters là các điều kiện lọc mới, sau đó cập nhật state filters với các điều kiện lọc mới và đặt currentPage về 1 để trở về trang đầu tiên của kết quả tìm kiếm
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters); // Cập nhật bộ lọc
    setCurrentPage(1);      // Trở về trang 1 mỗi khi đổi bộ lọc tìm kiếm
  };


  // Biến modalTitle sẽ xác định tiêu đề của modal dựa trên modalMode hiện tại, nếu đang ở chế độ CREATE thì tiêu đề sẽ là "Thêm tài khoản mới", nếu đang ở chế độ EDIT thì tiêu đề sẽ là "Cập nhật tài khoản", nếu đang ở chế độ VIEW thì tiêu đề sẽ là "Chi tiết tài khoản"
  const modalTitle =
    modalMode === FormModalMode.CREATE
      ? "Thêm tài khoản mới"
      : modalMode === FormModalMode.EDIT
        ? "Cập nhật tài khoản"
        : "Chi tiết tài khoản";

  return (
    <div className="flex flex-col h-full w-full mt-12 md:mt-0">
      {/* Nếu notifyData có giá trị (không null), 
      hiển thị component Notification với các props được lấy từ notifyData để hiển thị thông báo tương ứng với loại thông báo,
       tiêu đề và nội dung thông báo */}
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý tài khoản</h2>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          // Khi người dùng click vào nút "Thêm tài khoản", hàm handleAction sẽ được gọi với tham số FormModalMode.CREATE để mở modal ở chế độ tạo mới tài khoản
          onClick={() => handleAction(FormModalMode.CREATE)}
        >
          Thêm tài khoản
        </button>
      </div>

      <div className="mt-5 bg-slate-200 p-10 rounded-lg">

{/* Hiển thị component FilterHeader để người dùng có thể nhập các điều kiện lọc, 
truyền vào các props như fields để xác định các trường lọc, 
onSearch để xử lý khi người dùng thực hiện tìm kiếm hoặc thay đổi điều kiện lọc,
 và loading để hiển thị hiệu ứng loading khi đang tải dữ liệu */}
       <FilterHeader
          fields={filterAccount}
          onSearch={handleFilter}
          loading={loading}
        />
        
        {/* Hiển thị bảng danh sách tài khoản với các cột đã định nghĩa trong biến columns,
         dữ liệu được lấy từ state accounts, sử dụng user_id làm key cho mỗi bản ghi, 
         và cấu hình phân trang với currentPage, pageSize, total và hàm onChange để xử lý khi người dùng thay đổi trang hoặc số lượng bản ghi trên mỗi trang */}
        <Table columns={columns} dataSource={accounts} rowKey="user_id" 
        // Cấu hình phân trang cho bảng, sử dụng currentPage, pageSize và total để hiển thị thông tin phân trang, showSizeChanger để cho phép người dùng thay đổi số lượng bản ghi trên mỗi trang,
        //  và onChange để xử lý khi người dùng thay đổi trang hoặc số lượng bản ghi trên mỗi trang
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
        } />
      </div>

      {/* Hiển thị component FormModal để quản lý việc tạo mới, xem chi tiết hoặc cập nhật tài khoản,
       truyền vào các props như isOpen để điều khiển hiển thị modal, onClose để xử lý khi đóng modal,
        loading để hiển thị hiệu ứng loading khi đang thực hiện các thao tác liên quan đến dữ liệu, */}

      <FormModal<account>
        // Truyền vào isOpen để điều khiển hiển thị modal, giá trị này được lấy từ custom hook useFormModal để xác định xem modal có đang mở hay không
        isOpen={isModalOpen}
        // Truyền vào hàm close để xử lý khi người dùng đóng modal, hàm này sẽ được gọi khi người dùng click vào nút đóng modal hoặc khi thao tác trong modal hoàn tất và cần đóng modal
        onClose={close}
        // Truyền vào loading để hiển thị hiệu ứng loading khi đang thực hiện các thao tác liên quan đến dữ liệu, như tạo mới hoặc cập nhật tài khoản
        loading={loading}
        // Truyền vào modalMode để điều chỉnh giao diện và hành vi của modal dựa trên mục đích sử dụng (CREATE, VIEW hoặc EDIT)
        mode={modalMode}
        // Truyền vào tiêu đề của modal dựa trên modalMode hiện tại, để hiển thị tiêu đề phù hợp với mục đích sử dụng của modal
        title={modalTitle}
        // Truyền vào các trường cho form dựa trên modalMode, nếu đang ở chế độ CREATE thì sử dụng accountFields đầy đủ, nếu đang ở chế độ EDIT hoặc VIEW thì lọc bỏ trường password để tránh hiển thị hoặc chỉnh sửa mật khẩu trong form
        fields={modalMode === (FormModalMode.CREATE) ? accountFields : accountFields.filter(field => field.key !== 'password') }
        // Truyền vào initialValues để xác định giá trị ban đầu của form, nếu đang ở chế độ VIEW hoặc EDIT thì sử dụng selectedAccount để hiển thị chi tiết tài khoản đã chọn, nếu đang ở chế độ CREATE thì sử dụng defaultFormValues để hiển thị form trống cho việc tạo mới tài khoản
        initialValues={selectedAccount || defaultFormValues}
        // Truyền vào hàm handleSubmitForm để xử lý khi người dùng submit form trong modal, hàm này sẽ nhận vào values là dữ liệu của tài khoản được nhập trong form, sau đó thực hiện các hành động tương ứng dựa trên modalMode (CREATE hoặc EDIT) như gọi API để tạo mới hoặc cập nhật tài khoản, hiển thị thông báo thành công hoặc lỗi, và làm mới danh sách tài khoản sau khi thao tác hoàn tất
        onSubmit={handleSubmitForm}
        // Truyền vào hasChildren với giá trị false để chỉ định rằng form này không có các mục con, điều này có thể được sử dụng để điều chỉnh giao diện hoặc hành vi của FormModal nếu nó được thiết kế để hỗ trợ cả trường hợp có và không có mục con
        hasChildren={false}
        
      />
    </div>
  );
};

export default AdminManagerAccount;
