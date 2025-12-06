import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, CommonModule, FormsModule],
    templateUrl: './login.html',
})
export class LoginComponent {
    private router = inject(Router);
    private auth = inject(Auth);

    isSignup = false;
    signupEmail = '';
    signupPassword = '';

    login() {
        this.router.navigate(['/trips']);
    }

    async signup() {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                this.signupEmail,
                this.signupPassword
            );

            // User is created and signed in
            console.log('User created:', userCredential.user);

            // Redirect to trips page
            this.router.navigate(['/trips']);
        } catch (error: any) {
            console.error('Error during signup:', error);
            // TODO: Show error message to user
            alert(`Erreur lors de la création du compte: ${error.message}`);
        }
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
