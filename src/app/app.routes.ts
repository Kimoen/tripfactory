import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { TripsComponent } from './trips/trips';
import { PlaceholderComponent } from './dashboard/placeholder';
import { ParticipantsComponent } from './dashboard/participants/participants';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'trips', component: TripsComponent },
    {
        path: 'dashboard/:tripId',
        component: DashboardComponent,
        children: [
            { path: '', component: PlaceholderComponent }, // Default dashboard view
            { path: 'summary', component: PlaceholderComponent },
            { path: 'participants', component: ParticipantsComponent },
            { path: 'location', component: PlaceholderComponent },
            { path: 'meals', component: PlaceholderComponent },
            { path: 'logistics', component: PlaceholderComponent },
        ]
    },
    // Redirect old /dashboard access to trips
    { path: 'dashboard', redirectTo: 'trips', pathMatch: 'full' }
];
