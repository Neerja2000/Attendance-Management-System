import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EmployeeService } from 'src/app/shared/employee/employee.service';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  employees: any[] = [];
  selectedFiles: File[] = [];
  selectedEmployeeIds: string[] = []; // Track selected employee IDs
  addProject = new FormGroup({
    projectName: new FormControl(''),
    projectDescription: new FormControl(''),
    employees: new FormControl<string[]>([]), // Explicitly type as an array of strings
    files: new FormControl<File[]>([]) // Initialize as an array of File objects
  });

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService // Ensure this service exists for posting data
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.viewEmployeeapi().subscribe(
      (res: any) => {
        this.employees = res.data;
        console.log("Employees:", this.employees);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  onEmployeeChange(event: any) {
    const selectedEmployeeId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedEmployeeIds.push(selectedEmployeeId);
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(id => id !== selectedEmployeeId);
    }

    this.addProject.patchValue({ 'employees': this.selectedEmployeeIds });
  }

  uploadFiles(event: any) {
    const files = event.target.files;
    this.selectedFiles = Array.from(files); // Convert FileList to array
    this.addProject.patchValue({ 'files': this.selectedFiles });
  }

  projectapi() {
    const formData = new FormData();
    formData.append('projectName', this.addProject.value.projectName || '');
    formData.append('projectDescription', this.addProject.value.projectDescription || '');

    // Append employee IDs
    if (this.addProject.value.employees) {
      this.addProject.value.employees.forEach((empId: string) => {
        formData.append('employeeIds[]', empId);
      });
    }

    // Append files
    if (this.addProject.value.files) {
      this.addProject.value.files.forEach((file: File) => {
        formData.append('files[]', file, file.name);
      });
    }

    this.projectService.addProjectApi(formData).subscribe(
      (res: any) => {
        console.log('Project added successfully', res);
        // Handle success
      },
      (error: any) => {
        console.error('Error:', error);
        // Handle error
      }
    );
  }
}
