import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  private celebrate = new Subject();
  public celebrate$ = this.celebrate.asObservable();
   
  constructor() { }

  public startCelebration(): void {
    this.celebrate.next();
  }
}
