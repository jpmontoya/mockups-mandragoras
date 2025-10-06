import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor() { }

  set setLoader(state: Boolean) {
    this.loader.next(state)
  }

  get getLoader() {
    return this.loader.asObservable();
  }
}
