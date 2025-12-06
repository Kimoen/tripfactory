import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './login.html',
})
export class LoginComponent {
    private router = inject(Router);

    login() {
        this.router.navigate(['/trips']);
    }
}
