import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrortrackerService {
  private errors : string[] = []
  errorsChanged = new Subject<string[]>();

  constructor() { }

  addError(msg: string, err: Error, metadata: any) {
    console.log(msg, err, metadata);
    this.errors.push(msg);
    this.errorsChanged.next(this.errors);
    setTimeout(() => {
        this.errors.splice(0, 1);
        this.errorsChanged.next(this.errors);
      }, 
      8 * 1000
    );
  }
}
