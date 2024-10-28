import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { GET_EMPLOYEES } from './employee.query';
import { EmployeesResponse } from '../../types';

@Injectable()
export class EmployeeService {
  readonly #apollo = inject(Apollo);

  getEmployees({
    page = 1,
    limit = 10,
    searchTerm = '',
    sortField = '_id',
    sortOrder = 'ASC',
  }: {
    page: number;
    limit: number;
    searchTerm: unknown;
    sortField: unknown;
    sortOrder: unknown;
  }) {
    return this.#apollo.watchQuery<EmployeesResponse>({
      query: GET_EMPLOYEES,
      variables: {
        pagination: {
          page,
          limit,
        },
        filter: {
          searchTerm,
        },
        sort: {
          field: sortField,
          order: sortOrder,
        },
      },
    }).valueChanges;
  }
}
