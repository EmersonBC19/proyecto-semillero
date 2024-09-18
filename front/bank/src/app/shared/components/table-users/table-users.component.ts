import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuditService } from '../../../core/services/audit.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, RouterModule],
  templateUrl: './table-users.component.html', // Reutilizamos la misma plantilla
  styles: ``,
})
export default class UserTableComponent implements OnInit, AfterViewInit {
  // Datos de los usuarios
  users: any[] = []; // Aquí almacenaremos los registros de los usuarios
  columns: string[] = []; // Columnas a mostrar en la tabla
  loading: boolean = true; // Para manejar el estado de carga
  error: string | null = null; // Para manejar errores
  dataSource = new MatTableDataSource<any>([]); // MatTableDataSource para paginación y manejo de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private userSubscription!: Subscription;

  constructor(private AuditService: AuditService) {} // Inyectar el servicio de usuarios

  ngOnInit(): void {
    this.fetchUsers(); // Cargar los registros de usuarios al inicializar
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Conectar el paginator a la dataSource
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Método para obtener los registros de usuarios
  async fetchUsers(): Promise<void> {
    this.loading = true; // Activar estado de carga
    try {
      const response = await this.AuditService.getUsers(); // Llamada al servicio para obtener todos los usuarios
      const users = response.data; // Asignar todos los datos

      // Configurar la dataSource con los registros de usuarios
      this.users = users;
      this.dataSource.data = this.users;

      // Configurar el paginator
      this.dataSource.paginator = this.paginator;

      // Configurar las columnas para mostrar en la tabla (tomar todas las propiedades del primer objeto)
      if (this.users.length > 0) {
        this.columns = Object.keys(this.users[0]); // No se excluye ninguna columna, se muestran todas
      }

      this.loading = false; // Desactivar estado de carga
    } catch (error) {
      this.error = 'No se pudieron cargar los registros de usuarios.';
      this.loading = false;
      console.error('Error al obtener los registros de usuarios:', error);
    }
  }
}
