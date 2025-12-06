import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Plane, Calendar, Users, ArrowRight, Plus } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, Trip } from '../services/trip.service';

@Component({
    selector: 'app-trips',
    standalone: true,
    imports: [LucideAngularModule, CommonModule, FormsModule],
    templateUrl: './trips.html',
})
export class TripsComponent implements OnInit {
    private router = inject(Router);
    private tripService = inject(TripService);
    private cdr = inject(ChangeDetectorRef);

    readonly Plus = Plus;
    readonly Plane = Plane;
    readonly Calendar = Calendar;
    readonly Users = Users;
    readonly ArrowRight = ArrowRight;

    trips: Trip[] = [];
    loading = true;
    showCreateModal = false;
    newTripName = '';

    async ngOnInit() {
        await this.loadUserTrips();
    }

    async loadUserTrips() {
        try {
            this.trips = await this.tripService.getUserTrips();
        } catch (error) {
            console.error('Error loading trips:', error);
            if (error instanceof Error && error.message === 'User not authenticated') {
                this.router.navigate(['/login']);
            }
        } finally {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    openCreateModal() {
        this.showCreateModal = true;
        this.newTripName = '';
    }

    closeCreateModal() {
        this.showCreateModal = false;
        this.newTripName = '';
    }

    async submitNewTrip() {
        if (!this.newTripName || this.newTripName.trim() === '') {
            return;
        }

        try {
            this.loading = true;
            this.showCreateModal = false;
            this.cdr.detectChanges();

            const tripId = await this.tripService.createTrip({
                name: this.newTripName.trim(),
                description: '',
                dates: '',
                participants: 1,
                image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop',
                participantIds: []
            });

            // Redirect to the new trip's dashboard
            this.router.navigate(['/dashboard', tripId]);
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('Erreur lors de la création du séjour');
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    openTrip(tripId: string) {
        this.router.navigate(['/dashboard', tripId]);
    }
}
