import { Component } from '@angular/core';
import DataTableComponent from "../../shared/components/table-admin/table-admin.component";
import UserTableComponent from "../../shared/components/table-users/table-users.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [DataTableComponent, UserTableComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export default class UsuariosComponent {

}
