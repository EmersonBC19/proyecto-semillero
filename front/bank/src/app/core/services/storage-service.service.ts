import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  isBrowser: boolean;

  constructor() {
    this.isBrowser =
      typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Almacenar un valor (si es un objeto, lo convertimos en JSON)
  setItem(key: string, value: any): void {
    if (this.isBrowser) {
      const valueToStore =
        typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, valueToStore);
    }
  }

  // Obtener un valor (intentamos convertirlo de JSON si es posible)
  getItem(key: string): any {
    if (this.isBrowser) {
      const value = localStorage.getItem(key);
      try {
        return value ? JSON.parse(value) : null; // Intentamos parsear el JSON
      } catch (error) {
        return value; // Si no es JSON, retornamos la cadena
      }
    }
    return null;
  }

  // Eliminar un valor del almacenamiento local
  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
