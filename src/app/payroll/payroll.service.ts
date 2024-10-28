import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
  GET_AGGREGATED_PAYROLL,
  GET_COMPARISON_PAYROLL,
  GET_SEGMENTED_PAYROLL,
} from './payroll.query';

@Injectable()
export class PayrollService {
  readonly #apollo = inject(Apollo);

  getSegmentedData({
    dateRange,
    page,
    limit,
    sortField,
    sortOrder,
  }: {
    dateRange: any;
    page: number;
    limit: number;
    sortField: string | unknown;
    sortOrder: string | unknown;
  }) {
    return this.#apollo.watchQuery({
      query: GET_SEGMENTED_PAYROLL,
      variables: {
        dateRange,
        page,
        limit,
        sortField,
        sortOrder,
      },
    }).valueChanges;
  }

  getAggregatedData({
    dateRange,
    page,
    limit,
  }: {
    dateRange: any;
    page: number;
    limit: number;
  }) {
    return this.#apollo.watchQuery({
      query: GET_AGGREGATED_PAYROLL,
      variables: {
        dateRange,
        page,
        limit,
      },
    }).valueChanges;
  }

  getComparisonData({
    period1,
    period2,
    page,
    limit,
  }: {
    period1: any;
    period2: any;
    page: number;
    limit: number;
  }) {
    return this.#apollo.watchQuery({
      query: GET_COMPARISON_PAYROLL,
      variables: {
        period1,
        period2,
        page,
        limit,
      },
    }).valueChanges;
  }
}
