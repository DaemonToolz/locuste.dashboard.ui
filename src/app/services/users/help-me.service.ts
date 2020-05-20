import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../http/generic/generic-http-client';
import { HelpMeModel, HelpSections } from "../../models/help"
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HelpMeService {

  public currentPage : HelpMeModel[] = []

  constructor(private _http: HttpClient) {

  }

  public loadDesiredSection(tabIndex: number){
    this.getHelpSection(HelpSections[tabIndex]).pipe(take(1)).subscribe(data => {
      this.currentPage = data.data;
    })
  }

  public getHelpSection(name: string): Observable<any>{
    return this._http.get<any>(`assets/internal_data/${name}.json`);
  }

}
