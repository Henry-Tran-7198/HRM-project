// Class EmployeeDBModule: Đây là lớp quản lý cơ sở dữ liệu nhân viên, sử dụng localStorage để lưu trữ.
// English: This is the EmployeeDBModule class, which manages the employee database using localStorage for storage.
class EmployeeDBModule {
  // Constructor: Hàm khởi tạo gọi khi tạo instance mới. Đặt key cho localStorage và khởi tạo dữ liệu mặc định.
  // English: Constructor: Initialization function called when creating a new instance. Sets keys for localStorage and initializes default data.
  constructor() {
    this.employeesKey = "hrmEmployees"; // Key để lưu danh sách nhân viên trong localStorage.
    // English: Key to store the list of employees in localStorage.
    this.sessionKey = "hrmSession"; // Key để lưu session (có thể dùng cho xác thực, nhưng chưa dùng ở đây).
    // English: Key to store session (may be used for authentication, but not utilized here yet).
    this.initDefaultEmployees(); // Gọi hàm khởi tạo dữ liệu mặc định ngay khi tạo class.
    // English: Calls the function to initialize default employees immediately upon class creation.
  }

  // initDefaultEmployees: Hàm khởi tạo danh sách nhân viên mặc định nếu chưa có dữ liệu.
  // English: initDefaultEmployees: Function to initialize default employee list if no data exists.
  initDefaultEmployees() {
    const employees = this.getEmployees(); // Lấy danh sách nhân viên hiện tại từ localStorage.
    // English: Retrieves the current list of employees from localStorage.
    if (employees.length === 0) {
      // Kiểm tra nếu danh sách rỗng (chưa có nhân viên nào).
      // English: Checks if the list is empty (no employees yet).
      employees.push({
        id_emp: 1,
        name_emp: "Employee 1",
        department_emp: "IT",
        position_emp: "Developer",
        salary_emp: 10000000,
      });
      employees.push({
        id_emp: 2,
        name_emp: "Employee 2",
        department_emp: "HR",
        position_emp: "Manager",
        salary_emp: 15000000,
      });
      this.saveEmployees(employees); // Lưu danh sách mới với nhân viên mặc định.
      // English: Saves the new list with default employees.
    }
  }

  // addEmployee: Phương thức thêm nhân viên mới với các thông tin id, tên, bộ phận, vị trí, lương.
  // English: addEmployee: Method to add a new employee with id, name, department, position, salary.
  addEmployee(id_emp, name_emp, department_emp, position_emp, salary_emp) {
    // Validation: Kiểm tra kiểu dữ liệu và giá trị hợp lệ.
    // English: Validation: Check data types and valid values.
    if (typeof name_emp !== "string" || name_emp.trim() === "") {
      throw new Error("Name must be a non-empty string.");
      // Tên phải là chuỗi không rỗng.
    }
    if (typeof department_emp !== "string" || department_emp.trim() === "") {
      throw new Error("Department must be a non-empty string.");
      // Bộ phận phải là chuỗi không rỗng.
    }
    if (typeof position_emp !== "string" || position_emp.trim() === "") {
      throw new Error("Position must be a non-empty string.");
      // Vị trí phải là chuỗi không rỗng.
    }
    const parsedSalary = parseFloat(salary_emp);
    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      throw new Error("Salary must be a positive number.");
      // Lương phải là số dương.
    }

    const employees = this.getEmployees();
    let newId = id_emp ? parseInt(id_emp) : null;
    // Chuyển id_emp thành số nếu có, hoặc null nếu trống.
    // English: Convert id_emp to number if provided, or null if empty.

    // Kiểm tra tên nhân viên đã tồn tại.
    // Check if employee name already exists.
    if (employees.some((employee) => employee.name_emp === name_emp)) {
      throw new Error("Employee's name has existed!!!");
    }

    if (newId === null) {
      // Nếu id_emp không được truyền, tự tạo ID mới.
      // If id_emp is not provided, auto-generate a new ID.
      newId =
        employees.length > 0
          ? Math.max(...employees.map((emp) => emp.id_emp)) + 1
          : 1;
    } else {
      // Validation cho id_emp: Phải là số dương.
      // Validation for id_emp: Must be a positive number.
      if (isNaN(newId) || newId <= 0) {
        throw new Error("ID must be a positive integer.");
      }
      // Kiểm tra nếu ID đã tồn tại để tránh trùng lặp.
      // Check if the ID already exists to avoid duplicates.
      const existing = employees.find((emp) => emp.id_emp === newId);
      if (existing) {
        console.log("Id has existed, no add!!!");
        return false;
      }
    }

    employees.push({
      id_emp: newId,
      name_emp,
      department_emp,
      position_emp,
      salary_emp: parsedSalary, // Đã parse và validate.
      // English: Parsed and validated salary.
    });
    this.saveEmployees(employees);
    return true;
  }

  // removeEmployee: Phương thức xóa nhân viên theo id.
  // English: removeEmployee: Method to remove an employee by id.
  removeEmployee(id_emp) {
    // Validation: Kiểm tra id_emp là số dương.
    // English: Validation: Check if id_emp is a positive number.
    const parsedId = parseInt(id_emp);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error("ID must be a positive integer.");
    }

    const employees = this.getEmployees();

    // Tạo mảng mới bằng cách lọc nhân viên có ID không khớp.
    // Create a new array by filtering out the employee with matching ID.
    const updatedEmployees = employees.filter((emp) => emp.id_emp !== parsedId);

    if (updatedEmployees.length === employees.length) {
      // Nếu ID không tồn tại, return false.
      // If ID not found, return false.
      return false;
    }

    this.saveEmployees(updatedEmployees);
    return true;
  }

  // editEmployee: Phương thức chỉnh sửa nhân viên theo id, với các giá trị mới.
  // English: editEmployee: Method to edit an employee by id, with new values.
  editEmployee(id_emp, name_emp, department_emp, position_emp, salary_emp) {
    // Validation: Kiểm tra kiểu dữ liệu và giá trị hợp lệ tương tự addEmployee.
    // English: Validation: Check data types and valid values similar to addEmployee.
    if (typeof name_emp !== "string" || name_emp.trim() === "") {
      throw new Error("Name must be a non-empty string.");
    }
    if (typeof department_emp !== "string" || department_emp.trim() === "") {
      throw new Error("Department must be a non-empty string.");
    }
    if (typeof position_emp !== "string" || position_emp.trim() === "") {
      throw new Error("Position must be a non-empty string.");
    }
    const parsedSalary = parseFloat(salary_emp);
    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      throw new Error("Salary must be a positive number.");
    }

    // Validation cho id_emp.
    // Validation for id_emp.
    const parsedId = parseInt(id_emp);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error("ID must be a positive integer.");
    }

    const employees = this.getEmployees();

    const existing = employees.find((employee) => employee.id_emp === parsedId);
    if (!existing) {
      return false; // Không tồn tại, return false.
      // English: Does not exist, return false.
    }

    // Kiểm tra tên mới có trùng với tên khác không (trừ chính nó).
    // Check if new name duplicates with others (except itself).
    if (
      employees.some(
        (employee) =>
          employee.id_emp !== parsedId && employee.name_emp === name_emp
      )
    ) {
      throw new Error("Employee's name has existed!!!");
    }

    // Cập nhật các trường.
    // Update the fields.
    existing.name_emp = name_emp;
    existing.department_emp = department_emp;
    existing.position_emp = position_emp;
    existing.salary_emp = parsedSalary;

    this.saveEmployees(employees);
    return true;
  }

  // getEmployees: Phương thức lấy danh sách nhân viên từ localStorage.
  // English: getEmployees: Method to retrieve the list of employees from localStorage.
  getEmployees() {
    const employeesJson = localStorage.getItem(this.employeesKey);
    // Lấy chuỗi JSON từ localStorage bằng key.
    // English: Gets the JSON string from localStorage using the key.
    return employeesJson ? JSON.parse(employeesJson) : [];
    // Nếu có, parse thành mảng; không thì trả mảng rỗng.
    // English: If exists, parse to array; otherwise return empty array.
  }

  // saveEmployees: Phương thức lưu danh sách nhân viên vào localStorage.
  // English: saveEmployees: Method to save the list of employees to localStorage.
  saveEmployees(employees) {
    // Validation: Kiểm tra employees là mảng.
    // English: Validation: Check if employees is an array.
    if (!Array.isArray(employees)) {
      throw new Error("Employees must be an array.");
    }
    localStorage.setItem(this.employeesKey, JSON.stringify(employees));
    // Chuyển mảng thành JSON và lưu bằng key.
    // English: Converts the array to JSON and sets it in localStorage using the key.
  }
}

// Export instance: Xuất một instance mới của class để dùng trực tiếp ở file khác (như singleton).
// English: Exports a new instance of the class for direct use in other files (like a singleton).
export default new EmployeeDBModule();
