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

  newEvent = '';
  newStartTime = '';
  newEndTime = '';
  selectedEmployee = '';
  employeeList: { _id: string, name: string, employeeId: number }[] = [];
  selectedEmployees: { [key: string]: boolean } = {}; 

  events: { [key: string]: any[] } = {};
  calendarEvents: any[] = [];
  eventDates: string[] = [];

  constructor(private calenderService: CalenderService ,private employeeService: EmployeeService) {
    this.generateCalendar();
  }

  ngOnInit(): void {
    this.employeeService.viewEmployeeapi().subscribe({
      next: (response) => {
        if (response.success) {
          this.employeeList = response.data; 
          console.log("employee", this.employeeList); 
        } else {
          console.error('Failed to load employees');
        }
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        alert('Failed to load employee list. Please try again later.');
      }
    });
   
    this.getAllEvents()
  }
  getAllEvents(): void {
    this.calenderService.getAllCalender().subscribe(
      (res: any) => {
        if (res.success) {
          this.calendarEvents = res.data;  // Store the events in the array
          this.eventDates = this.calendarEvents.map(event => event.date); // Extract event dates
          console.log('Calendar events:', this.calendarEvents);
        } else {
          console.error('Failed to load calendar events');
        }
      },
      (err) => {
        console.error('Error fetching events:', err);
        alert('Failed to load calendar events. Please try again later.');
      }
    );
  }

  getFormattedDate(day: number): string {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return date.toLocaleDateString('en-CA'); // This returns the date in the format 'yyyy-mm-dd'
  }


  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth, 1).toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  
    this.daysInMonth = Array(Math.max(0, firstDay - 1))
      .fill(0)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  
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
      const today = new Date();
      if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        this.selectedDate = date.toLocaleDateString('en-CA');
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
    
  
    // Construct event data for the API call
    const eventData = {
      date: this.selectedDate,
      eventTitle: this.newEvent.trim(),
      startTime: this.newStartTime,
      endTime: this.newEndTime,
      employeeIds: Object.keys(this.selectedEmployees).filter(
        (key) => this.selectedEmployees[key] // Collect selected employee IDs
      ),
      status: 'pending', // Assuming the initial status is 'pending'
    };
  
    // Make the API call to add the event
    this.calenderService.addCalenderApi(eventData).subscribe({
      next: (response) => {
        // No need to check for 'success' if it's not part of the response
        // Ensure that the events object is ready for the selected date
        if (!this.events[this.selectedDate!]) {
          this.events[this.selectedDate!] = [];
        }
  
        // Add the new event to the events array for the selected date
        this.events[this.selectedDate!].push({
          event: this.newEvent.trim(),
          startTime: this.newStartTime,
          endTime: this.newEndTime,
          employees: Object.keys(this.selectedEmployees).filter(
            (key) => this.selectedEmployees[key] // Collect selected employee names
          ),
          status: 'pending', // Assuming initial status is 'pending'
        });
  
        // Reset the input fields
        this.newEvent = '';
        this.newStartTime = '';
        this.newEndTime = '';
        this.selectedEmployee = '';
        this.selectedEmployees = {}; // Clear selected employees
  
        console.log('Event added:', eventData);
      },
      error: (err) => {
        console.error('Error adding event:', err);
        alert('An error occurred while adding the event. Please try again later.');
      }
    });
  }
  
  

  getSelectedDay(): number | null {
    return this.selectedDate ? parseInt(this.selectedDate.split('-')[2]) : null;
  }
}