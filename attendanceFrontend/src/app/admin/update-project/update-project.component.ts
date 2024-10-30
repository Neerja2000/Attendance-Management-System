import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee/employee.service';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit {
  updateProject: FormGroup;
  employees: any[] = []; // This will hold the employee list
  selectedEmployeeIds: string[] = []; // To keep track of selected employee IDs
  selectedFiles: File[] = [];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,private router:Router
  ) {
    this.updateProject = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required),
      projectBudget: new FormControl('', [Validators.required, Validators.min(0)]), // Add projectBudget field with validation
      employees: new FormArray([]),
      files: new FormControl<File[]>([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getSingleDetails(id); // Fetch project details by ID
    }
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.viewEmployeeapi().subscribe(
      (res: any) => {
        this.employees = res.data;
        console.log('Employees:', this.employees);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getSingleDetails(id: string) {
    this.projectService.getSingleProjectApi(id).subscribe(
      (res: any) => {
        console.log('Response from API:', res); // Debug log
        if (res && res.data) {
          const result = res.data;

          // Set form values
          this.updateProject.patchValue({
            projectName: result.projectName || '',
            projectDescription: result.projectDescription || '',
            projectBudget: result.projectBudget || '',
            files: result.files || []
          });

          // Set selected employees
          this.selectedEmployeeIds = result.employeeIds || [];

          // Ensure that employeeNames is an array
          this.employees = Array.isArray(result.employeeNames)
            ? result.employeeNames
            : [result.employeeNames]; // Wrap in an array if it's not already one
        } else {
          console.error('Invalid response data:', res);
        }
      },
      (error: any) => {
        console.error('Error fetching project details:', error);
      }
    );
  }


  onEmployeeChange(event: any) {
    const selectedEmployeeId = event.target.value;
    const isChecked = event.target.checked;

    const employeesArray = this.updateProject.get('employees') as FormArray;

    if (isChecked) {
      if (selectedEmployeeId.match(/^[0-9a-fA-F]{24}$/)) {
        employeesArray.push(new FormControl(selectedEmployeeId));
      } else {
        console.error('Invalid ObjectId:', selectedEmployeeId);
      }
    } else {
      const index = employeesArray.controls.findIndex(
        (control) => control.value === selectedEmployeeId
      );
      if (index > -1) {
        employeesArray.removeAt(index);
      }
    }
  }

  uploadFiles(event: any) {
    const files = event.target.files;
    this.selectedFiles = Array.from(files); // Convert FileList to array
    this.updateProject.patchValue({ files: this.selectedFiles });
  }

  projectApi() {
    if (this.updateProject.invalid) {
        console.error('Form is invalid', this.updateProject.errors);
        return; 
    }

    const formData = new FormData();
    formData.append('projectName', this.updateProject.get('projectName')?.value);
    formData.append('projectDescription', this.updateProject.get('projectDescription')?.value);

    const projectBudget = this.updateProject.get('projectBudget')?.value;
    if (!projectBudget || isNaN(projectBudget)) {
        console.error('Invalid project budget:', projectBudget);
        return; 
    }
    formData.append('projectBudget', String(projectBudget)); 

    const employeesArray = this.updateProject.get('employees') as FormArray;
    const employeeIds = employeesArray.controls.map(control => control.value);
    formData.append('employeeIds', JSON.stringify(employeeIds)); // Convert to JSON string if needed

    this.selectedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file, file.name);
    });

    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
        this.projectService.updateProjectApi(projectId, formData).subscribe(
            (response: any) => {
              this.router.navigateByUrl('/admin/layout/view-project')
                console.log('Project updated successfully:', response);
            },
            (error: any) => {
                console.error('Error updating project:', error);
            }
        );
    }
}

}
