# Propelize Vehicle API

API de gestion des véhicules pour Propelize, permettant la gestion complète du parc automobile.

## Technologies Utilisées

- Node.js
- MySQL (via XAMPP)
- Docker
- Express.js

## Prérequis

- Node.js (v14 ou supérieur)
- Docker et Docker Compose
- XAMPP (pour le développement local)

## Installation

1. Cloner le repository :
```bash
git clone [url-du-repo]
cd propelize-vehicle-api
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
- Copier le fichier `.env.example` vers `.env`
- Modifier les variables selon votre environnement

4. Démarrer l'application avec Docker :
```bash
docker-compose up -d
```

## Structure de l'API

### Endpoints

#### Véhicules

- `GET /api/vehicles/:id` - Récupérer un véhicule par ID
- `POST /api/vehicles` - Créer un nouveau véhicule
- `PUT /api/vehicles/:id` - Mettre à jour un véhicule
- `DELETE /api/vehicles/:id` - Supprimer un véhicule
- `GET /api/vehicles/registration/:number` - Rechercher par immatriculation
- `GET /api/vehicles/price?min=X&max=Y` - Rechercher par fourchette de prix

### Modèle de Données

```json
{
  "registrationNumber": "AB-123-CD",
  "make": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "rentPrice": 50.00
}
```

## Tests

Pour exécuter les tests :
```bash
npm test
```

## Documentation API

La documentation détaillée de l'API est disponible dans le dossier `docs/`. 