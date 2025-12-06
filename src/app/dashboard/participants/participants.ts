import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Mail, User, Trash2, Users, Baby, ArrowUpDown } from 'lucide-angular';

interface Participant {
    id: string;
    name: string;
    email: string;
    role: 'Organisateur' | 'Participant';
    status: 'Confirmé' | 'En attente';
    type: 'Adulte' | 'Enfant';
}

interface Family {
    id: string;
    name: string;
    members: Participant[];
}

interface DisplayGroup {
    id: string;
    name: string;
    members: Participant[];
}

type SortOption = 'family' | 'name' | 'type';

@Component({
    selector: 'app-participants',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './participants.html',
})
export class ParticipantsComponent {
    // Icons
    readonly Plus = Plus;
    readonly Mail = Mail;
    readonly User = User;
    readonly Trash2 = Trash2;
    readonly Users = Users;
    readonly Baby = Baby;
    readonly ArrowUpDown = ArrowUpDown;

    // State
    showInviteModal = false;
    sortBy: SortOption = 'family';

    newParticipant = {
        name: '',
        email: '',
        familyName: '',
        type: 'Adulte' as 'Adulte' | 'Enfant'
    };

    // Mock Data
    families: Family[] = [
        {
            id: 'fam-1',
            name: 'Famille Dupont',
            members: [
                { id: 'p1', name: 'Jean Dupont', email: 'jean@example.com', role: 'Organisateur', status: 'Confirmé', type: 'Adulte' },
                { id: 'p2', name: 'Marie Dupont', email: 'marie@example.com', role: 'Participant', status: 'Confirmé', type: 'Adulte' },
                { id: 'p2b', name: 'Léo Dupont', email: '', role: 'Participant', status: 'Confirmé', type: 'Enfant' }
            ]
        },
        {
            id: 'fam-2',
            name: 'Famille Martin',
            members: [
                { id: 'p3', name: 'Paul Martin', email: 'paul@example.com', role: 'Participant', status: 'En attente', type: 'Adulte' },
                { id: 'p4', name: 'Sophie Martin', email: 'sophie@example.com', role: 'Participant', status: 'En attente', type: 'Adulte' },
                { id: 'p5', name: 'Tom Martin', email: '', role: 'Participant', status: 'En attente', type: 'Enfant' }
            ]
        },
        {
            id: 'fam-3',
            name: 'Solo',
            members: [
                { id: 'p6', name: 'Alice Bernard', email: 'alice@example.com', role: 'Participant', status: 'Confirmé', type: 'Adulte' }
            ]
        }
    ];

    get displayGroups(): DisplayGroup[] {
        if (this.sortBy === 'family') {
            return this.families.map(f => ({
                id: f.id,
                name: f.name,
                members: [...f.members].sort((a, b) => a.name.localeCompare(b.name))
            })).sort((a, b) => a.name.localeCompare(b.name));
        }

        const allMembers = this.families.flatMap(f => f.members);

        if (this.sortBy === 'name') {
            return [{
                id: 'all',
                name: 'Tous les participants',
                members: [...allMembers].sort((a, b) => a.name.localeCompare(b.name))
            }];
        }

        if (this.sortBy === 'type') {
            const adultes = allMembers.filter(m => m.type === 'Adulte').sort((a, b) => a.name.localeCompare(b.name));
            const enfants = allMembers.filter(m => m.type === 'Enfant').sort((a, b) => a.name.localeCompare(b.name));

            const groups: DisplayGroup[] = [];
            if (adultes.length) groups.push({ id: 'adults', name: 'Adultes', members: adultes });
            if (enfants.length) groups.push({ id: 'children', name: 'Enfants', members: enfants });

            return groups;
        }

        return [];
    }

    setSort(option: SortOption) {
        this.sortBy = option;
    }

    openInviteModal() {
        this.showInviteModal = true;
        this.newParticipant = { name: '', email: '', familyName: '', type: 'Adulte' };
    }

    closeInviteModal() {
        this.showInviteModal = false;
    }

    inviteParticipant() {
        if (!this.newParticipant.name || !this.newParticipant.familyName) return;

        const newMember: Participant = {
            id: Math.random().toString(36).substr(2, 9),
            name: this.newParticipant.name,
            email: this.newParticipant.email,
            role: 'Participant',
            status: 'En attente',
            type: this.newParticipant.type
        };

        const existingFamily = this.families.find(f => f.name.toLowerCase() === this.newParticipant.familyName.toLowerCase());

        if (existingFamily) {
            existingFamily.members.push(newMember);
        } else {
            this.families.push({
                id: Math.random().toString(36).substr(2, 9),
                name: this.newParticipant.familyName,
                members: [newMember]
            });
        }

        this.closeInviteModal();
    }

    removeParticipant(memberId: string) {
        // Need to find which family they belong to since we might be in a different view
        for (const family of this.families) {
            const index = family.members.findIndex(m => m.id === memberId);
            if (index !== -1) {
                family.members.splice(index, 1);
                // Clean up empty families if needed, or keep them?
                // keeping empty families might be confusing in "family" view if not handled
                if (family.members.length === 0) {
                    this.families = this.families.filter(f => f.id !== family.id);
                }
                break;
            }
        }
    }
}
