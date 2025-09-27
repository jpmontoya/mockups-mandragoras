import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorsModelsService {

  private colorBody: BehaviorSubject<String> = new BehaviorSubject<String>("#ffffff");

  constructor() { }

  set setColorBody(color: String) {
    this.colorBody.next(color)
  }

  get getColorBody() {
    return this.colorBody.asObservable();
  }
}
