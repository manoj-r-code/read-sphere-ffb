
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../model/book.model';
import { AddBookService } from './add-book.service';
import { ViewBooksService } from '../view-books/view-books.service';

@Component({
    selector: 'app-add-book',
    templateUrl: './add-book.component.html',
    styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
    book: Book = {
        name: '',
        genre: '',
        status: '',
        notes: '',
        rating: '',
        startDate: '',
        endDate: '',
    };
    errorMessage: string | null = null;
    existingBooks: Book[] = [];
    formSubmitted: boolean = false;

    constructor(
        private addBookService: AddBookService,
        private viewBooksService: ViewBooksService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Fetch existing books when component initializes
        this.viewBooksService.getBooks().subscribe(
            (books) => {
                this.existingBooks = books;
            },
            (error) => {
                console.error('Error fetching books:', error);
            }
        );
    }

    checkExistingBook(): void {
        const bookExists = this.existingBooks.some(
            (existingBook) =>
                existingBook.name.toLowerCase() === this.book.name.toLowerCase()
        );

        if (bookExists) {
            this.errorMessage = 'Book with this name already exists.';
        } else {
            this.errorMessage = null;
        }
    }

    transformToCamelCase(text: string): string {
        return text
            .split(' ')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    }

    onSubmit(): void {
        this.formSubmitted = true;

        if (!this.book.name || !this.book.genre || !this.book.status) {
            this.errorMessage =
                'Please fill in all mandatory fields (Name, Genre, Status).';
            return;
        }

        if (/^\d+$/.test(this.book.name)) {
            this.errorMessage = 'Name cannot contain only numbers.';
            return;
        }

        if (/^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/.test(this.book.name)) {
            this.errorMessage = 'Name cannot contain only emojis.';
            return;
        }

        if (/^[\d\s\W]+$/.test(this.book.name)) {
            this.errorMessage =
                'Name cannot contain only special characters or numbers.';
            return;
        }

        if (this.book.notes && this.book.notes.length > 50) {
            this.errorMessage = 'Notes cannot exceed 50 characters.';
            return;
        }

        if (this.errorMessage) {
            // If there's any existing error message, prevent form submission
            return;
        }

        // Transform the book name to CamelCase before submission
        this.book.name = this.transformToCamelCase(this.book.name);

        // Check if the book already exists
        const bookExists = this.existingBooks.some(
            (existingBook) =>
                existingBook.name.toLowerCase() === this.book.name.toLowerCase()
        );

        if (bookExists) {
            this.errorMessage = 'Book with this name already exists.';
            return;
        }

        this.errorMessage = null;
        if (confirm('Are you sure you want to add the book?')) {
            this.addBookService.addBook(this.book).subscribe(
                () => {
                    console.log('Book added successfully');
                    this.book = {
                        name: '',
                        genre: '',
                        status: '',
                        notes: '',
                        rating: '',
                        startDate: '',
                        endDate: '',
                    };
                    this.formSubmitted = false;
                    this.router.navigate(['/view-books']);
                },
                (error) => {
                    console.error('Error adding book:', error);
                }
            );
        }
    }

    clearErrorMessage(): void {
        this.errorMessage = null;
    }
}
