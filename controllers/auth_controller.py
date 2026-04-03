from flask import Blueprint, request, jsonify, g

from services import auth_service
from utils.auth_middleware import token_required


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    result, status = auth_service.register_user(data)
    return jsonify(result), status


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    result, status = auth_service.login_user(data)
    return jsonify(result), status


@auth_bp.route('/auth/profile', methods=['PUT'])
@token_required
def update_profile():
    data = request.get_json(silent=True) or {}
    result, status = auth_service.update_profile(g.user_id, data)
    return jsonify(result), status
