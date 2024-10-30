import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project/project.service';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-view-announcement',
  templateUrl: './view-announcement.component.html',
  styleUrls: ['./view-announcement.component.css']
})
export class ViewAnnouncementComponent implements OnInit {
  announcements: any[] = []; // Array to hold announcements

  constructor(
    private announcementService: ProjectService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.announcementService.viewAnnouncement().subscribe(
      (res: any) => {
        if (res && res.announcements) {
          this.announcements = res.announcements.map((announcement: any) => ({
            ...announcement,
            liked: announcement.likedBy.includes(this.authService.getId()), // Check if the user has liked
            showAllComments: false, // Initialize property for showing all comments
            showCommentInput: false // Ensure comment input visibility is handled
          }));
          console.log(this.announcements); 
        } else {
          console.error('No announcements found');
        }
      },
      (error) => {
        console.error('Error loading announcements', error);
      }
    );
  }
  
  
  isImage(mediaUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
  }

  toggleLike(viewAnnouncement: any) {
    const userId = this.authService.getId(); // Ensure this retrieves the correct user ID
    console.log("Retrieved User ID:", userId);

    if (!userId) {
      console.error("User ID is missing.");
      return;
    }
  
    this.announcementService.likeapi(viewAnnouncement._id, userId).subscribe(
      (res: any) => {
        viewAnnouncement.liked = !viewAnnouncement.liked;
        viewAnnouncement.likes = viewAnnouncement.liked ? viewAnnouncement.likes + 1 : Math.max(0, viewAnnouncement.likes - 1);
      },
      (error) => {
        console.error("Error toggling like:", error);
      }
    );
  }
  


  toggleCommentInput(announcement: any) {
    announcement.showCommentInput = !announcement.showCommentInput;
  }

  addComment(announcementId: string, text: string) {
    if (!text) {
      alert('Please enter a comment.');
      return;
    }
  
    const userId = this.authService.getId() || ''; // Get the logged-in user ID
    const commentData = { user: userId, text };
  
    this.announcementService.addComment(announcementId, commentData).subscribe(
      (response: any) => {
        const announcement = this.announcements.find(a => a._id === announcementId);
        if (announcement && response.announcement) {
          const addedComment = response.announcement.comments.slice(-1)[0]; // Fetch the last added comment
          announcement.comments.push({
            user: addedComment.user,
            name: addedComment.name, // Ensure the name is correctly stored here
            text: addedComment.text,
            createdAt: addedComment.createdAt,
            userModel: addedComment.userModel // Include the user model type if needed
          });
          announcement.newCommentText = ''; // Clear the input after submission
          announcement.showCommentInput = false; // Hide input after submission
        }
      },
      error => {
        console.error('Error adding comment:', error);
      }
    );
  }
  
}
