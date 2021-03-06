import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ReplaySubject, Observable } from 'rxjs';
import { Config } from './Config';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { SonarDetails } from './dashboards/sonar-coverage/SonarDetails';

@Injectable()
export class ConfigService {

  private subject: ReplaySubject<Config>;

  constructor(private http: Http) {
    this.subject = new ReplaySubject<Config>(1);
    this.http
      .get('config.json')
      .map((response: Response) => {
        return <Config> response.json();
      })
      .catch((): ErrorObservable => {
        const errorMessage = 'No config.json has been found!';
        console.error(errorMessage);
        return Observable.throw(new Error(errorMessage));
      })
      .subscribe(this.subject);
  }

  private getConfig(): Observable<Config> {
    return this.subject.asObservable();
  }

  getApiBase(): Observable<string> { // Rename to Stats API Base
    return this.getConfig()
      .map((config: Config) => {
        return config.api;
      })
      .first();
  }

  getSonarDetails(): Observable<SonarDetails> {
    return this.getConfig()
      .map((config: Config) => {
        return new SonarDetails(config.sonar_api_url, config.sonar_token);
      })
      .first();
  }

}
