export type Employee = {
  _id: number;
  employeeName: string;
  department: string;
  designation: string;
  workLocation: string;
};

export type PageInfo = {
  page: number;
  limit: number;
  total: number;
};

export type EmployeesResponse = {
  employees: {
    pageInfo: PageInfo;
    data: Employee[];
  };
};
