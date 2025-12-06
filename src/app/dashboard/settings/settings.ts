import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash2, AlertTriangle } from 'lucide-angular';
import { TripService } from '../../services/trip.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './settings.html',
})
export class SettingsComponent {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private tripService = inject(TripService);

    readonly Trash2 = Trash2;
    readonly AlertTriangle = AlertTriangle;

    showDeleteConfirmation = false;
    isDeleting = false;

    openDeleteConfirmation() {
        this.showDeleteConfirmation = true;
    }

    closeDeleteConfirmation() {
        this.showDeleteConfirmation = false;
    }

    async confirmDelete() {
        const tripId = this.route.parent?.snapshot.paramMap.get('tripId');

        if (!tripId) {
            console.error('No trip ID found');
            return;
        }

        try {
            this.isDeleting = true;
            await this.tripService.deleteTrip(tripId);

            // Redirect to trips list after successful deletion
            this.router.navigate(['/trips']);
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Erreur lors de la suppression du séjour');
            this.isDeleting = false;
            this.showDeleteConfirmation = false;
        }
    }
}
