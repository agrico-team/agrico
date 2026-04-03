from werkzeug.security import generate_password_hash, check_password_hash

from repositories.user_repository import UserRepository
from utils.auth_middleware import generate_token

ALLOWED_ROLES = {'agriculteur', 'fournisseur', 'prestataire', 'client', 'admin'}
PROFILE_FIELDS = {'full_name', 'email', 'phone', 'address'}


def register_user(data: dict):
    full_name = (data.get('full_name') or '').strip()
    email = (data.get('email') or '').strip() or None
    phone = (data.get('phone') or '').strip() or None
    password = data.get('password') or ''
    role = (data.get('role') or 'client').strip().lower()
    address = (data.get('address') or '').strip() or None

    if not full_name:
        return {'error': 'Le nom complet est requis'}, 400
    if not email and not phone:
        return {'error': 'Email ou téléphone requis'}, 400
    if len(password) < 6:
        return {'error': 'Le mot de passe doit contenir au moins 6 caractères'}, 400
    if role not in ALLOWED_ROLES:
        return {'error': 'Rôle invalide'}, 400
    if email and UserRepository.get_by_email(email):
        return {'error': 'Cet email existe déjà'}, 409
    if phone and UserRepository.get_by_phone(phone):
        return {'error': 'Ce numéro existe déjà'}, 409

    user_id = UserRepository.create(
        full_name=full_name,
        email=email,
        phone=phone,
        password_hash=generate_password_hash(password),
        role=role,
        address=address,
    )
    user = UserRepository.get_by_id(user_id)
    return {
        'message': 'Compte créé avec succès',
        'user': user,
        'token': generate_token({'id': user_id, 'role': role, 'email': email}),
    }, 201


def login_user(data: dict):
    identifier = (data.get('email') or data.get('phone') or '').strip()
    password = data.get('password') or ''

    if not identifier or not password:
        return {'error': 'Identifiant et mot de passe requis'}, 400

    user = UserRepository.find_by_email_or_phone(identifier)
    if not user or not check_password_hash(user['password_hash'], password):
        return {'error': 'Identifiants invalides'}, 401

    safe_user = UserRepository.get_by_id(user['id'])
    return {
        'message': 'Connexion réussie',
        'user': safe_user,
        'token': generate_token(user),
    }, 200


def update_profile(user_id: int, data: dict):
    fields = {k: v.strip() if isinstance(v, str) else v for k, v in data.items() if k in PROFILE_FIELDS and v is not None}
    if not fields:
        return {'error': 'Aucun champ valide fourni'}, 400

    if 'email' in fields:
        existing = UserRepository.get_by_email(fields['email'])
        if existing and existing['id'] != user_id:
            return {'error': 'Cet email existe déjà'}, 409
    if 'phone' in fields:
        existing = UserRepository.get_by_phone(fields['phone'])
        if existing and existing['id'] != user_id:
            return {'error': 'Ce numéro existe déjà'}, 409

    updated = UserRepository.update_profile(user_id, fields)
    if not updated:
        return {'error': 'Utilisateur non trouvé'}, 404
    return {'message': 'Profil mis à jour', 'user': UserRepository.get_by_id(user_id)}, 200
