
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../model/book.model';
import { environment } from '../../../src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EditBookService {
    private apiUrl = environment.bffURL;

    constructor(private http: HttpClient) {}

    getBookById(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/api/view-book/${id}`);
    }

    updateBook(id: string, book: Book): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/api/edit-book/${id}`, book);
    }

    checkBookExists(name: string): Observable<boolean> {
        return this.http
            .get<Book[]>(`${this.apiUrl}/api/view-books?name=${name}`)
            .pipe(map((books) => books.length > 0));
    }
}
