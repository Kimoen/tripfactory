import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Plane, Calendar, Users, ArrowRight, Plus } from 'lucide-angular';

interface Trip {
    id: string;
    name: string;
    description: string;
    dates: string;
    participants: number;
    image: string;
}

@Component({
    selector: 'app-trips',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './trips.html',
})
export class TripsComponent {
    private router = inject(Router);

    readonly Plus = Plus;
    readonly Calendar = Calendar;
    readonly Users = Users;
    readonly ArrowRight = ArrowRight;

    readonly trips: Trip[] = [
        {
            id: 'trip-001',
            name: 'Week-end au Ski',
            description: 'Séjour dans les Alpes avec les collègues',
            dates: '12 - 15 Janvier 2025',
            participants: 8,
            image: 'https://images.unsplash.com/photo-1487662994801-729bd178696b?q=80&w=2000&auto=format&fit=crop'
        },
        {
            id: 'trip-002',
            name: 'Vacances d\'Été',
            description: 'Roadtrip en Italie',
            dates: '01 - 15 Août 2025',
            participants: 4,
            image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2000&auto=format&fit=crop'
        },
        {
            id: 'trip-003',
            name: 'Séminaire Team Building',
            description: 'Workshop et activités nature',
            dates: '20 - 22 Mars 2025',
            participants: 12,
            image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2000&auto=format&fit=crop'
        }
    ];

    openTrip(tripId: string) {
        this.router.navigate(['/dashboard', tripId]);
    }
}
