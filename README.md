// Admin 
// sau khi hoàn thành chức năng vs admin tiến hành vào router Router.tsx gắn đường dẫn vào sau tương tự adminAccount đó vào component slidebar chọn đúng chỗ để đưa đường path vua tạo trong Router.tsx để chạy đc giao diện 

// cách bắt đầu mỗi lần vào code và khi hoàn thành code 
B1: git branch ( Kiểm tra branch hiện tại nếu không đúng thì chuyển về branch của mình )
B2: git pull origin developer
B3: Code xong: git status -> git add . -> git commit -m "Nội dung commit ghi rõ đã làm gì bằng tiếng anh theo hướng dẫn" -> git push -u origin <my-branch> ( nếu đã dùng lệnh này trước đó thì lần push sau chỉ cần git push )
B4:lên git hub Tạo pull request base: developer -- compare: <my-branch> 
*** không ai đc push trực tiếp từ nhánh của mình lên developer hoặc main  

Hướng dẫn commit code
"Add login page"
"Fix authentication bug"
"Update user profile UI"
"Remove unused code"

---

## 🚀 Tech Stack Frontend

**1. Core:**
*   **React** (`^19.2.6`): Thư viện chính để xây dựng giao diện người dùng.
*   **TypeScript** (`~6.0.2`): Ngôn ngữ cung cấp type-checking.
*   **Vite** (`^8.0.12`): Build tool và dev server siêu tốc.

**2. Routing & State Management:**
*   **React Router / React Router DOM** (`^7.18.0`): Xử lý định tuyến giữa các trang.
*   **Redux Toolkit** (`^2.12.0`) & **React Redux** (`^9.3.0`): Quản lý State toàn cục.

**3. Styling & UI Components:**
*   **Tailwind CSS** (`^4.3.1`): Utility-first CSS framework.
*   **Ant Design (antd)** (`^6.4.4`): Thư viện UI component.
*   **Icons**: **Lucide React** (`^1.24.0`) và **React Icons** (`^5.6.0`).

**4. Networking:**
*   **Axios** (`^1.18.0`): HTTP client dựa trên Promise dùng để gọi API.

**5. Testing & Code Quality:**
*   **ESLint** (`^10.3.0`): Linter kiểm tra code style và lỗi cú pháp.