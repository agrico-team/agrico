"""
Service controller – Flask Blueprint for service endpoints.

Routes:
    GET    /services
    POST   /services
    PUT    /services/<id>
    DELETE /services/<id>
"""

from flask import Blueprint, request, jsonify, g

from services import service_service
from utils.auth_middleware import token_required

services_bp = Blueprint("services", __name__)


@services_bp.route("/services", methods=["GET"])
def list_services():
    result, status = service_service.get_services(request.args)
    return jsonify(result), status


@services_bp.route("/services/<int:service_id>", methods=["GET"])
def get_service(service_id):
    result, status = service_service.get_service(service_id)
    return jsonify(result), status


@services_bp.route("/services", methods=["POST"])
@token_required
def create_service():
    data = request.get_json(silent=True) or {}
    result, status = service_service.create_service(data, g.user_id, g.user_role)
    return jsonify(result), status


@services_bp.route("/services/<int:service_id>", methods=["PUT"])
@token_required
def update_service(service_id):
    data = request.get_json(silent=True) or {}
    result, status = service_service.update_service(service_id, data, g.user_id, g.user_role)
    return jsonify(result), status


@services_bp.route("/services/<int:service_id>", methods=["DELETE"])
@token_required
def delete_service(service_id):
    result, status = service_service.delete_service(service_id, g.user_id, g.user_role)
    return jsonify(result), status
