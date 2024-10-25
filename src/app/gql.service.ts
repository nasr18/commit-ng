import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { EmployeesResponse } from '../types';

const GET_EMPLOYEES = gql`
  query GetEmployees(
    $pagination: PaginationInput
    $filter: EmployeeFilterInput
    $sort: SortInput
  ) {
    employees(pagination: $pagination, filter: $filter, sort: $sort) {
      data {
        _id
        employeeName
        department
        designation
        workLocation
      }
      pageInfo {
        page
        limit
        total
      }
    }
  }
`;

const GET_SEGMENTED_DATA = gql`
  query GetSegmentedPayrolls($startDate: String!, $endDate: String!) {
    getSegmentedPayrolls(startDate: $startDate, endDate: $endDate) {
      employee {
        employeeName
        department
        designation
      }
      periods {
        period
        payrollData {
          totalNetPay
          workingDays
          leaveDays
        }
      }
    }
  }
`;

const GET_AGGREGATED_DATA = gql`
  query GetAggregatedPayrolls($startDate: String!, $endDate: String!) {
    getAggregatedPayrolls(startDate: $startDate, endDate: $endDate) {
      employee {
        employeeName
        department
      }
      totalEarnings
      totalDeductions
      totalWorkingDays
      totalLeaveDays
      averageNetPay
      periodCount
    }
  }
`;

// const GET_COMPARISON_DATA = gql`
//   query GetComparisonPayrolls($firstPeriod: String!, $secondPeriod: String!) {
//     getComparisonPayrolls(firstPeriod: $firstPeriod, secondPeriod: $secondPeriod) {
//       employee {
//         employeeName
//         department
//       }
//       firstPeriod {
//         _id: ID!
//         payrollDate: String!
//         totalEarnings: Int
//         deductions: Int
//         workingDays: Int
//         leaveDays: Int
//         totalNetPay: Int
//       }
//       secondPeriod {
//         _id: ID!
//         payrollDate: String!
//         totalEarnings: Int
//         deductions: Int
//         workingDays: Int
//         leaveDays: Int
//         totalNetPay: Int
//       }
//       differences {
//         earningsDifference: Int!
//         deductionsDifference: Int!
//         workingDaysDifference: Int!
//         leaveDaysDifference: Int!
//         netPayDifference: Int!
//         percentageChange: Float!
//       }
//     }
//   }
// `;

@Injectable({
  providedIn: 'root',
})
export class GqlService {
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

  getSegmentedData({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    return this.#apollo.watchQuery({
      query: GET_SEGMENTED_DATA,
      variables: {
        startDate: startDate,
        endDate: endDate,
      },
    }).valueChanges;
  }

  getAggregatedData({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    return this.#apollo.watchQuery({
      query: GET_AGGREGATED_DATA,
      variables: {
        startDate: startDate,
        endDate: endDate,
      },
    }).valueChanges;
  }

  // getComparisonData({
  //   firstPeriod,
  //   secondPeriod,
  // }: {
  //   firstPeriod: string;
  //   secondPeriod: string;
  // }) {
  //   return this.#apollo.watchQuery({
  //     query: GET_COMPARISON_DATA,
  //     variables: {
  //       firstPeriod,
  //       secondPeriod,
  //     },
  //   }).valueChanges;
  // }
}
