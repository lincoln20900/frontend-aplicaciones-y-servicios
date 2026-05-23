import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authHeaders = this.authService.getAuthHeaders();

    if (!authHeaders['Authorization'] && request.url.includes('/mascotas')) {
      console.warn('AuthInterceptor: no auth token present for API request', request.url);
    }

    const authRequest = request.clone({
      setHeaders: authHeaders
    });

    console.debug('AuthInterceptor request', {
      url: request.url,
      method: request.method,
      headers: authRequest.headers.keys(),
      authTokenPresent: !!authHeaders['Authorization']
    });

    return next.handle(authRequest);
  }
}
