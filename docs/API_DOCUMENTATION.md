# 📚 Documentation API Propelize

## 🎯 **Vue d'ensemble**

L'API Propelize est une API REST sécurisée pour la gestion des utilisateurs et des véhicules. Elle utilise l'authentification JWT et l'autorisation basée sur les rôles.

**Base URL** : `http://localhost:3000`  
**Version** : 1.0  
**Format** : JSON

## 🔐 **Authentification**

L'API utilise des tokens JWT pour l'authentification. Deux types de tokens sont utilisés :

- **Access Token** : Valide 15 minutes, utilisé pour les requêtes API
- **Refresh Token** : Valide 7 jours, utilisé pour renouveler l'access token

### **Format des Headers**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 👥 **API Utilisateurs**

### **1. Créer un utilisateur**
```http
POST /api/users/register
```

**Corps de la requête :**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "user"
}
```

**Réponse (201 Created) :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

**Erreurs possibles :**
- `400` : Données invalides
- `409` : Email déjà existant

### **2. Connexion**
```http
POST /api/users/login
```

**Corps de la requête :**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Réponse (200 OK) :**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Erreurs possibles :**
- `401` : Credentials invalides

### **3. Rafraîchir le token**
```http
POST /api/users/refresh-token
```

**Corps de la requête :**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse (200 OK) :**
```json
{
  "message": "Tokens rafraîchis avec succès",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### **4. Récupérer tous les utilisateurs**
```http
GET /api/users
```

**Headers requis :**
```
Authorization: Bearer <admin_token>
```

**Réponse (200 OK) :**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Erreurs possibles :**
- `401` : Token manquant ou invalide
- `403` : Permissions insuffisantes (admin requis)

### **5. Récupérer un utilisateur par ID**
```http
GET /api/users/:id
```

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse (200 OK) :**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### **6. Mettre à jour un utilisateur**
```http
PUT /api/users/:id
```

**Headers requis :**
```
Authorization: Bearer <token>
```

**Corps de la requête :**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123",
  "role": "admin"
}
```

**Réponse (200 OK) :**
```json
{
  "message": "Utilisateur mis à jour avec succès",
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "admin"
  }
}
```

### **7. Supprimer un utilisateur**
```http
DELETE /api/users/:id
```

**Headers requis :**
```
Authorization: Bearer <admin_token>
```

**Réponse (204 No Content)**

**Erreurs possibles :**
- `403` : Permissions insuffisantes (admin requis)

## 🚗 **API Véhicules**

### **1. Récupérer tous les véhicules**
```http
GET /api/vehicles
```

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse (200 OK) :**
```json
[
  {
    "id": 1,
    "registration_number": "AB-123-CD",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "rent_price": 50.00,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### **2. Créer un véhicule**
```http
POST /api/vehicles
```

**Headers requis :**
```
Authorization: Bearer <token>
```

**Corps de la requête :**
```json
{
  "registrationNumber": "XY-789-ZZ",
  "make": "Mercedes",
  "model": "Classe A",
  "year": 2023,
  "rentPrice": 65.00
}
```

**Réponse (201 Created) :**
```json
{
  "id": 2,
  "registration_number": "XY-789-ZZ",
  "make": "Mercedes",
  "model": "Classe A",
  "year": 2023,
  "rent_price": 65.00,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### **3. Récupérer un véhicule par ID**
```http
GET /api/vehicles/:id
```

**Réponse (200 OK) :**
```json
{
  "id": 1,
  "registration_number": "AB-123-CD",
  "make": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "rent_price": 50.00,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### **4. Rechercher par immatriculation**
```http
GET /api/vehicles/registration/:number
```

**Exemple :**
```http
GET /api/vehicles/registration/AB-123-CD
```

### **5. Rechercher par fourchette de prix**
```http
GET /api/vehicles/price/range?min=40&max=70
```

**Réponse (200 OK) :**
```json
[
  {
    "id": 1,
    "registration_number": "AB-123-CD",
    "make": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "rent_price": 50.00
  }
]
```

### **6. Mettre à jour un véhicule**
```http
PUT /api/vehicles/:id
```

**Corps de la requête :**
```json
{
  "registrationNumber": "XY-789-ZZ",
  "make": "Mercedes",
  "model": "Classe A",
  "year": 2023,
  "rentPrice": 70.00
}
```

### **7. Supprimer un véhicule**
```http
DELETE /api/vehicles/:id
```

**Réponse (204 No Content)**

## 🔒 **Sécurité**

### **Rate Limiting**
- **Limite** : 100 requêtes par 15 minutes par IP
- **Réponse** : 429 Too Many Requests si dépassé

### **Validation des Données**
- **Email** : Format email valide
- **Mot de passe** : Minimum 6 caractères
- **Immatriculation** : Format XX-123-XX
- **Prix** : Nombre positif avec 2 décimales max

### **Codes d'Erreur**
- `400` : Données invalides
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `409` : Conflit (email déjà utilisé)
- `429` : Trop de requêtes
- `500` : Erreur serveur

## 🧪 **Exemples d'Utilisation**

### **Workflow Complet**

1. **Créer un utilisateur :**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

2. **Se connecter :**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Utiliser le token pour accéder aux véhicules :**
```bash
curl -X GET http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer <access_token>"
```

4. **Créer un véhicule :**
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber": "XY-789-ZZ",
    "make": "Mercedes",
    "model": "Classe A",
    "year": 2023,
    "rentPrice": 65.00
  }'
```

## 📊 **Health Check**

```http
GET /health
```

**Réponse (200 OK) :**
```json
{
  "status": "OK",
  "message": "API Propelize opérationnelle",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

**Dernière mise à jour** : 2024  
**Version de l'API** : 1.0  
**Contact** : support@propelize.com 