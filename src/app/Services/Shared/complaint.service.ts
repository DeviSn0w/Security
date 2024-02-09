import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  constructor(private http: HttpClient) {}

  getComplaintsByEmail(email: string): Observable<any> {
    return this.http.get(`http://localhost:3000/complaints/by-email/${email}`);
  }

  getComplaintDetailsById(id: number): Observable<any> {
    return this.http.get(`http://localhost:3000/complaints/${id}`);
  }

  getComplaints(): Observable<any> {
    return this.http.get(`http://localhost:3000/complaints/getComplaints`);
  }

  addComplaint(complaint: any): Observable<any> {
    return this.http.post(`http://localhost:3000/complaints`, complaint);
  }

  
}
