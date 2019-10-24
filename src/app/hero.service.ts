import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private heroesUrl = 'fasdrasf/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'content-type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('pobrałem herosiów')),
        catchError(this.handleError<Hero[]>('zaciągnięcie herosów', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
              .pipe(
                tap(_ => this.log(`pobrałem hero o id = ${id}`)),
                catchError(this.handleError<Hero>(`pobranie hero o id = ${id}`))
              );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result? : T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} się nie udało: ${error.message}`);
      return of(result as T);
    }
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`zaktualizowałem hero o id=${hero.id} o imieniu ${hero.name}`)),
      catchError(this.handleError<any>(`Aktualizacja hero o id=${hero.id}`))
    );
  }

}