from flask import Blueprint, request, jsonify, g

from services import reservation_service
from utils.auth_middleware import token_required


reservations_bp = Blueprint('reservations', __name__)


@reservations_bp.route('/reservations', methods=['POST'])
@token_required
def create_reservation():
    data = request.get_json(silent=True) or {}
    result, status = reservation_service.create_reservation(data, g.user_id, g.user_role)
    return jsonify(result), status


@reservations_bp.route('/reservations', methods=['GET'])
@token_required
def list_reservations():
    result, status = reservation_service.list_reservations(g.user_id, g.user_role)
    return jsonify(result), status


@reservations_bp.route('/reservations/<int:reservation_id>/decision', methods=['PATCH'])
@token_required
def decide_reservation(reservation_id):
    data = request.get_json(silent=True) or {}
    result, status = reservation_service.update_reservation_status(
        reservation_id, data.get('status'), g.user_id, g.user_role
    )
    return jsonify(result), status


@reservations_bp.route('/reservations/<int:reservation_id>/cancel', methods=['PATCH'])
@token_required
def cancel_reservation(reservation_id):
    result, status = reservation_service.cancel_reservation(reservation_id, g.user_id, g.user_role)
    return jsonify(result), status
