import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { EmployeeService } from './employee.service';
import { Employee, PageInfo } from '../../types';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [TableModule, InputTextModule, DatePipe, DecimalPipe],
  providers: [EmployeeService],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnDestroy {
  readonly #employeeService = inject(EmployeeService);

  pageInfo: PageInfo = {
    page: 1,
    limit: 10,
    total: 0,
  };
  employees: Employee[] = [];
  loading = true;
  error: any;

  private querySubscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

  loadEmployees(event: TableLazyLoadEvent) {
    this.pageInfo.limit = event.rows?.valueOf() || 10;
    this.pageInfo.page =
      event.first === 0 ? 1 : (event.first || 0) / this.pageInfo.limit + 1;

    this.querySubscription = this.#employeeService
      .getEmployees({
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        searchTerm: event.globalFilter,
        sortField: event.sortField,
        sortOrder: event.sortOrder === 1 ? 'ASC' : 'DESC',
      })
      .subscribe(({ loading, error, data }) => {
        this.loading = loading;
        this.error = error;
        this.employees = data.employees.data;
        this.pageInfo = { ...data.employees.pageInfo };
      });
  }
}
