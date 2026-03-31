"""
Product controller – Flask Blueprint for product endpoints.

Routes:
    GET    /products
    POST   /products
    PUT    /products/<id>
    DELETE /products/<id>
"""

from flask import Blueprint, request, jsonify, g

from services import product_service
from utils.auth_middleware import token_required

products_bp = Blueprint("products", __name__)


@products_bp.route("/products", methods=["GET"])
def list_products():
    result, status = product_service.get_products(request.args)
    return jsonify(result), status


@products_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    result, status = product_service.get_product(product_id)
    return jsonify(result), status


@products_bp.route("/products", methods=["POST"])
@token_required
def create_product():
    data = request.get_json(silent=True) or {}
    result, status = product_service.create_product(data, g.user_id, g.user_role)
    return jsonify(result), status


@products_bp.route("/products/<int:product_id>", methods=["PUT"])
@token_required
def update_product(product_id):
    data = request.get_json(silent=True) or {}
    result, status = product_service.update_product(product_id, data, g.user_id, g.user_role)
    return jsonify(result), status


@products_bp.route("/products/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(product_id):
    result, status = product_service.delete_product(product_id, g.user_id, g.user_role)
    return jsonify(result), status
