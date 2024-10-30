import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-view-imp-work',
  templateUrl: './view-imp-work.component.html',
  styleUrls: ['./view-imp-work.component.css']
})
export class ViewImpWorkComponent implements OnInit {
  uploadedContent: any[] = [];
  files: File[] = [];
  ngOnInit() {
    this.fetchUploadedContent() 
  }
  constructor(private contentService:ProjectService ){}
  fetchUploadedContent() {
    this.contentService.getAllContent().subscribe(
      (data) => {
        this.uploadedContent = data.data; // Assign the content to the component's state
        console.log(data.data)
      },
      (error) => {
        console.error('Error fetching content', error);
      }
    );
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
