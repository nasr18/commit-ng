import { gql } from 'apollo-angular';

const GET_SEGMENTED_PAYROLL = gql`
  query GetSegmentedPayroll(
    $dateRange: DateRangeInput!
    $page: Int
    $limit: Int
    $sortField: String
    $sortOrder: String
  ) {
    getSegmentedPayroll(
      dateRange: $dateRange
      page: $page
      limit: $limit
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      items {
        employee {
          employeeName
          department
          designation
          workLocation
        }
        periods {
          payrollDate
          totalEarnings
          deductions
          workingDays
          leaveDays
          totalNetPay
        }
      }
      totalCount
    }
  }
`;

const GET_AGGREGATED_PAYROLL = gql`
  query GetAggregatedPayroll(
    $dateRange: DateRangeInput!
    $page: Int
    $limit: Int
  ) {
    getAggregatedPayroll(dateRange: $dateRange, page: $page, limit: $limit) {
      employee {
        employeeName
        department
        designation
        workLocation
      }
      totalEarnings
      totalDeductions
      totalWorkingDays
      totalLeaveDays
      averageNetPay
    }
  }
`;

const GET_COMPARISON_PAYROLL = gql`
  query GetPayrollComparison(
    $period1: DateRangeInput!
    $period2: DateRangeInput!
    $page: Int
    $limit: Int
  ) {
    getComparisonPayroll(
      period1: $period1
      period2: $period2
      page: $page
      limit: $limit
    ) {
      employee {
        employeeName
        department
        designation
        workLocation
      }
      earningsDiff
      deductionsDiff
      workingDaysDiff
      leaveDaysDiff
      netPayDiff
    }
  }
`;

export {
  GET_SEGMENTED_PAYROLL,
  GET_AGGREGATED_PAYROLL,
  GET_COMPARISON_PAYROLL,
};
