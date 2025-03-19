import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../model/book.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ViewBooksService {
    private apiUrl = `${environment.bffURL}/api/view-books`; //http://localhost:3000/api/view-books';http://myreadinglistbff.meltwater.io

    constructor(private http: HttpClient) {}

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }
}
