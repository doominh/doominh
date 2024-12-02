export interface EmployeeManagement {
  name: string;
  position: string;
  email: string;
  phone: string;
  gender: string;
  branch: string;
}

export interface Employee {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  _id: string;
  username: string;
  fullname: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  branchId: string;
}
