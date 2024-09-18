import { Component } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth.service'; // Servicio para obtener el rol del usuario

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  public menuItems: Route[] = []; // Declaramos explícitamente el tipo como Route[]

  constructor(private authService: AuthService) {
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    const userRole = this.authService.getRole(); // Obtener el rol del usuario

    if (userRole) {
      this.menuItems = routes
        .map((route) => route.children ?? [])
        .flat()
        .filter((route) => !route.path?.includes('login'))
        .filter((route) => !route.path?.includes('register'))
        .filter((route) => route && route.path)
        .filter((route) => this.filterRoutesBasedOnRole(route, userRole));
    }
  }

  private filterRoutesBasedOnRole(route: Route, role: string): boolean {
    // Si el usuario es admin, excluir rutas de la vista del usuario
    if (role === 'admin') {
      return (
        !route.path?.includes('transactions') &&
        !route.path?.includes('withdrawls') &&
        !route.path?.includes('deposits')
      );
    }

    // Si el usuario es client, excluir rutas de client
    if (role === 'client') {
      return !route.path?.includes('auditoria');
    }

    return true;
  }
}
