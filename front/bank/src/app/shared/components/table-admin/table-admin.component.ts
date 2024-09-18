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

@Component({
  selector: 'app-audit-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './table-admin.component.html',
  styles: ``,
})
export default class AuditTableComponent implements OnInit, AfterViewInit {
  // Datos de la auditoría
  @Input() isAuditTable: boolean = false;
  auditLogs: any[] = []; // Aquí almacenaremos los registros de auditoría
  users: any[] = []; // Aquí almacenaremos los registros de los usuarios
  columns: string[] = []; // Columnas a mostrar en la tabla
  loading: boolean = true; // Para manejar el estado de carga
  error: string | null = null; // Para manejar errores
  dataSource = new MatTableDataSource<any>([]); // MatTableDataSource para paginación y manejo de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private auditSubscription!: Subscription;

  constructor(private AuditService: AuditService) {}

  ngOnInit(): void {
    this.fetchAuditLogs(); // Cargar los registros de auditoría al inicializar
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Conectar el paginator a la dataSource
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    if (this.auditSubscription) {
      this.auditSubscription.unsubscribe();
    }
  }

  // Método para obtener los registros de auditoría
  async fetchAuditLogs(): Promise<void> {
    this.loading = true; // Activar estado de carga
    try {
      const response = await this.AuditService.getUserAudits(); // Llamada al servicio para obtener todos los registros
      const auditLogs = response.data; // Asignar todos los datos

      // Configurar la dataSource con los registros de auditoría
      this.auditLogs = auditLogs;
      this.dataSource.data = this.auditLogs;

      // Configurar el paginator
      this.dataSource.paginator = this.paginator;

      // Configurar las columnas para mostrar en la tabla (tomar todas las propiedades del primer objeto)
      if (this.auditLogs.length > 0) {
        this.columns = Object.keys(this.auditLogs[0]); // No se excluye ninguna columna, se muestran todas
      }

      this.loading = false; // Desactivar estado de carga
    } catch (error) {
      this.error = 'No se pudieron cargar los registros de auditoría.';
      this.loading = false;
      console.error('Error al obtener los registros de auditoría:', error);
    }
  }
}
