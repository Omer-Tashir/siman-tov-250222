import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { catchError, map, shareReplay } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

export class RSVP {
  fullname: string;
  isComing: string;
  participants?: number;
  transportation?: boolean;
  transportationPoint?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private db: AngularFirestore) {}

  getRSVP(): Observable<RSVP[]> {
    return this.db.collection(`RSVP`).get().pipe(
      map(rsvp => rsvp.docs.map(doc => {
        return Object.assign(new RSVP(), doc.data());
      })),
      catchError(err => of([])),
      shareReplay()
    );
  }

  putRSVP(rsvp: RSVP): Observable<string> {
    const uid = localStorage.getItem('uid') ?? this.db.createId();
    return from(this.db.collection(`RSVP`).doc(uid).set({...rsvp})).pipe(
      map(() => uid)
    );
  }
}