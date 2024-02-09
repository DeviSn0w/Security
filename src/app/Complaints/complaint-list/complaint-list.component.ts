import { UserService } from 'src/app/Services/Shared/user.service';
import { jwtDecode } from 'jwt-decode';
import { ComplaintService } from './../../Services/Shared/complaint.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.css']
})
export class ComplaintListComponent implements OnInit {
  complaints: any[] = [];
  firstName!: string | null;
  lastName!: string | null;
  selectedComplaint: any;
  newComplaint: any = {
    subject: '',
    description: '',
    category: '',
    priority_level: 'low',
    user_email: ''
  };
  constructor(private complaintService: ComplaintService, private userService: UserService) { }

  ngOnInit(): void {
    // Get token from local storage
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.firstName = decodedToken.first_name;
      this.lastName = decodedToken.last_name;
      // Decode JWT token to extract user email
      try {
        const userEmail = decodedToken.email;
        // Determine user role
        if (this.isEmployee()) {
          // Fetch complaints based on user email for Employee
          this.complaintService.getComplaintsByEmail(userEmail).subscribe(
            (response: any) => {
              if (response) {
                this.complaints = response;
              } else {
                console.error('No complaints found in response:', response);
              }
            },
            (error: any) => {
              console.error('Error fetching complaints:', error);
            }
          );
        } else {
          // Fetch all complaints for Administrator
          this.complaintService.getComplaints().subscribe(
            (response: any) => {
              if (response) {
                this.complaints = response;
              } else {
                console.error('No complaints found in response:', response);
              }
            },
            (error: any) => {
              console.error('Error fetching complaints:', error);
            }
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  showComplaintDetails(complaint: any): void {
    if (this.isEmployee()) {
      this.selectedComplaint = complaint;
    } else {
      // For administrator, fetch complaint details by ID
      this.complaintService.getComplaintDetailsById(complaint.complaint_id).subscribe(
        (response: any) => {
          if (response) {
            this.selectedComplaint = response;
          } else {
            console.error('No complaint details found in response:', response);
          }
        },
        (error: any) => {
          console.error('Error fetching complaint details:', error);
        }
      );
    }
  }

  submitComplaint(): void {
    // Set user_email in new complaint object from user's email in token
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.newComplaint.user_email = decodedToken.email;
    } else {
      console.error('JWT token not found in local storage');
      return;
    }

    // Call the complaint service to post the new complaint
    this.complaintService.addComplaint(this.newComplaint).subscribe(
      (response: any) => {
        console.log('Complaint added successfully:', response);
        // Clear the modal inputs after successful submission
        this.newComplaint = {
          subject: '',
          description: '',
          category: '',
          priority_level: 'low',
          user_email: this.newComplaint.user_email // Retain user email
        };
        this.refreshComplaints();
      },
      (error: any) => {
        console.error('Error adding complaint:', error);
      }
    );
  }

  refreshComplaints(): void {
    this.ngOnInit();
  }

  isEmployee(): boolean {
    const userRole = this.userService.getUserRole();
    return userRole === 'Employee';
  }

  getPriorityBadgeClass(priorityLevel: string): string {
    switch (priorityLevel) {
      case 'low':
        return 'success-lighten';
      case 'medium':
        return 'warning-lighten';
      case 'high':
        return 'danger-lighten';
      default:
        return ''; // Return empty string if priority level is not recognized
    }
  }
  
}
