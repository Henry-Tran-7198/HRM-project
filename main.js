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
  document.getElementById("employees-section").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
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
  console.log(nameRegister, emailRegister, passRegister, passConfirm);

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
