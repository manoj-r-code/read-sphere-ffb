// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm } from '@angular/forms'; // Import NgForm
// import { Book } from '../model/book.model';
// import { EditBookService } from './edit-book.service';

// @Component({
//     selector: 'app-edit-book',
//     templateUrl: './edit-book.component.html',
//     styleUrls: ['./edit-book.component.scss'],
// })
// export class EditBookComponent implements OnInit {
//     book: Book = {
//         name: '',
//         genre: '',
//         status: '',
//         notes: '',
//         rating: '',
//         startDate: '',
//         endDate: '',
//     };

//     constructor(
//         private route: ActivatedRoute,
//         private editBookService: EditBookService,
//         private router: Router
//     ) {}

//     ngOnInit(): void {
//         // Retrieve book details from route parameters
//         const id = this.route.snapshot.paramMap.get('id');
//         if (id !== null) {
//             this.loadBook(id);
//         }
//     }

//     loadBook(id: string): void {
//         this.editBookService.getBookById(id).subscribe(
//             (book) => {
//                 this.book = book;
//             },
//             (error) => {
//                 console.error('Error fetching book:', error);
//             }
//         );
//     }

//     onSubmit(form: NgForm): void {
//         if (form.invalid) {
//             alert('Please fill in all mandatory fields (Name, Genre, Status).');
//             return;
//         }
//         if (form.valid) {
//             alert('form submitted successfully');
//         }

//         const id = this.route.snapshot.paramMap.get('id');
//         if (id !== null) {
//             this.editBookService.updateBook(id, this.book).subscribe(
//                 () => {
//                     console.log('Book updated successfully');
//                     this.router.navigate(['/view-books']);
//                 },
//                 (error) => {
//                     console.error('Error updating book:', error);
//                 }
//             );
//         }
//     }
// }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm } from '@angular/forms';
// import { Book } from '../model/book.model';
// import { EditBookService } from './edit-book.service';
// import { ViewBooksService } from '../view-books/view-books.service';

// @Component({
//     selector: 'app-edit-book',
//     templateUrl: './edit-book.component.html',
//     styleUrls: ['./edit-book.component.scss'],
// })
// export class EditBookComponent implements OnInit {
//     book: Book = {
//         name: '',
//         genre: '',
//         status: '',
//         notes: '',
//         rating: '',
//         startDate: '',
//         endDate: '',
//     };
//     errorMessage: string | null = null;
//     existingBooks: Book[] = [];
//     formSubmitted: boolean = false;
//     currentBookId: string | null = null;

//     constructor(
//         private route: ActivatedRoute,
//         private editBookService: EditBookService,
//         private viewBooksService: ViewBooksService,
//         private router: Router
//     ) {}

//     ngOnInit(): void {
//         const id = this.route.snapshot.paramMap.get('id');
//         if (id !== null) {
//             this.currentBookId = id;
//             this.loadBook(id);
//         }

//         this.viewBooksService.getBooks().subscribe(
//             (books) => {
//                 this.existingBooks = books;
//             },
//             (error) => {
//                 console.error('Error fetching books:', error);
//             }
//         );
//     }

//     loadBook(id: string): void {
//         this.editBookService.getBookById(id).subscribe(
//             (book) => {
//                 this.book = book;
//             },
//             (error) => {
//                 console.error('Error fetching book:', error);
//             }
//         );
//     }

//     checkExistingBook(): void {
//         if (!this.book.name) {
//             this.errorMessage = null;
//             return;
//         }

//         this.editBookService.checkBookExists(this.book.name).subscribe(
//             (exists) => {
//                 if (exists) {
//                     const bookExists = this.existingBooks.some(
//                         (existingBook) =>
//                             existingBook.name.toLowerCase() ===
//                                 this.book.name.toLowerCase() &&
//                             existingBook._id !== this.currentBookId
//                     );
//                     if (bookExists) {
//                         this.errorMessage =
//                             'Book with this name already exists.';
//                     } else {
//                         this.errorMessage = null;
//                     }
//                 } else {
//                     this.errorMessage = null;
//                 }
//             },
//             (error) => {
//                 console.error('Error checking book existence:', error);
//             }
//         );
//     }

//     onSubmit(form: NgForm): void {
//         this.formSubmitted = true;

//         if (!this.book.name || !this.book.genre || !this.book.status) {
//             this.errorMessage =
//                 'Please fill in all mandatory fields (Name, Genre, Status).';
//             return;
//         }

//         if (/^\d+$/.test(this.book.name)) {
//             this.errorMessage = 'Name cannot contain only numbers.';
//             return;
//         }

//         if (/^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/.test(this.book.name)) {
//             this.errorMessage = 'Name cannot contain only emojis.';
//             return;
//         }

//         if (this.book.notes && this.book.notes.length > 50) {
//             this.errorMessage = 'Notes cannot exceed 50 characters.';
//             return;
//         }

//         if (this.errorMessage) {
//             return;
//         }

//         this.editBookService.checkBookExists(this.book.name).subscribe(
//             (exists) => {
//                 if (exists) {
//                     const bookExists = this.existingBooks.some(
//                         (existingBook) =>
//                             existingBook.name.toLowerCase() ===
//                                 this.book.name.toLowerCase() &&
//                             existingBook._id !== this.currentBookId
//                     );

//                     if (bookExists) {
//                         this.errorMessage =
//                             'Book with this name already exists.';
//                         return;
//                     }
//                 }

//                 if (confirm('Are you sure you want to update the book?')) {
//                     if (this.currentBookId) {
//                         this.editBookService
//                             .updateBook(this.currentBookId, this.book)
//                             .subscribe(
//                                 () => {
//                                     console.log('Book updated successfully');
//                                     this.router.navigate(['/view-books']);
//                                 },
//                                 (error) => {
//                                     console.error(
//                                         'Error updating book:',
//                                         error
//                                     );
//                                 }
//                             );
//                     }
//                 }
//             },
//             (error) => {
//                 console.error('Error checking book existence:', error);
//             }
//         );
//     }

//     clearErrorMessage(): void {
//         this.errorMessage = null;
//     }
// }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm } from '@angular/forms';
// import { Book } from '../model/book.model';
// import { EditBookService } from './edit-book.service';
// import { ViewBooksService } from '../view-books/view-books.service';

// @Component({
//     selector: 'app-edit-book',
//     templateUrl: './edit-book.component.html',
//     styleUrls: ['./edit-book.component.scss'],
// })
// export class EditBookComponent implements OnInit {
//     book: Book = {
//         name: '',
//         genre: '',
//         status: '',
//         notes: '',
//         rating: '',
//         startDate: '',
//         endDate: '',
//     };
//     errorMessage: string | null = null;
//     existingBooks: Book[] = [];
//     formSubmitted: boolean = false;
//     currentBookId: string | null = null;

//     constructor(
//         private route: ActivatedRoute,
//         private editBookService: EditBookService,
//         private viewBooksService: ViewBooksService,
//         private router: Router
//     ) {}

//     ngOnInit(): void {
//         const id = this.route.snapshot.paramMap.get('id');
//         if (id !== null) {
//             this.currentBookId = id;
//             this.loadBook(id);
//         }

//         this.viewBooksService.getBooks().subscribe(
//             (books) => {
//                 this.existingBooks = books;
//             },
//             (error) => {
//                 console.error('Error fetching books:', error);
//             }
//         );
//     }

//     loadBook(id: string): void {
//         this.editBookService.getBookById(id).subscribe(
//             (book) => {
//                 this.book = book;
//             },
//             (error) => {
//                 console.error('Error fetching book:', error);
//             }
//         );
//     }

//     checkExistingBook(): void {
//         this.validateName(); // Validate the name input for numeric values

//         if (!this.book.name || this.errorMessage) {
//             // Check if name is invalid
//             return;
//         }

//         this.editBookService.checkBookExists(this.book.name).subscribe(
//             (exists) => {
//                 if (exists) {
//                     const bookExists = this.existingBooks.some(
//                         (existingBook) =>
//                             existingBook.name.toLowerCase() ===
//                                 this.book.name.toLowerCase() &&
//                             existingBook._id !== this.currentBookId
//                     );
//                     if (bookExists) {
//                         this.errorMessage =
//                             'Book with this name already exists.';
//                     } else {
//                         this.errorMessage = null;
//                     }
//                 } else {
//                     this.errorMessage = null;
//                 }
//             },
//             (error) => {
//                 console.error('Error checking book existence:', error);
//             }
//         );
//     }

//     validateName(): void {
//         if (/^\d+$/.test(this.book.name)) {
//             this.errorMessage = 'Name cannot contain only numbers.';
//         } else if (/^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/.test(this.book.name)) {
//             this.errorMessage = 'Name cannot contain only emojis.';
//         } else {
//             this.errorMessage = null;
//         }
//     }

//     onSubmit(form: NgForm): void {
//         this.formSubmitted = true;

//         if (!this.book.name || !this.book.genre || !this.book.status) {
//             this.errorMessage =
//                 'Please fill in all mandatory fields (Name, Genre, Status).';
//             return;
//         }

//         if (/^\d+$/.test(this.book.name)) {
//             this.errorMessage = 'Name cannot contain only numbers.';
//             return;
//         }

//         if (/^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/.test(this.book.name)) {
//             this.errorMessage = 'Name cannot contain only emojis.';
//             return;
//         }

//         if (this.book.notes && this.book.notes.length > 50) {
//             this.errorMessage = 'Notes cannot exceed 50 characters.';
//             return;
//         }

//         if (this.errorMessage) {
//             return;
//         }

//         this.editBookService.checkBookExists(this.book.name).subscribe(
//             (exists) => {
//                 if (exists) {
//                     const bookExists = this.existingBooks.some(
//                         (existingBook) =>
//                             existingBook.name.toLowerCase() ===
//                                 this.book.name.toLowerCase() &&
//                             existingBook._id !== this.currentBookId
//                     );

//                     if (bookExists) {
//                         this.errorMessage =
//                             'Book with this name already exists.';
//                         return;
//                     }
//                 }

//                 if (confirm('Are you sure you want to update the book?')) {
//                     if (this.currentBookId) {
//                         this.editBookService
//                             .updateBook(this.currentBookId, this.book)
//                             .subscribe(
//                                 () => {
//                                     console.log('Book updated successfully');
//                                     this.router.navigate(['/view-books']);
//                                 },
//                                 (error) => {
//                                     console.error(
//                                         'Error updating book:',
//                                         error
//                                     );
//                                 }
//                             );
//                     }
//                 }
//             },
//             (error) => {
//                 console.error('Error checking book existence:', error);
//             }
//         );
//     }

//     clearErrorMessage(): void {
//         this.errorMessage = null;
//     }
// }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm } from '@angular/forms';
// import { Book } from '../model/book.model';
// import { EditBookService } from './edit-book.service';
// import { ViewBooksService } from '../view-books/view-books.service';

// @Component({
//     selector: 'app-edit-book',
//     templateUrl: './edit-book.component.html',
//     styleUrls: ['./edit-book.component.scss'],
// })
// export class EditBookComponent implements OnInit {
//     book: Book = {
//         name: '',
//         genre: '',
//         status: '',
//         notes: '',
//         rating: '',
//         startDate: '',
//         endDate: '',
//     };
//     errorMessage: string | null = null;
//     existingBooks: Book[] = [];
//     formSubmitted: boolean = false;
//     currentBookId: string | null = null;

//     constructor(
//         private route: ActivatedRoute,
//         private editBookService: EditBookService,
//         private viewBooksService: ViewBooksService,
//         private router: Router
//     ) {}

//     ngOnInit(): void {
//         const id = this.route.snapshot.paramMap.get('id');
//         if (id !== null) {
//             this.currentBookId = id;
//             this.loadBook(id);
//         }

//         this.viewBooksService.getBooks().subscribe(
//             (books) => {
//                 this.existingBooks = books;
//             },
//             (error) => {
//                 console.error('Error fetching books:', error);
//             }
//         );
//     }

//     loadBook(id: string): void {
//         this.editBookService.getBookById(id).subscribe(
//             (book) => {
//                 this.book = book;
//             },
//             (error) => {
//                 console.error('Error fetching book:', error);
//             }
//         );
//     }

//     checkExistingBook(): void {
//         this.validateName(); // Validate the name input for special character and numeric combinations

//         if (!this.book.name || this.errorMessage) {
//             // Check if name is invalid
//             return;
//         }

//         this.editBookService.checkBookExists(this.book.name).subscribe(
//             (exists) => {
//                 if (exists) {
//                     const bookExists = this.existingBooks.some(
//                         (existingBook) =>
//                             existingBook.name.toLowerCase() ===
//                                 this.book.name.toLowerCase() &&
//                             existingBook._id !== this.currentBookId
//                     );
//                     if (bookExists) {
//                         this.errorMessage =
//                             'Book with this name already exists.';
//                     } else {
//                         this.errorMessage = null;
//                     }
//                 } else {
//                     this.errorMessage = null;
//                 }
//             },
//             (error) => {
//                 console.error('Error checking book existence:', error);
//             }
//         );
//     }

//     validateName(): void {
//         const name = this.book.name.trim();
//         if (/^\d+$/.test(name)) {
//             this.errorMessage = 'Invalid Book name';
//         } else if (/^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/.test(name)) {
//             this.errorMessage = 'Invalid Book name';
//         } else if (/^[!@#$%^&*(),.?":{}|<>]+$/.test(name)) {
//             this.errorMessage = 'Invalid Book name';
//         } else {
//             this.errorMessage = null;
//         }
//     }

//     toCamelCase(str: string): string {
//         return str
//             .toLowerCase()
//             .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
//                 index === 0 ? match.toUpperCase() : match.toUpperCase()
//             );
//     }

//     onSubmit(form: NgForm): void {
//         this.formSubmitted = true;

//         if (!this.book.name || !this.book.genre || !this.book.status) {
//             this.errorMessage =
//                 'Please fill in all mandatory fields (Name, Genre, Status).';
//             return;
//         }

//         this.validateName();
//         if (this.errorMessage) {
//             return;
//         }

//         if (this.book.notes && this.book.notes.length > 50) {
//             this.errorMessage = 'Notes cannot exceed 50 characters.';
//             return;
//         }

//         this.book.name = this.toCamelCase(this.book.name);

//         this.editBookService.checkBookExists(this.book.name).subscribe(
//             (exists) => {
//                 if (exists) {
//                     const bookExists = this.existingBooks.some(
//                         (existingBook) =>
//                             existingBook.name.toLowerCase() ===
//                                 this.book.name.toLowerCase() &&
//                             existingBook._id !== this.currentBookId
//                     );

//                     if (bookExists) {
//                         this.errorMessage =
//                             'Book with this name already exists.';
//                         return;
//                     }
//                 }

//                 if (confirm('Are you sure you want to update the book?')) {
//                     if (this.currentBookId) {
//                         this.editBookService
//                             .updateBook(this.currentBookId, this.book)
//                             .subscribe(
//                                 () => {
//                                     console.log('Book updated successfully');
//                                     this.router.navigate(['/view-books']);
//                                 },
//                                 (error) => {
//                                     console.error(
//                                         'Error updating book:',
//                                         error
//                                     );
//                                 }
//                             );
//                     }
//                 }
//             },
//             (error) => {
//                 console.error('Error checking book existence:', error);
//             }
//         );
//     }

//     clearErrorMessage(): void {
//         this.errorMessage = null;
//     }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Book } from '../model/book.model';
import { EditBookService } from './edit-book.service';
import { ViewBooksService } from '../view-books/view-books.service';

@Component({
    selector: 'app-edit-book',
    templateUrl: './edit-book.component.html',
    styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent implements OnInit {
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
    currentBookId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private editBookService: EditBookService,
        private viewBooksService: ViewBooksService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id !== null) {
            this.currentBookId = id;
            this.loadBook(id);
        }

        this.viewBooksService.getBooks().subscribe(
            (books) => {
                this.existingBooks = books;
            },
            (error) => {
                console.error('Error fetching books:', error);
            }
        );
    }

    loadBook(id: string): void {
        this.editBookService.getBookById(id).subscribe(
            (book) => {
                this.book = book;
            },
            (error) => {
                console.error('Error fetching book:', error);
            }
        );
    }

    checkExistingBook(): void {
        this.validateName();

        if (!this.book.name || this.errorMessage) {
            return;
        }

        this.editBookService.checkBookExists(this.book.name).subscribe(
            (exists) => {
                if (exists) {
                    const bookExists = this.existingBooks.some(
                        (existingBook) =>
                            existingBook.name.toLowerCase() ===
                                this.book.name.toLowerCase() &&
                            existingBook._id !== this.currentBookId
                    );
                    if (bookExists) {
                        this.errorMessage =
                            'Book with this name already exists.';
                    } else {
                        this.errorMessage = null;
                    }
                } else {
                    this.errorMessage = null;
                }
            },
            (error) => {
                console.error('Error checking book existence:', error);
            }
        );
    }

    validateName(): void {
        const name = this.book.name.trim();
        if (/^\d+$/.test(name)) {
            this.errorMessage = 'Invalid Book name';
        } else if (/^[\uD800-\uDBFF][\uDC00-\uDFFF]+$/.test(name)) {
            this.errorMessage = 'Invalid Book name';
        } else if (/^[!@#$%^&*(),.?":{}|<>\s]+$/.test(name)) {
            this.errorMessage = 'Invalid Book name';
        } else {
            this.errorMessage = null;
        }
    }

    toCamelCase(str: string): string {
        return str
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
                index === 0 ? match.toUpperCase() : match.toUpperCase()
            );
    }

    onSubmit(form: NgForm): void {
        this.formSubmitted = true;

        if (!this.book.name || !this.book.genre || !this.book.status) {
            this.errorMessage =
                'Please fill in all mandatory fields (Name, Genre, Status).';
            return;
        }

        this.validateName();
        if (this.errorMessage) {
            return;
        }

        if (this.book.notes && this.book.notes.length > 50) {
            this.errorMessage = 'Notes cannot exceed 50 characters.';
            return;
        }

        this.book.name = this.toCamelCase(this.book.name);

        this.editBookService.checkBookExists(this.book.name).subscribe(
            (exists) => {
                if (exists) {
                    const bookExists = this.existingBooks.some(
                        (existingBook) =>
                            existingBook.name.toLowerCase() ===
                                this.book.name.toLowerCase() &&
                            existingBook._id !== this.currentBookId
                    );

                    if (bookExists) {
                        this.errorMessage =
                            'Book with this name already exists.';
                        return;
                    }
                }

                if (confirm('Are you sure you want to update the book?')) {
                    if (this.currentBookId) {
                        this.editBookService
                            .updateBook(this.currentBookId, this.book)
                            .subscribe(
                                () => {
                                    console.log('Book updated successfully');
                                    this.router.navigate(['/view-books']);
                                },
                                (error) => {
                                    console.error(
                                        'Error updating book:',
                                        error
                                    );
                                }
                            );
                    }
                }
            },
            (error) => {
                console.error('Error checking book existence:', error);
            }
        );
    }

    clearErrorMessage(): void {
        this.errorMessage = null;
    }
}
