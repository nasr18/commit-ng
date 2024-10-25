import { Routes } from '@angular/router';
import { PayrollComponent } from './payroll/payroll.component';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
    pathMatch: 'full',
  },
  {
    path: 'payroll',
    component: PayrollComponent,
    pathMatch: 'full',
  },
];
