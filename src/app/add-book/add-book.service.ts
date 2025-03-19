
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../model/book.model';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class AddBookService {
    private apiUrl = `${environment.bffURL}/api/add-book`;
    private checkUrl = `${environment.bffURL}/api/view-books`; // Assuming there's an endpoint for checking book existence

    constructor(private http: HttpClient) {}

    addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    checkBookExists(name: string): Observable<boolean> {
        return this.http
            .get<Book[]>(`${this.checkUrl}?name=${name}`)
            .pipe(map((books) => books.length > 0));
    }
}
