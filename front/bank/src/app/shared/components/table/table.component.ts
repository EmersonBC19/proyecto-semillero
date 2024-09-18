import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TransactionService } from '../../../core/services/transaction.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styles: ``,
})
export default class TableComponent implements OnInit, AfterViewInit {
  @Input() transactionType: 'withdrawal' | 'transfer' | 'deposit' | 'all' =
    'all';
  @Input() isAuditTable: boolean = false; // Determina si estamos mostrando auditorías o transacciones
  transactions: any[] = []; // Aquí almacenaremos las transacciones o auditorías
  columns: string[] = [];
  loading: boolean = true; // Para manejar el estado de carga
  error: string | null = null; // Para manejar errores
  dataSource = new MatTableDataSource<any>([]); // MatTableDataSource para paginación y manejo de datos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private transactionSubscription!: Subscription;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchTransactions();

    // Suscribirse al evento de transacción completada (solo si estamos mostrando transacciones)
    if (!this.isAuditTable) {
      this.transactionSubscription =
        this.transactionService.transactionCompleted$.subscribe(() => {
          this.fetchTransactions(); // Recargar la tabla cuando haya una nueva transacción
        });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Conectar el paginator a la dataSource
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    if (this.transactionSubscription) {
      this.transactionSubscription.unsubscribe();
    }
  }

  // Método para obtener transacciones
  async fetchTransactions(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.transactionService.getUserTransactions();
      let transactions = response.data;

      // Filtrar las transacciones según el tipo si no es "all"
      if (this.transactionType !== 'all') {
        transactions = transactions.filter(
          (t: any) => t.transactionType === this.transactionType
        );
      }

      // Configurar la dataSource con las transacciones
      this.transactions = transactions;
      this.dataSource.data = this.transactions;

      // Configurar el paginator
      this.dataSource.paginator = this.paginator;

      // Obtener las claves (columnas) del primer objeto (transacción), excluyendo 'id' y 'userId'
      if (this.transactions.length > 0) {
        this.columns = Object.keys(this.transactions[0]).filter(
          (column) => column !== 'id' && column !== 'userId'
        );

        // Añadir columna de tipo de acción si es necesario
        if (!this.columns.includes('transactionType')) {
          this.columns.push('transactionType');
        }
      }

      this.loading = false;
    } catch (error) {
      this.error = 'No se pudieron cargar las transacciones.';
      this.loading = false;
      console.error('Error al obtener transacciones:', error);
    }
  }

  
}
