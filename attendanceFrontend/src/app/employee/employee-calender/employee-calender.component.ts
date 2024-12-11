import { Component, OnInit } from '@angular/core';
import { CalenderService } from 'src/app/shared/calender/calender.service';

@Component({
  selector: 'app-employee-calender',
  templateUrl: './employee-calender.component.html',
  styleUrls: ['./employee-calender.component.css']
})
export class EmployeeCalenderComponent {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  events: any[] = [];
  filteredEvents: any[] = [];

  selectedDate: string = new Date().toISOString().split('T')[0];

  weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  daysInMonth: { day: number; hasEvent: boolean }[] = [];

  calendarData: any[] = [];

  constructor(private calenderService: CalenderService) {
    this.generateCalendar();
  }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.getAllCalendarData(today);
  }

  getAllCalendarData(date: string = new Date().toISOString().split('T')[0]) {
    this.calenderService.getCalenderApi(date).subscribe(
      (data: any) => {
        this.events = data.events; // Assign the API response to events array
        this.filterEventsBySelectedDate();
        this.highlightEventDates(); // Function to highlight event dates in calendar (if required)
      },
      (error) => {
        console.error('Error fetching calendar data:', error);
      }
    );
  }

  // Filter events by selected date
  filterEventsBySelectedDate(): void {
    this.filteredEvents = this.events.filter(event => event.date === this.selectedDate);
  }

  highlightEventDates() {
    this.daysInMonth.forEach(dayObj => {
      const hasEvent = this.calendarData.some(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === this.currentYear &&
          eventDate.getMonth() === this.currentMonth &&
          eventDate.getDate() === dayObj.day
        );
      });
      dayObj.hasEvent = hasEvent;
    });
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1, // Day of the month starts at 1
      hasEvent: false, // Default to no events
    }));
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.highlightEventDates();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.highlightEventDates();
  }

  selectDate(dayIndex: number) {
    const dayObj = this.daysInMonth[dayIndex];
    if (dayObj && dayObj.day) { // Ensure the day exists
      // Create the selected date (set to UTC to avoid timezone issues)
      const selectedDate = new Date(Date.UTC(this.currentYear, this.currentMonth, dayObj.day));

      // Format the date to ISO 8601 string (YYYY-MM-DD)
      this.selectedDate = selectedDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format

      // Reset filtered events before fetching new data
      this.filteredEvents = [];
      
      // Fetch events for the selected date
      this.getAllCalendarData(this.selectedDate);
    }
  }

  isPastDate(day: number): boolean {
    if (day === 0) return true;
    const date = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date();
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  getSelectedDay(): number | null {
    return this.selectedDate ? parseInt(this.selectedDate.split('-')[2]) : null;
  }
}
