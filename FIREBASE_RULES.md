# Configuration Firebase pour Trip Factory

Ce document explique comment configurer et déployer les règles de sécurité Firebase pour l'application Trip Factory.

## Fichiers de règles

### 1. `firestore.rules` - Règles Firestore
Ce fichier contient les règles de sécurité pour Cloud Firestore.

**Règles principales :**
- **Voyages (trips)** :
  - Lecture : propriétaire ou participant
  - Création : utilisateur authentifié (devient automatiquement propriétaire)
  - Mise à jour/Suppression : uniquement le propriétaire

- **Participants, Repas, Logistique** :
  - Lecture : propriétaire ou participant du voyage
  - Écriture : propriétaire ou participant du voyage

### 2. `database.rules.json` - Règles Realtime Database
Ce fichier contient les règles de sécurité pour Firebase Realtime Database (si utilisé).

## Déploiement des règles

### Prérequis
1. Installer Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Se connecter à Firebase :
```bash
firebase login
```

3. Initialiser Firebase dans le projet (si pas déjà fait) :
```bash
firebase init
```
Sélectionner :
- Firestore
- Realtime Database (si utilisé)
- Authentication

### Déployer les règles Firestore

```bash
firebase deploy --only firestore:rules
```

### Déployer les règles Realtime Database

```bash
firebase deploy --only database
```

### Déployer toutes les règles

```bash
firebase deploy --only firestore:rules,database
```

## Structure des données

### Collection `trips`
```typescript
{
  id: string,              // ID auto-généré
  name: string,            // Nom du voyage
  description: string,     // Description
  dates: string,           // Dates du voyage
  participants: number,    // Nombre de participants
  image: string,           // URL de l'image
  ownerId: string,         // UID du propriétaire (créateur)
  participantIds: string[] // Liste des UIDs des participants
}
```

### Sous-collections
- `trips/{tripId}/participants` - Participants du voyage
- `trips/{tripId}/meals` - Repas planifiés
- `trips/{tripId}/logistics` - Éléments logistiques

## Tester les règles

Vous pouvez tester les règles directement dans la console Firebase :
1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner votre projet
3. Aller dans Firestore Database > Règles
4. Utiliser le simulateur de règles pour tester différents scénarios

## Sécurité

⚠️ **Important** :
- Ne jamais permettre l'accès en lecture/écriture sans authentification
- Toujours vérifier que `request.auth != null`
- Valider que `ownerId` correspond à l'utilisateur authentifié lors de la création
- Les participants peuvent uniquement être ajoutés par le propriétaire du voyage

## Exemple de requête Firestore

```typescript
// Récupérer les voyages de l'utilisateur connecté
const user = auth.currentUser;
const tripsRef = collection(firestore, 'trips');
const q = query(tripsRef, where('ownerId', '==', user.uid));
const querySnapshot = await getDocs(q);
```

## Monitoring

Pour surveiller l'utilisation et les erreurs :
1. Console Firebase > Firestore Database > Usage
2. Vérifier les tentatives d'accès refusées
3. Ajuster les règles si nécessaire
