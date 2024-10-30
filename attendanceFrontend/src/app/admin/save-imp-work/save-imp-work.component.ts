import { Component } from '@angular/core';

import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-save-imp-work',
  templateUrl: './save-imp-work.component.html',
  styleUrls: ['./save-imp-work.component.css']
})
export class SaveImpWorkComponent {
  title: string = '';
  description: string = '';
  link:string='';
  files: File[] = [];
  uploadedContent: any[] = []; // For storing and displaying uploaded content

  constructor(private contentService: ProjectService) {}

  // File selection handler
  onFileSelected(event: any) {
    this.files = Array.from(event.target.files);
  }

  // Submit form and upload content
  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('link',this.link)

    this.files.forEach(file => {
      formData.append('files', file);
    });

    // Call the service to upload content
    this.contentService.uploadContent(formData).subscribe(
      (response) => {
        console.log('Content Uploaded Successfully', response);
        this.fetchUploadedContent(); // Fetch and display the content after upload
      },
      (error) => {
        console.error('Error Uploading Content', error);
      }
    );
  }

  // Fetch and display all uploaded content
  fetchUploadedContent() {
    this.contentService.getAllContent().subscribe(
      (data) => {
        this.uploadedContent = data.data; // Assign the content to the component's state
      },
      (error) => {
        console.error('Error fetching content', error);
      }
    );
  }

  // Call the method to fetch content when the component initializes
  ngOnInit() {
    this.fetchUploadedContent();
  }

  getFileType(file: string): string {
    const extension = file.split('.').pop() || '';  // Provide a default empty string if undefined

    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension.toLowerCase())) {
      return 'image';
    } else if (['pdf'].includes(extension.toLowerCase())) {
      return 'pdf';
    } else {
      return 'unknown';
    }
  }
  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Unknown file';
  }
}
