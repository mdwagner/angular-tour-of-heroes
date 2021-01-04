import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Promise<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running for returning an empty result.
      return Promise.resolve(result as T);
    };
  }

  getHeroes(): Promise<Hero[]> {
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .toPromise()
      .then((x) => (this.log('fetched heroes'), x))
      .catch(this.handleError<Hero[]>('getHeroes', []));
  }

  getHero(id: number): Promise<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(url)
      .toPromise()
      .then((x) => (this.log(`fetched hero id=${id}`), x))
      .catch(this.handleError<Hero>(`getHero id=${id}`));
  }

  updateHero(hero: Hero): Promise<any> {
    return this.http
      .put(this.heroesUrl, hero, this.httpOptions)
      .toPromise()
      .then((x) => (this.log(`updated hero id=${hero.id}`), x))
      .catch(this.handleError<any>('updateHero'));
  }

  addHero(hero: Hero): Promise<Hero> {
    return this.http
      .post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .toPromise()
      .then(
        (newHero: Hero) => (this.log(`added hero w/ id=${newHero.id}`), newHero)
      )
      .catch(this.handleError<any>('addHero'));
  }

  deleteHero(hero: Hero | number): Promise<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http
      .delete<Hero>(url, this.httpOptions)
      .toPromise()
      .then((x) => (this.log(`deleted hero id=${id}`), x))
      .catch(this.handleError<any>('deleteHero'));
  }

  async searchHeroes(term: string): Promise<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return [];
    }
    return this.http
      .get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .toPromise()
      .then((x) => {
        if (x.length) {
          this.log(`found heroes matching "${term}"`);
        } else {
          this.log(`no heroes matching "${term}"`);
        }
        return x;
      })
      .catch(this.handleError<Hero[]>('searchHeroes', []));
  }
}
