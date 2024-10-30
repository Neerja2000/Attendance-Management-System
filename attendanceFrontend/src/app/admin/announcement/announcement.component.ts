import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/shared/project/project.service';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent {
  announcementForm: FormGroup;
  selectedFile: File | null = null;
  uploadMedia: any;

  constructor(private fb: FormBuilder, private announcementService: ProjectService) {
    // Initialize the form with FormBuilder and add validation
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      media: ['']  // This will be updated when a file is selected
    });
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Submit the form
  onSubmit() {
    if (this.announcementForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in the required fields',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.announcementForm.get('title')?.value);
    formData.append('description', this.announcementForm.get('description')?.value);

    if (this.selectedFile) {
      formData.append('media', this.selectedFile, this.selectedFile.name);
    }

    // Call the service method to send the form data
    this.announcementService.addAnnouncement(formData).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Announcement created successfully',
        });
        console.log('Announcement created successfully', response);
        this.announcementForm.reset();
        this.selectedFile = null;  // Clear the selected file
        this.uploadMedia.nativeElement.value = ''; 
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create announcement',
        });
        console.error('Error creating announcement', error);
      }
    );
  }
}
