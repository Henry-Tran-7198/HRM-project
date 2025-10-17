class EmployeeDBModule {
  constructor() {
    this.employeesKey = "hrmEmployees";
    this.sessionKey = "hrmSession";
    this.initDefaultEmployees();
  }

  initDefaultEmployees() {
    const employees = this.getEmployees();
      if (employees.length === 0) {
        
    }
  }

  getEmployees() {
    const employeesJson = localStorage.getItem(this.employeesKey);
    return employeesJson ? JSON.parse(employeesJson) : [];
  }

  saveEmployees(employees) {
    localStorage.setItem(this.employeesKey, JSON.stringify(employees));
  }
}

export default new EmployeeDBModule();