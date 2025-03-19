import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AddBookComponent } from './add-book/add-book.component';
import { ViewBooksComponent } from './view-books/view-books.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { DeleteBookComponent } from './delete-book/delete-book.component';
import { MychartComponent } from './mychart/mychart.component';
import { BookSearchComponent } from './book-search/book-search.component';

const routes: Routes = [

  { path: 'home-page', component: HomePageComponent },
  { path: 'add-book', component: AddBookComponent }, //
  { path: 'view-books', component: ViewBooksComponent }, //
  { path: 'edit-book/:id', component: EditBookComponent }, //
  { path: 'delete-book/:id', component: DeleteBookComponent }, //
  { path: 'stats', component: MychartComponent }, //
  { path: 'book-search', component: BookSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
