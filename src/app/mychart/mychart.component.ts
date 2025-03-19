import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BookService } from './mychart.service';
import { Book } from '../model/book.model';

Chart.register(...registerables);

@Component({
    selector: 'app-mychart',
    templateUrl: './mychart.component.html',
    styleUrls: ['./mychart.component.scss'],
})
export class MychartComponent implements OnInit {
    totalBooks: number = 0;
    genreCounts: { [key: string]: number } = {};
    genreKeys: string[] = [];

    //////////
    statusCounts: { [key: string]: number } = {};
    statusKeys: string[] = [];

    /////////

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.bookService.getBooks().subscribe(
            (books: Book[]) => {
                this.calculateTotalBooks(books);
                this.calculateStatusCounts(books);
                this.calculateGenreCounts(books);
                this.renderGenreChart();
                this.renderStatusChart();
            },
            (error) => {
                console.error('Error fetching books:', error);
            }
        );
    }

    calculateTotalBooks(books: Book[]): void {
        this.totalBooks = books.length;
    }

    calculateGenreCounts(books: Book[]): void {
        this.genreCounts = {};
        books.forEach((book: Book) => {
            this.genreCounts[book.genre] =
                (this.genreCounts[book.genre] || 0) + 1;
        });
        this.genreKeys = Object.keys(this.genreCounts);
    }
    //////////
    calculateStatusCounts(books: Book[]): void {
        this.statusCounts = {};
        books.forEach((book: Book) => {
            this.statusCounts[book.status] =
                (this.statusCounts[book.status] || 0) + 1;
        });
        this.statusKeys = Object.keys(this.statusCounts);
    }

    ////////

    renderGenreChart(): void {
        const genreLabels = this.genreKeys;
        const genreData = genreLabels.map((genre) => this.genreCounts[genre]);

        const genreCanvas = document.getElementById(
            'piechart'
        ) as HTMLCanvasElement;
        new Chart(genreCanvas, {
            type: 'pie',
            data: {
                labels: genreLabels,
                datasets: [
                    {
                        label: '',
                        data: genreData,
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                            '#03c03c',
                            'cyan',
                            'brown',
                            'red',
                            'blue',
                        ],
                    },
                ],
            },
        });
    }
    /////

    renderStatusChart(): void {
        const statusLabels = this.statusKeys;
        const statusData = statusLabels.map(
            (status) => this.statusCounts[status]
        );

        const statusCanvas = document.getElementById(
            'piechart1'
        ) as HTMLCanvasElement;
        new Chart(statusCanvas, {
            type: 'pie',
            data: {
                labels: statusLabels,
                datasets: [
                    {
                        label: '',
                        data: statusData,
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                            '#03c03c',
                        ],
                    },
                ],
            },
        });
    }
}
