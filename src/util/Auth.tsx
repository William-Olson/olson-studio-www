import jwtDecode from 'jwt-decode';
import { TokenData } from '../types/AppTypes';

// export const getToken = (): Token => {
//   return new Token(localStorage.getItem('token') || '');
// };

// export const setToken = (token: Token): void => {
//   localStorage.setItem('token', token.toString());
// };

// export const removeToken = (): void => {
//   localStorage.removeItem('token');
// };

export class Token {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public toString(): string {
    return this.token;
  }

  public decode<T = TokenData>(): T | undefined {
    try {
      return jwtDecode<T>(this.token);
    } catch (err) {
      console.error('Error decoding token: ' + (err as Error).message);
      return undefined;
    }
  }

  public isValid(): boolean {
    return !!this.token;
  }

  public static fromCache(): Token {
    return new Token(localStorage.getItem('token') || '');
  }

  public static cache(token: Token): void {
    localStorage.setItem('token', token.toString());
  }

  public static clearCache(): void {
    localStorage.removeItem('token');
  }
}
