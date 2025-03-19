
import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.model';
import { ViewBooksService } from './view-books.service';

@Component({
    selector: 'app-view-books',
    templateUrl: './view-books.component.html',
    styleUrls: ['./view-books.component.scss'],
})
export class ViewBooksComponent implements OnInit {
    books: Book[] = [];
    filteredBooks: Book[] = [];
    paginatedBooks: Book[] = [];
    selectedStatus: string = 'all';
    selectedGenre: string = 'all';
    totalBooks: number = 0;

    currentPage: number = 1;
    itemsPerPage: number = 10; // Change to 10 books per page
    totalPages: number = 0;

    constructor(private viewBooksService: ViewBooksService) {}

    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks() {
        this.viewBooksService.getBooks().subscribe(
            (books) => {
                this.books = books;
                this.filterBooks(); // Filter books after loading
            },
            (error) => {
                console.error('Error fetching books:', error);
            }
        );
    }

    filterBooks(): void {
        this.filteredBooks = this.books.filter((book) => {
            const statusCondition =
                this.selectedStatus === 'all' ||
                book.status.toLowerCase() === this.selectedStatus.toLowerCase();

            const genreCondition =
                this.selectedGenre === 'all' ||
                book.genre.toLowerCase() === this.selectedGenre.toLowerCase();

            return statusCondition && genreCondition;
        });
        this.totalPages = Math.ceil(
            this.filteredBooks.length / this.itemsPerPage
        );
        this.currentPage = 1; // Reset to first page after filtering
        this.paginateBooks();
    }

    paginateBooks(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginateBooks();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginateBooks();
        }
    }
}
