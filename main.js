import auth from "./Module/authModule.js"; // Import module đúng đường dẫn / Import from correct path
import employeesDB from "./Module/EmployeeDBModule.js";

// Hàm hiển thị form login / Show login form
function showLoginForm() {
  document.getElementById("login-container").style.display = "block"; // Hiện / Show
  document.getElementById("dashboard").style.display = "none"; // Ẩn / Hide
  document.getElementById("register-container").style.display = "none";
}

// Hàm hiển thị dashboard / Show dashboard
function showDashboard() {
  document.getElementById("login-container").style.display = "none"; // Ẩn / Hide
  document.getElementById("dashboard").style.display = "block"; // Hiện / Show
  document.getElementById("register-container").style.display = "none";
}

// Hàm hiển thị form register / Show register
function showRegisterForm() {
  document.getElementById("register-container").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("login-container").style.display = "none";
}

// Hàm hiển thị form employees / Show Employees form
function ShowEmployeesForm() {
  document.getElementById("dashboard").style.display = "";
  document.getElementById("employees-section").style.display = "block";
}

// Hàm hiển thị add employees / Show employee-form-container
function addEmployeesForm() {
  document.getElementById("employees-section").style.display = "none";
  document.getElementById("employee-form-container").style.display = "block";
}

function editEmployeeForm() {
  document.getElementById("employees-section").style.display = "none";
  document.getElementById("employee-form-edit").style.display = "block";
}

// Khi load app / On app load
window.addEventListener("load", () => {
  if (!auth.isLoggedIn()) {
    showLoginForm(); // Hiển thị form login (tạo DOM động - ở đây dùng sẵn HTML) / Show login
  }
  if (!auth.isLoggedIn()) {
    showRegisterForm(); // Show form register
  }
  if (!auth.isLoggedIn()) {
    ShowEmployeesForm();
  } else {
    showDashboard(); // Show Dashboard
  }

  // Gắn event cho form login / Attach event to login form
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document
    .getElementById("register-form")
    .addEventListener("submit", handleRegister);

  // Gắn event cho employee-form-container
  document
    .getElementById("employee-form-container")
    .querySelector("button")
    .addEventListener("click", handleAddEmployee);
});

// Xử lý form login / Handle login
function handleLogin(event) {
  event.preventDefault(); // Ngăn reload trang / Prevent page reload
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  auth
    .login(username, password)
    .then(() => {
      alert("Login successfully!!!"); // Thông báo thành công / Success alert
      showDashboard();
    })
    .catch((err) => alert(err.message)); // Hiển thị lỗi / Show error
}

// Xử lý form register / Handle register
function handleRegister(event) {
  event.preventDefault(); // Ngăn reload trang / Prevent page reload
  const nameRegister = document.getElementById("username_register").value;
  const emailRegister = document.getElementById("email_register").value;
  const passRegister = document.getElementById("password_register").value;
  const passConfirm = document.getElementById("password_confirmation").value;

  auth
    .register(nameRegister, emailRegister, passRegister, passConfirm)
    .then(() => {
      alert("Register successfully!!!");
      showDashboard();
    })
    .catch((err) => alert(err.message));
}

// Logout button / Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.logout();
  showLoginForm();
});

// Show employees database
document.getElementById("employees").addEventListener("click", () => {
  ShowEmployeesForm();
});

document
  .getElementById("show-login")
  .querySelector("button")
  .addEventListener("click", () => {
    showLoginForm();
  });

document
  .getElementById("show-register")
  .querySelector("button")
  .addEventListener("click", () => {
    showRegisterForm();
  });

document.getElementById("add-employee-btn").addEventListener("click", () => {
  addEmployeesForm();
});

// Hàm xử lý thêm nhân viên / Function add employee
function handleAddEmployee(event) {
  event.preventDefault();

  let empID = document.getElementById("emp-id").value.trim(); // Lấy và loại bỏ khoảng trắng.
  // English: Get and trim whitespace.
  const empName = document.getElementById("emp-name").value.trim();
  const empDepartment = document.getElementById("emp-department").value.trim();
  const empPosition = document.getElementById("emp-position").value.trim();
  const empSalary = document.getElementById("emp-salary").value.trim();

  // Kiểm tra validate input.
  // Validate input checks.
  if (!empName || !empDepartment || !empPosition || !empSalary) {
    alert("Please fill in all required fields!");
    // Thông báo nếu thiếu trường.
    // English: Alert if any field is missing.
    return;
  }

  if (isNaN(parseFloat(empSalary)) || parseFloat(empSalary) <= 0) {
    alert("Salary must be a positive number!");
    // Kiểm tra lương là số dương.
    // English: Check if salary is a positive number.
    return;
  }

  if (empID && isNaN(parseInt(empID))) {
    alert("ID must be a number if provided!");
    // Kiểm tra ID là số nếu nhập.
    // English: Check if ID is a number if provided.
    return;
  }

  if (empID === "") empID = null;
  // Nếu ID trống, set null để tự tạo.
  // English: If ID is empty, set to null for auto-generation.

  try {
    const success = employeesDB.addEmployee(
      empID,
      empName,
      empDepartment,
      empPosition,
      empSalary
    );
    if (success) {
      alert("Add employee successfully!!!");
      // Làm sạch form sau khi thêm thành công.
      // Clear form after success.
      document.getElementById("emp-id").value = "";
      document.getElementById("emp-name").value = "";
      document.getElementById("emp-department").value = "";
      document.getElementById("emp-position").value = "";
      document.getElementById("emp-salary").value = "";
      loadEmployeesTable(); // Cập nhật bảng.
      // English: Update the table.
      document.getElementById("employee-form").style.display = "none";
      ShowEmployeesForm(); // Quay về danh sách.
      // English: Return to list view.
    } else {
      alert("Cannot add employee!!!");
    }
  } catch (err) {
    alert(err.message); // Bắt lỗi từ addEmployee.
    // English: Catch error from addEmployee.
  }
}

// Hàm hiển thị danh sách nhân viên lên bảng HTML
// Function to display the list of employees in the HTML table
function loadEmployeesTable() {
  // Lấy phần tbody của bảng có id="employees-table" từ DOM
  // Get the tbody element of the table with id="employees-table" from the DOM
  const tbody = document
    .getElementById("employees-table")
    .querySelector("tbody");

  // Xóa toàn bộ nội dung hiện tại trong tbody để tránh lặp dữ liệu
  // Clear all current content in tbody to avoid duplicating data
  tbody.innerHTML = "";

  // Lấy danh sách nhân viên từ EmployeeDBModule (từ localStorage)
  // Get the list of employees from EmployeeDBModule (from localStorage)
  const employees = employeesDB.getEmployees();

  // Kiểm tra nếu danh sách nhân viên rỗng (không có nhân viên nào)
  // Check if the employee list is empty (no employees)
  if (employees.length === 0) {
    // Tạo một hàng (tr) mới trong bảng
    // Create a new row (tr) in the table
    const row = document.createElement("tr");

    // Tạo một ô (td) để hiển thị thông báo
    // Create a cell (td) to display the message
    const cell = document.createElement("td");

    // Đặt thuộc tính colspan=6 để ô chiếm toàn bộ 6 cột của bảng
    // Set colspan=6 so the cell spans all 6 columns of the table
    cell.colSpan = 6;

    // Đặt nội dung của ô là thông báo "No employees found."
    // Set the cell's content to the message "No employees found."
    cell.textContent = "No employees found.";

    // Thêm ô vào hàng
    // Append the cell to the row
    row.appendChild(cell);

    // Thêm hàng vào tbody
    // Append the row to the tbody
    tbody.appendChild(row);

    // Thoát hàm vì không cần xử lý thêm nếu danh sách rỗng
    // Exit the function since no further processing is needed if the list is empty
    return;
  }

  // Duyệt qua từng nhân viên trong danh sách bằng vòng lặp forEach
  // Iterate through each employee in the list using a forEach loop
  employees.forEach((emp) => {
    // Tạo một hàng (tr) mới cho nhân viên
    // Create a new row (tr) for the employee
    const row = document.createElement("tr");

    // Tạo ô cho ID nhân viên và đặt nội dung là emp.id_emp
    // Create a cell for the employee ID and set its content to emp.id_emp
    const idCell = document.createElement("td");
    idCell.textContent = emp.id_emp;
    row.appendChild(idCell);

    // Tạo ô cho tên nhân viên và đặt nội dung là emp.name_emp
    // Create a cell for the employee name and set its content to emp.name_emp
    const nameCell = document.createElement("td");
    nameCell.textContent = emp.name_emp;
    row.appendChild(nameCell);

    // Tạo ô cho bộ phận và đặt nội dung là emp.department_emp
    // Create a cell for the department and set its content to emp.department_emp
    const deptCell = document.createElement("td");
    deptCell.textContent = emp.department_emp;
    row.appendChild(deptCell);

    // Tạo ô cho vị trí và đặt nội dung là emp.position_emp
    // Create a cell for the position and set its content to emp.position_emp
    const posCell = document.createElement("td");
    posCell.textContent = emp.position_emp;
    row.appendChild(posCell);

    // Tạo ô cho lương và đặt nội dung là emp.salary_emp, định dạng với dấu phẩy
    // Create a cell for the salary and set its content to emp.salary_emp, formatted with commas
    const salaryCell = document.createElement("td");
    salaryCell.textContent = emp.salary_emp.toLocaleString();
    row.appendChild(salaryCell);

    // Tạo ô cho hành động (Actions) và thêm nút Edit/Delete
    // Create a cell for actions and add Edit/Delete buttons
    const actionsCell = document.createElement("td");
    const buttonEdit = document.createElement("button");
    buttonEdit.textContent = "Edit";
    const buttonDelete = document.createElement("button");
    buttonDelete.textContent = "Delete";

    // Thêm màu đỏ cho nút Delete và khoảng cách giữa hai nút
    // Add red color to Delete button and spacing between buttons
    buttonDelete.style.backgroundColor = "red"; // Đặt màu nền đỏ cho nút Delete
    // Set red background color for Delete button
    buttonDelete.style.color = "white"; // Đặt chữ trắng để dễ đọc
    // Set white text for readability
    buttonEdit.style.marginRight = "20px"; // Thêm khoảng cách 10px bên phải nút Edit
    // Add 10px margin to the right of Edit button

    // Thêm sự kiện click cho nút Delete
    // Add click event for Delete button
    buttonDelete.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this employee?"
      ); // Xác nhận trước khi xóa
      // Confirm before deleting
      if (confirmDelete) {
        const success = employeesDB.removeEmployee(emp.id_emp); // Gọi xóa với ID nhân viên
        // Call deletion with employee ID
        if (success) {
          loadEmployeeAfterDelete();
          // Reload bảng sau xóa thành công
          // Reload table after successful deletion
        } else {
          alert("Employee not found to delete!");
          // Thông báo nếu không tìm thấy
          // Alert if employee not found
        }
      }
    });

    // Thêm sự kiên cho nút edit
    // Add click event to button EDIT
    buttonEdit.addEventListener("click", () => {
      editEmployeeForm();
      const confirmDelete = confirm(
        "Are you sure you want to edit this employee?"
      ); // Xác nhận trước khi xóa
      // Confirm before deleting
      if (confirmDelete) {
        const success = employeesDB.editEmployee(emp.id_emp); // Gọi xóa với ID nhân viên
        // Call deletion with employee ID
        if (success) {
          loadEmployeeAfterEdit();
          // Reload bảng sau xóa thành công
          // Reload table after successful deletion
        } else {
          alert("Employee not found to edit!");
          // Thông báo nếu không tìm thấy
          // Alert if employee not found
        }
      }
    });

    // Thêm nút vào ô hành động
    // Append buttons to actions cell
    actionsCell.appendChild(buttonEdit);
    actionsCell.appendChild(buttonDelete);
    row.appendChild(actionsCell);

    // Thêm hàng hoàn chỉnh vào tbody
    // Append the completed row to the tbody
    tbody.appendChild(row);
  });
}

// Hàm reload bảng sau khi xóa nhân viên
// Function to reload the table after deleting an employee
function loadEmployeeAfterDelete() {
  loadEmployeesTable(); // Gọi lại hàm load bảng để cập nhật giao diện
  // Call the load table function again to update the interface
  alert("Employee deleted successfully!"); // Thông báo xóa thành công (tùy chọn)
  // Alert for successful deletion (optional)
}

// Hàm reload bảng sau khi edit nhân viên
// Function to reload the table after editing an employee
function loadEmployeeAfterEdit() {
  loadEmployeesTable();
  // Call the load table function again to update the interface
  alert("Employee edited successfully!!!");
  // Alert for successful edit
}

// Xử lý nút Cancel trong form thêm nhân viên
// Handle Cancel button in the Add Employee form
document.getElementById("cancel-form").addEventListener("click", () => {
  document.getElementById("employee-form-container").style.display = "none"; // Ẩn form
  // Hide the form
  ShowEmployeesForm(); // Quay về danh sách nhân viên
  // Return to the employee list
});
