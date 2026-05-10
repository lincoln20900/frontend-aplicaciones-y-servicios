import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, UsuarioResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<UsuarioResponse | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/autenticar/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setCurrentUser(response.usuario);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.removeCurrentUser();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  private removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private setCurrentUser(user: UsuarioResponse): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getCurrentUser(): UsuarioResponse | null {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  private removeCurrentUser(): void {
    sessionStorage.removeItem(this.userKey);
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}