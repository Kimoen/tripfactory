import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import {
    LucideAngularModule,
    LayoutDashboard,
    FileText,
    Users,
    Utensils,
    Package,
    MapPin,
    ArrowLeft,
    Link,
    Check,
    Copy
} from 'lucide-angular';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        LucideAngularModule
    ],
    templateUrl: './dashboard.html',
})
export class DashboardComponent {
    private route = inject(ActivatedRoute);

    readonly ArrowLeft = ArrowLeft;
    readonly Link = Link;
    readonly Check = Check;
    readonly Copy = Copy;

    linkCopied = false;
    isGuestMode = false;

    readonly menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, route: './' },
        { label: 'Résumé', icon: FileText, route: 'summary' },
        { label: 'Participants', icon: Users, route: 'participants' },
        { label: 'Lieu', icon: MapPin, route: 'location' },
        { label: 'Repas', icon: Utensils, route: 'meals' },
        { label: 'Logistique', icon: Package, route: 'logistics' },
    ];

    ngOnInit() {
        // Check if accessing in guest mode
        this.route.queryParams.subscribe(params => {
            this.isGuestMode = params['mode'] === 'guest';
        });
    }

    copyInviteLink() {
        const tripId = this.route.snapshot.paramMap.get('tripId');
        const inviteUrl = `${window.location.origin}/dashboard/${tripId}?mode=guest`;

        navigator.clipboard.writeText(inviteUrl).then(() => {
            this.linkCopied = true;
            setTimeout(() => this.linkCopied = false, 2000);
        });
    }
}
