import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorsModelsService {

  private colorBody: BehaviorSubject<String> = new BehaviorSubject<String>("#ffffff");
  private colorRing: BehaviorSubject<String> = new BehaviorSubject<String>("#ffffff");
  private colorHandle: BehaviorSubject<String> = new BehaviorSubject<String>("#ffffff");
  private colorInside: BehaviorSubject<String> = new BehaviorSubject<String>("#ffffff");
  private colorBase: BehaviorSubject<String> = new BehaviorSubject<String>("#ffffff");
  private tempMug: BehaviorSubject<Number> = new BehaviorSubject<Number>(50);
  private isMagicMug: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor() { }

  set setColorBody(color: String) {
    this.colorBody.next(color)
  }

  get getColorBody() {
    return this.colorBody.asObservable();
  }

  set setColorRing(color: String) {
    this.colorRing.next(color)
  }

  get getColorRing() {
    return this.colorRing.asObservable();
  }

  set setColorHandle(color: String) {
    this.colorHandle.next(color)
  }

  get getColorHandle() {
    return this.colorHandle.asObservable();
  }

  set setColorInside(color: String) {
    this.colorInside.next(color)
  }

  get getColorBase() {
    return this.colorBase.asObservable();
  }

  set setColorBase(color: String) {
    this.colorBase.next(color)
  }

  get getColorInside() {
    return this.colorInside.asObservable();
  }

  set setTempMug(temp: Number) {
    this.tempMug.next(temp)
  }

  get getTempMug() {
    return this.tempMug.asObservable();
  }

  set setIsMagicMug(state: Boolean) {
    this.isMagicMug.next(state)
  }

  get getIsMagicMug() {
    return this.isMagicMug.asObservable();
  }
}
