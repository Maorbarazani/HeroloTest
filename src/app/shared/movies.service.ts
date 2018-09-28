import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const APIKey: string = "9dd5ae4";
const url: string = "http://www.omdbapi.com/?apikey=" + APIKey + "&";

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMoviesByTitle(query: string, page: number) {
    return this.http.get<Object[]>(url + "s=" + query + "&page=" + page);
  }

  getOneMovie(title: string, year: string) {
    return this.http.get(url + "t=" + title + "&y=" + year);
  }


}
