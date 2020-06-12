import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(public authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + this.authService.getToken())
        });
        return next.handle(req);
    }
}