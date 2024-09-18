import { Component } from '@angular/core';
import TableComponent from '../../shared/components/table/table.component';
import { RouterModule } from '@angular/router';
import { AuditService } from '../../core/services/audit.service';
import AuditTableComponent from '../../shared/components/table-admin/table-admin.component';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [TableComponent, RouterModule, AuditTableComponent],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.css',
})
export default class AuditoriaComponent {
  auditLogs: any[] = []; // Aquí almacenamos los registros de auditoría

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadAuditLogs(); // Cargar los registros de auditoría cuando se inicializa el componente
  }

  // Método para cargar los registros de auditoría desde el servicio
  async loadAuditLogs() {
    try {
      const response = await this.auditService.getUserAudits();
      this.auditLogs = response.data; // Guardar los datos obtenidos en el array
    } catch (error) {
      console.error('Error al cargar los registros de auditoría:', error);
    }
  }
}
