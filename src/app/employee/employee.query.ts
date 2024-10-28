import { gql } from 'apollo-angular';

export const GET_EMPLOYEES = gql`
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
