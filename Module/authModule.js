// authModule.js
// Module xử lý xác thực người dùng

// Closure để ẩn logic hash password (bảo mật cơ bản)
const createHasher = () => {
  const salt = "secretSalt"; // Salt ẩn để tăng bảo mật
  return (password) => {
    // Hash đơn giản: reverse password + thêm salt
    return password.split("").reverse().join("") + salt;
  };
};
const hashPassword = createHasher(); // Chỉ gọi closure một lần

class AuthModule {
  constructor() {
    this.usersKey = "hrmUsers"; // Key cho localStorage lưu users
    this.sessionKey = "hrmSession"; // Key cho session token
    this.initDefaultUsers(); // Khởi tạo users mặc định nếu chưa có
  }

  // Khởi tạo dữ liệu mặc định (nếu localStorage rỗng)
  initDefaultUsers() {
    const users = this.getUsers();
    if (users.length === 0) {
      this.register("admin", "admin@gmail.com", "pass123", "pass123");
    }
  }

  // Lấy danh sách users từ localStorage
  getUsers() {
    const usersJson = localStorage.getItem(this.usersKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // Lưu danh sách users vào localStorage
  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // Đăng ký user mới
  async register(username, email, password, password_confirmation) {
    await this.simulateDelay(1000);
    const users = this.getUsers();
    // Kiểm tra username đã tồn tại
    if (users.some((user) => user.username === username)) {
      throw new Error("Username has existed!!!");
    }
    const hashed = hashPassword(password);
    const hashedConfirm = hashPassword(password_confirmation);

    users.push({
      username,
      email,
      hashedPassword: hashed,
      hashedPassConfirm: hashedConfirm,
    });
    this.saveUsers(users);
    return true; // Thành công
  }

  // Đăng nhập với async/await (giả lập delay 1 giây)
  // Hàm đăng nhập bất đồng bộ (async function): Kiểm tra username/password, tạo session nếu đúng.
  // English: Asynchronous login function: Checks username/password, creates session if correct.
  async login(username, password) {
    // Chờ 1 giây giả lập (await một Promise): Như chờ server thật trả lời, tránh code chạy ngay lập tức.
    // English: Await 1-second simulation (a Promise): Like waiting for real server response, prevents instant execution.
    await this.simulateDelay(1000); // Giả lập chờ server / Simulate server delay

    // Lấy danh sách users từ localStorage: Chuyển JSON string thành mảng object (hoặc [] nếu rỗng).
    // English: Get users list from localStorage: Parse JSON string to array of objects (or [] if empty).
    const users = this.getUsers();

    // Tìm user khớp username: Dùng array.find() - higher-order function, trả về object đầu tiên khớp hoặc undefined.
    // English: Find user matching username: Use array.find() - higher-order function, returns first matching object or undefined.
    const user = users.find((u) => u.username === username);

    // Kiểm tra nếu user tồn tại và password hashed khớp: Nếu đúng, tạo token và lưu; sai thì throw error.
    // English: Check if user exists and hashed password matches: If yes, create token and save; else throw error.
    if (user && user.hashedPassword === hashPassword(password)) {
      // Tạo token đơn giản: Kết hợp username + thời gian hiện tại (Date.now() - timestamp milliseconds).
      // English: Create simple token: Combine username + current time (Date.now() - timestamp in milliseconds).
      // Token này như "vé vào cửa" tạm thời, không an toàn thực tế nhưng demo session.
      // English: This token like a "temporary entry ticket", not real secure but demos session.
      const token = `${username}_${Date.now()}`;

      // Lưu token vào localStorage: Dùng setItem với key sessionKey, để sau kiểm tra isLoggedIn().
      // English: Save token to localStorage: Use setItem with sessionKey, for later isLoggedIn() check.
      // localStorage lưu trên browser, tồn tại đến khi xóa thủ công.
      // English: localStorage saves in browser, persists until manually cleared.
      localStorage.setItem(this.sessionKey, token);

      // Trả về token: Cho caller (như handleLogin) dùng, ví dụ alert hoặc lưu thêm.
      // English: Return token: For caller (like handleLogin) to use, e.g., alert or further save.
      return token;
    }

    // Ném lỗi nếu sai: Throw Error dừng hàm, catch ở ngoài (như .catch trong handleLogin) xử lý alert.
    // English: Throw error if wrong: Throw Error stops function, caught outside (like .catch in handleLogin) for alert.
    // Lỗi này như "báo động" để app biết thất bại.
    // English: This error like an "alarm" for app to know failure.
    throw new Error("Wrong user or password!!!");
  }

  // Kiểm tra session có hợp lệ không
  isLoggedIn() {
    return !!localStorage.getItem(this.sessionKey); // !! để chuyển sang boolean
  }

  // Đăng xuất
  logout() {
    localStorage.removeItem(this.sessionKey);
  }

  // Giả lập delay với Promise
  simulateDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new AuthModule(); // Export instance để dùng trực tiếp
