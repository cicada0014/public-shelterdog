import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let _req;
        if (!request.url.includes('api')) {
            _req = request.clone({ url: `api/${request.url}` });
        }
        return next.handle(_req ? _req : request);
    }
}