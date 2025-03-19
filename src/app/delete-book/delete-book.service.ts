import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from '../model/book.model';

@Injectable({
    providedIn: 'root',
})
export class DeleteBookService {
    private apiUrl = environment.bffURL;

    constructor(private http: HttpClient) {}

    deleteBook(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete-book/${id}`);
    }
    getBookById(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/api/view-book/${id}`);
    }
}
