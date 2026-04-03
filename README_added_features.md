# Fonctionnalités backend ajoutées

## Ajouts principaux
- Authentification: inscription, connexion, modification de profil
- Commandes: création, consultation, acceptation/refus, annulation
- Réservations: création, consultation, acceptation/refus, annulation
- Base de données: schéma SQL complet avec relations
- Middleware JWT: protection des routes privées
- Structure `repositories` ajoutée pour respecter la layered architecture

## Endpoints ajoutés
### Auth
- `POST /auth/register`
- `POST /auth/login`
- `PUT /auth/profile`

### Orders
- `POST /orders`
- `GET /orders`
- `PATCH /orders/<id>/decision` avec body `{ "status": "accepted" }` ou `{ "status": "refused" }`
- `PATCH /orders/<id>/cancel`

### Reservations
- `POST /reservations`
- `GET /reservations`
- `PATCH /reservations/<id>/decision` avec body `{ "status": "accepted" }` ou `{ "status": "refused" }`
- `PATCH /reservations/<id>/cancel`

## Fichiers importants
- `database/schema.sql`
- `database/db.py`
- `utils/auth_middleware.py`
- `controllers/auth_controller.py`
- `controllers/order_controller.py`
- `controllers/reservation_controller.py`
- `services/auth_service.py`
- `services/order_service.py`
- `services/reservation_service.py`
- `repositories/user_repository.py`
- `repositories/order_repository.py`
- `repositories/reservation_repository.py`
- `app.py`

## Remarque
Les fichiers produits/services existants ont été gardés et copiés dans la structure finale.
