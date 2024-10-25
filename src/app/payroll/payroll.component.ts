import { Component, inject, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { GqlService } from '../gql.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [
    TabMenuModule,
    CalendarModule,
    FormsModule,
    MessagesModule,
    ProgressSpinnerModule,
    TableModule,
    CurrencyPipe,
  ],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.css',
})
export class PayrollComponent implements OnInit {
  readonly #gqlService = inject(GqlService);

  loading = false;
  items: MenuItem[] = [];
  activeItem: MenuItem = {};
  activeView: 'segmented' | 'aggregated' | 'comparison' = 'segmented';
  startDate: Date = new Date();
  endDate: Date = new Date();
  messages: any[] = [];

  segmentedData: any[] = [];
  aggregatedData: any[] = [];
  comparisonData: any[] = [];
  periods: string[] = [];

  ngOnInit(): void {
    this.items = [
      { label: 'Segmented View', command: () => this.changeView('segmented') },
      {
        label: 'Aggregated View',
        command: () => this.changeView('aggregated'),
      },
      {
        label: 'Comparison View',
        command: () => this.changeView('comparison'),
      },
    ];
    this.activeItem = this.items[0];
  }

  changeView(view: 'segmented' | 'aggregated' | 'comparison') {
    this.activeView = view;
    this.loadData();
  }

  formatPeriod(period: string): string {
    const [year, month] = period.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
      'default',
      { month: 'short', year: 'numeric' }
    );
  }

  onDateSelect() {
    if (this.startDate && this.endDate) {
      if (this.endDate < this.startDate) {
        this.messages = [
          {
            severity: 'error',
            summary: 'Date Error',
            detail: 'End date must be after start date',
          },
        ];
        this.endDate = new Date();
      } else {
        this.messages = [];
      }
    }
  }

  getFormattedDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }

  getPeriodData(employee: any, period: string) {
    const periodData = employee.periods.find((p: any) => p.period === period);
    return periodData?.payrollData;
  }

  extractUniquePeriods(data: any[]): string[] {
    const periods = new Set<string>();
    data.forEach((employee) => {
      employee.periods.forEach((period: any) => {
        periods.add(period.period);
      });
    });
    return Array.from(periods).sort();
  }

  loadData() {
    switch (this.activeView) {
      case 'segmented':
        this.loadSegmentedData();
        break;
      case 'aggregated':
        this.loadAggregatedData();
        break;
      // case 'comparison':
      //   this.loadComparisonData();
      //   break;
    }
  }

  loadSegmentedData() {
    const startPeriod = this.getFormattedDate(this.startDate);
    const endPeriod = this.getFormattedDate(this.endDate);

    this.#gqlService
      .getSegmentedData({
        startDate: `${startPeriod}-01`,
        endDate: `${endPeriod}-31`,
      })
      .subscribe(({ data }: any) => {
        this.segmentedData = data.getSegmentedPayrolls;
        this.periods = this.extractUniquePeriods(data.getSegmentedPayrolls);
      });
  }

  loadAggregatedData() {
    const startPeriod = this.getFormattedDate(this.startDate);
    const endPeriod = this.getFormattedDate(this.endDate);

    this.#gqlService
      .getAggregatedData({
        startDate: `${startPeriod}-01`,
        endDate: `${endPeriod}-31`,
      })
      .subscribe(({ data }: any) => {
        this.segmentedData = data.getSegmentedPayrolls;
        this.periods = this.extractUniquePeriods(data.getSegmentedPayrolls);
      });
  }

  // loadComparisonData() {
  //   this.#gqlService
  //     .getComparisonData({ firstPeriod: this.startDate, endDate: this.endDate })
  //     .subscribe(({ data }: any) => {
  //       this.segmentedData = data.getSegmentedPayrolls;
  //       this.periods = this.extractUniquePeriods(data.getSegmentedPayrolls);
  //     });
  // }
}
