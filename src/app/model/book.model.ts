// book.model.ts

export interface Book {
    _id?: string;
    name: string;
    genre: string;
    status: string;
    notes?: string;
    rating?: string;
    startDate?: string;
    endDate?: string;
}
