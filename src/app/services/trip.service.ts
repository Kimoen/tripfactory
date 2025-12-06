import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export interface Trip {
    id?: string;
    name: string;
    description: string;
    dates: string;
    participants: number;
    image: string;
    ownerId: string;
    participantIds: string[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

@Injectable({
    providedIn: 'root'
})
export class TripService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    /**
     * Attend que Firebase Auth soit initialisé
     */
    private async waitForAuthReady(): Promise<void> {
        return new Promise((resolve) => {
            if (this.auth.currentUser !== null) {
                resolve();
            } else {
                const unsubscribe = this.auth.onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve();
                });
            }
        });
    }

    /**
     * Récupère tous les voyages de l'utilisateur connecté (en tant que propriétaire)
     */
    async getUserTrips(): Promise<Trip[]> {
        await this.waitForAuthReady();

        const user = this.auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const tripsCollection = collection(this.firestore, 'trips');
        const q = query(tripsCollection, where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Trip));
    }

    /**
     * Récupère tous les voyages où l'utilisateur est participant
     */
    async getParticipatingTrips(): Promise<Trip[]> {
        const user = this.auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const tripsCollection = collection(this.firestore, 'trips');
        const q = query(
            tripsCollection,
            where('participantIds', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Trip));
    }

    /**
     * Récupère un voyage spécifique par son ID
     */
    async getTripById(tripId: string): Promise<Trip | null> {
        const tripDoc = doc(this.firestore, 'trips', tripId);
        const tripSnapshot = await getDoc(tripDoc);

        if (!tripSnapshot.exists()) {
            return null;
        }

        return {
            id: tripSnapshot.id,
            ...tripSnapshot.data()
        } as Trip;
    }

    /**
     * Crée un nouveau voyage
     */
    async createTrip(trip: Omit<Trip, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const user = this.auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        const tripsCollection = collection(this.firestore, 'trips');
        const now = Timestamp.now();

        const newTrip = {
            ...trip,
            ownerId: user.uid,
            participantIds: trip.participantIds || [],
            createdAt: now,
            updatedAt: now
        };

        const docRef = await addDoc(tripsCollection, newTrip);
        return docRef.id;
    }

    /**
     * Met à jour un voyage existant
     */
    async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
        const tripDoc = doc(this.firestore, 'trips', tripId);

        const updateData = {
            ...updates,
            updatedAt: Timestamp.now()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key as keyof typeof updateData] === undefined) {
                delete updateData[key as keyof typeof updateData];
            }
        });

        await updateDoc(tripDoc, updateData);
    }

    /**
     * Supprime un voyage
     */
    async deleteTrip(tripId: string): Promise<void> {
        const tripDoc = doc(this.firestore, 'trips', tripId);
        await deleteDoc(tripDoc);
    }

    /**
     * Ajoute un participant à un voyage
     */
    async addParticipant(tripId: string, userId: string): Promise<void> {
        const trip = await this.getTripById(tripId);
        if (!trip) {
            throw new Error('Trip not found');
        }

        const participantIds = trip.participantIds || [];
        if (!participantIds.includes(userId)) {
            participantIds.push(userId);
            await this.updateTrip(tripId, { participantIds });
        }
    }

    /**
     * Retire un participant d'un voyage
     */
    async removeParticipant(tripId: string, userId: string): Promise<void> {
        const trip = await this.getTripById(tripId);
        if (!trip) {
            throw new Error('Trip not found');
        }

        const participantIds = (trip.participantIds || []).filter(id => id !== userId);
        await this.updateTrip(tripId, { participantIds });
    }

    /**
     * Vérifie si l'utilisateur actuel est le propriétaire du voyage
     */
    async isOwner(tripId: string): Promise<boolean> {
        const user = this.auth.currentUser;
        if (!user) {
            return false;
        }

        const trip = await this.getTripById(tripId);
        return trip?.ownerId === user.uid;
    }

    /**
     * Vérifie si l'utilisateur actuel est participant du voyage
     */
    async isParticipant(tripId: string): Promise<boolean> {
        const user = this.auth.currentUser;
        if (!user) {
            return false;
        }

        const trip = await this.getTripById(tripId);
        return trip?.participantIds?.includes(user.uid) || false;
    }
}
