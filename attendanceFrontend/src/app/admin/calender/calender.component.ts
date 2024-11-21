import { Component, OnInit } from '@angular/core';
import { CalenderService } from 'src/app/shared/calender/calender.service';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
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
  employeeList: { _id: string, name: string, employeeId: number }[] = []; 

  constructor(private calenderService: CalenderService ,private employeeService:EmployeeService) {
    this.generateCalendar();
  }
  ngOnInit(): void {
    // Fetch employees dynamically on component load
    this.employeeService.viewEmployeeapi().subscribe({
      next: (response) => {
        if (response.success) {
          this.employeeList = response.data;  // Ensure you access the `data` property
          console.log("employee", this.employeeList); // Log to verify structure
        } else {
          console.error('Failed to load employees');
        }
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        alert('Failed to load employee list. Please try again later.');
      }
    });
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
      const date = new Date(this.currentYear, this.currentMonth, day);

      // Prevent selection of past dates
      const today = new Date();
      if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        this.selectedDate = date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
      }
    }
  }

  isPastDate(day: number): boolean {
    if (day === 0) return true;

    const date = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date();

    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  addEvent() {
    

    const eventData = {
      date: this.selectedDate,
      eventTitle: this.newEvent.trim(),
      startTime: this.newStartTime,
      endTime: this.newEndTime,
      employeeIds: [this.selectedEmployee], // Assuming you pass IDs; adapt as needed
    };

    this.calenderService.addCalenderApi(eventData).subscribe({
      next: (response) => {
       
        if (!this.events[this.selectedDate!]) {
          this.events[this.selectedDate!] = [];
        }
        this.events[this.selectedDate!].push({
          event: this.newEvent.trim(),
          startTime: this.newStartTime,
          endTime: this.newEndTime,
          employee: this.selectedEmployee,
        });

        this.newEvent = '';
        this.newStartTime = '';
        this.newEndTime = '';
        this.selectedEmployee = '';
      },
      error: (err) => {
        console.error('Error adding event:', err);
        alert('Failed to add event. Please try again.');
      }
    });
  }

  getSelectedDay(): number | null {
    return this.selectedDate ? parseInt(this.selectedDate.split('-')[2]) : null;
  }
}
