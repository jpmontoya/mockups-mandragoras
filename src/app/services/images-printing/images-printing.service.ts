import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ImagesPrintingService {
  private image: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor() { }

  set setImage(image: String) {
    this.image.next(image)
  }

  get getImage() {
    return this.image.asObservable();
  }
}
