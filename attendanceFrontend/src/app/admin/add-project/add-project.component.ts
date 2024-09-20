import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
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

  addProject = new FormGroup({
    projectName: new FormControl('', Validators.required),
    projectDescription: new FormControl('', Validators.required),
    projectBudget: new FormControl('', [Validators.required, Validators.min(0)]),  // Add projectBudget field with validation
    employees: new FormArray([]),
    files: new FormControl<File[]>([])
  });

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private router: Router // Inject Router
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

    const employeesArray = this.addProject.get('employees') as FormArray;

    if (isChecked) {
      if (selectedEmployeeId.match(/^[0-9a-fA-F]{24}$/)) {
        employeesArray.push(new FormControl(selectedEmployeeId));
      } else {
        console.error('Invalid ObjectId:', selectedEmployeeId);
      }
    } else {
      const index = employeesArray.controls.findIndex(control => control.value === selectedEmployeeId);
      if (index > -1) {
        employeesArray.removeAt(index);
      }
    }
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
    formData.append('projectBudget', this.addProject.value.projectBudget || '');  // Add projectBudget to form data

    const employeesArray = this.addProject.get('employees') as FormArray;
    employeesArray.controls.forEach(control => {
      formData.append('employeeIds[]', control.value);
    });

    if (this.addProject.value.files) {
      this.addProject.value.files.forEach((file: File) => {
        formData.append('files', file, file.name);
      });
    }

    this.projectService.addProjectApi(formData).subscribe(
      (res: any) => {
        console.log('Project added successfully', res);
        this.router.navigate(['/admin/layout/view-project']); // Navigate after successful submission
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
