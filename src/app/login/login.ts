import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './login.html',
})
export class LoginComponent {
    private router = inject(Router);
    private auth = inject(Auth);

    login() {
        this.router.navigate(['/trips']);
    }

    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(this.auth, provider);

            // User is signed in
            console.log('User signed in:', result.user);

            // Redirect to trips page
            this.router.navigate(['/trips']);
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            // TODO: Show error message to user
        }
    }
}
