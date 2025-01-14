import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // Esta propiedad debe estar presente
  imports: [CommonModule, IonicModule]
})
export class LoginPage {
  constructor(private router: Router) {}
  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
