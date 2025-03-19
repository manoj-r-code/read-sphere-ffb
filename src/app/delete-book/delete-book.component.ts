import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteBookService } from './delete-book.service';
import { Book } from '../model/book.model';

@Component({
    selector: 'app-delete-book',
    templateUrl: './delete-book.component.html',
    styleUrls: ['./delete-book.component.scss'],
})
export class DeleteBookComponent implements OnInit {
    id: string | null = null;
    book: Book | null = null;

    constructor(
        private route: ActivatedRoute,
        private deleteBookService: DeleteBookService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            this.deleteBookService.getBookById(this.id).subscribe(
                (data) => {
                    this.book = data;
                },
                (error) => {
                    console.error('Error fetching book details:', error);
                }
            );
        }
    }

    ///////

    deleteBook(): void {
        if (this.id) {
            this.deleteBookService.deleteBook(this.id).subscribe(
                () => {
                    console.log('Book deleted successfully');
                    this.router.navigate(['/view-books']);
                },
                (error) => {
                    console.error('Error deleting book:', error);
                }
            );
        } else {
            console.error('No book ID found.');
        }
    }
}
