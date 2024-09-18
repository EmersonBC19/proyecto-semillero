import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '../shared/components/side-menu/side-menu.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import TransactionsComponent from './transactions/transactions.component';
import ProfileComponent from './profile/profile.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    SideMenuComponent,
    NavbarComponent,
    TransactionsComponent,
    ProfileComponent
  ],
  templateUrl: './user.component.html',
  styles: ``,
})
export default class UserComponent {}
