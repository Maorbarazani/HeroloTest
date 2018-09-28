import { removeSpecialChars } from './../shared/removeSpecialChars';
import { MoviesService } from './../shared/movies.service';
import { Movie } from './../shared/movie';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  queryResults: Object[] = [];
  movieList: Movie[] = [];
  editedMovie: Movie = new Movie;
  queryPage: number = 1;
  currentQuery: string;

  constructor(
    private movies: MoviesService,
    public snackBar: MatSnackBar,
    private charsPipe: removeSpecialChars,
  ) {
  }

  ngOnInit() {
    this.getMoviesByTitle("hero");
  }

  getMoviesByTitle(query: string) {
    if (query == "" || query == undefined || query == null) {
      return;
    }
    this.currentQuery = query;
    this.queryPage = 1;
    this.movies.getMoviesByTitle(this.currentQuery, this.queryPage)
      .subscribe(data => {
        if (data['Response'] == "False") {
          this.openSnackBar(data['Error'], null);
          return;
        }
        this.queryResults = data['Search'];
        this.movieList = [];
        for (let index = 0; index < this.queryResults.length; index++) {
          this.addOneMovieToList(this.queryResults[index]['Title'], this.queryResults[index]['Year'])
        }
      },
        error => console.log(error));
  }

  addOneMovieToList(title: string, year: string) {
    this.movies.getOneMovie(title, year)
      .subscribe(data => {
        if (data['Response'] == "False" || data == null) {
          return;
        }
        let movie = new Movie;
        movie.id = this.movieList.length;
        movie.title = data['Title'];
        movie.year = parseInt(data['Year']);
        movie.runtime = data['Runtime'];
        movie.genre = data['Genre'];
        movie.director = data['Director'];
        this.movieList.push(movie);
      },
        error => console.log(error));
  }

  createMovie(
    newTitle: string,
    newYear: number,
    newRuntime: string,
    newGenre: string,
    newDirector: string,
  ) {
    newTitle = newTitle.trim();
    newTitle = this.charsPipe.transform(newTitle);
    newRuntime = newRuntime.trim();
    newGenre = newGenre.trim();
    newDirector = newDirector.trim();
    if (newYear < 1888 || newYear > 2018) {
      this.openSnackBar('Invalid movie year: ' + newYear + '; Changes were NOT saved', null)
      return;
    }
    if (
      newTitle == "" || newTitle == undefined ||
      newRuntime == "" || newRuntime == undefined ||
      newGenre == "" || newGenre == undefined ||
      newDirector == "" || newDirector == undefined
    ) {
      this.openSnackBar('Invalid movie title; Changes were NOT saved', null)
      return;
    }
    if (this.titleAlreadyExist(-1, newTitle)) {
      this.openSnackBar('Movie title already exists: "' + newTitle + '"; Changes were NOT saved', null)
      return;
    }
    let newMovie = new Movie;
    newMovie.title = newTitle;
    newMovie.year = newYear;
    newMovie.runtime = newRuntime;
    newMovie.genre = newGenre;
    newMovie.director = newDirector;
    this.movieList.push(newMovie);
    this.movieList[(this.movieList.length) - 1].id = (this.movieList.length) - 1;
    this.openSnackBar('Movie created!', null);

  }

  selectMovieToEdit(id: number) {
    this.editedMovie = this.movieList[id];
  }

  editMovie(
    id: number,
    newTitle: string,
    newYear: number,
    newRuntime: string,
    newGenre: string,
    newDirector: string,
  ) {
    newTitle = newTitle.trim();
    newTitle = this.charsPipe.transform(newTitle);
    newRuntime = newRuntime.trim();
    newGenre = newGenre.trim();
    newDirector = newDirector.trim();
    if (newYear < 1888 || newYear > 2018) {
      this.openSnackBar('Invalid movie year: ' + newYear + '; Changes were NOT saved', null)
      return;
    } else {
      this.movieList[id].year = newYear;
    }
    if (
      newTitle == "" || newTitle == undefined ||
      newRuntime == "" || newRuntime == undefined ||
      newGenre == "" || newGenre == undefined ||
      newDirector == "" || newDirector == undefined
    ) {
      this.openSnackBar('All fields are required; Changes were NOT saved', null)
      return;
    }
    if (!this.titleAlreadyExist(id, newTitle)) {
      this.movieList[id].title = newTitle;
    } else {
      this.openSnackBar('Movie title already exists: "' + newTitle + '"; Changes were NOT saved', null)
      return;
    }
    this.movieList[id].runtime = newRuntime;
    this.movieList[id].genre = newGenre;
    this.movieList[id].director = newDirector;
    this.openSnackBar('Changes saved!', null);
  }

  deleteMovie(id: number) {
    let deleted: Movie[] = this.movieList.splice(id, 1);

    for (let index = 0; index < this.movieList.length; index++) {
      this.movieList[index].id = index;
    }
    this.openSnackBar('Successfully deleted "' + deleted[0].title + '"', null)
  }

  titleAlreadyExist(id: number, newTitle: string): boolean {
    for (let index = 0; index < this.movieList.length; index++) {
      if (id != index) {
        if (newTitle.toLowerCase().trim() == this.movieList[index].title.toLowerCase().trim()) {
          return true;
        }
      }
    }
    return false;
  }

  showMoreMovies() {
    this.queryPage++;
    this.movies.getMoviesByTitle(this.currentQuery, this.queryPage)
      .subscribe(data => {
        if (data['Response'] == "False") {
          this.openSnackBar(data['Error'], null);
          return;
        }
        this.queryResults = data['Search'];
        for (let index = 0; index < this.queryResults.length; index++) {
          this.addOneMovieToList(this.queryResults[index]['Title'], this.queryResults[index]['Year'])
        }
      },
        error => console.log(error));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
