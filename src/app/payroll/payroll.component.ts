import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { PayrollService } from './payroll.service';

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
    TabViewModule,
    CurrencyPipe,
    DatePipe,
  ],
  providers: [PayrollService],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.css',
})
export class PayrollComponent {
  readonly #payrollService = inject(PayrollService);

  loading = false;
  items: MenuItem[] = [];
  activeItem: MenuItem = {};
  activeView: 'segmented' | 'aggregated' | 'comparison' = 'segmented';
  startDate: Date = new Date();
  endDate: Date = new Date();
  messages: any[] = [];

  totalReports: number = 0;
  showReports: boolean = false;
  hasMultipleMonths: boolean = false;
  segmentedData: any[] = [];
  aggregatedData: any[] = [];
  comparisonData: any[] = [];
  periods: string[] = [];

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
        return;
      }

      this.messages = [];
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.hasMultipleMonths =
        end.getMonth() -
          start.getMonth() +
          12 * (end.getFullYear() - start.getFullYear()) >
        0;
      console.log('hasMultipleMonths:', this.hasMultipleMonths);
    }
  }

  getFormattedDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
  }

  loadSegmentedData(event: TableLazyLoadEvent) {
    const { first, rows, sortField, sortOrder } = event;
    const page = rows || 10;
    const limit = first === 0 ? 1 : (first || 0) / page + 1;

    this.#payrollService
      .getSegmentedData({
        dateRange: {
          startDate: this.getFormattedDate(this.startDate),
          endDate: this.getFormattedDate(this.endDate),
        },
        page,
        limit,
        sortField,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc',
      })
      .subscribe(({ data }: any) => {
        this.segmentedData = data.getSegmentedPayroll.items;
        this.totalReports = data.getSegmentedPayroll.totalRecords;
        this.showReports = true;
      });
  }

  generateReport() {
    if (!this.startDate || !this.endDate) return;

    const dateRange = {
      startDate: this.getFormattedDate(this.startDate),
      endDate: this.getFormattedDate(this.endDate),
    };

    this.loadSegmentedData({ first: 0, rows: 10 });

    if (this.hasMultipleMonths) {
      // Load aggregated data
      this.#payrollService
        .getAggregatedData({
          dateRange,
          page: 1,
          limit: 10,
        })
        .subscribe(({ data }: any) => {
          this.aggregatedData = data.getAggregatedPayroll;
        });

      // Load comparison data
      const period1 = {
        startDate: this.getFormattedDate(this.startDate),
        endDate: this.getFormattedDate(this.startDate),
      };
      const period2 = {
        startDate: this.getFormattedDate(this.endDate),
        endDate: this.getFormattedDate(this.endDate),
      };

      this.#payrollService
        .getComparisonData({ period1, period2, page: 1, limit: 10 })
        .subscribe(({ data }: any) => {
          this.comparisonData = data.getComparisonData;
        });
    }
  }
}
