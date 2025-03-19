import { Component } from '@angular/core';
import { BookService } from './book-search.service';

@Component({
    selector: 'app-book-search',
    templateUrl: './book-search.component.html',
    styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent {
    books: any[] = [];
    query: string = '';

    constructor(private bookApiService: BookService) {}

    searchBooks(): void {
        if (this.query.trim() === '') {
            return;
        }
        this.bookApiService.getBooks(this.query).subscribe(
            (data: any) => {
                this.books = data.docs.slice(0, 20).map((book: any) => ({
                    ...book,
                    coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
                }));
            },
            (error: any) => {
                console.error('Error:', error);
            }
        );
    }
}
