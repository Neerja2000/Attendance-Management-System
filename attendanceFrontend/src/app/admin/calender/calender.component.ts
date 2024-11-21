import { Component } from '@angular/core';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  selectedDate: string | null = null;

  weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  daysInMonth: number[] = [];
  events: {
    [key: string]: { event: string; startTime: string; endTime: string; employee: string }[];
  } = {};
  newEvent = '';
  newStartTime = '';
  newEndTime = '';
  selectedEmployee = '';
  employeeList = ['John Doe', 'Jane Smith', 'Michael Brown']; // Example employees

  constructor() {
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    this.daysInMonth = Array(firstDay - 1)
      .fill(0)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Sync currentDate with currentMonth and currentYear
    this.currentDate = new Date(this.currentYear, this.currentMonth, 1);
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(dayIndex: number) {
    const day = this.daysInMonth[dayIndex];
    if (day !== 0) {
      // Use `toLocaleDateString` for proper timezone handling
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.selectedDate = date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    }
  }

  addEvent() {
    if (!this.newEvent.trim() || !this.selectedDate || !this.newStartTime || !this.newEndTime || !this.selectedEmployee) {
      alert('Please fill all fields before adding an event.');
      return;
    }

    const dateKey = this.selectedDate;
    if (!this.events[dateKey]) {
      this.events[dateKey] = [];
    }

    this.events[dateKey].push({
      event: this.newEvent.trim(),
      startTime: this.newStartTime,
      endTime: this.newEndTime,
      employee: this.selectedEmployee,
    });

    this.newEvent = '';
    this.newStartTime = '';
    this.newEndTime = '';
    this.selectedEmployee = '';
  }

  getSelectedDay(): number | null {
    return this.selectedDate ? parseInt(this.selectedDate.split('-')[2]) : null;
  }
}
