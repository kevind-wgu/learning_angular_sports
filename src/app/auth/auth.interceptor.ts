import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "../store/app.store";
import { AuthData } from "../models";

import { environment } from "../../environments/environment";

const URL = environment.firebaseUrl;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  auth: AuthData | null = null;
  constructor(private store: Store<AppState>) {
    store.select('auth').subscribe(authStore => {
      this.auth = authStore.auth;
    })
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(URL) && this.auth?.isValid()) {
      const newReq = req.clone({params: req.params.set('auth', this.auth.getToken())});
      // console.log("NEW REQ", newReq);
      return next.handle(newReq);
    }

    return next.handle(req);
  }
}
