import os
from functools import wraps

import jwt
from flask import request, jsonify, g


JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-production')
JWT_ALGORITHM = 'HS256'


def generate_token(user: dict) -> str:
    payload = {
        'user_id': user['id'],
        'role': user['role'],
        'email': user.get('email'),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token manquant'}), 401

        token = auth_header.split(' ', 1)[1].strip()
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalide'}), 401

        g.user_id = payload['user_id']
        g.user_role = payload['role']
        return func(*args, **kwargs)

    return wrapper
