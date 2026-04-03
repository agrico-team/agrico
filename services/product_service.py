"""
Product service – business logic for CRUD on products.
"""

from models.product_model import ProductModel

MAX_IMAGES = 5
ALLOWED_FIELDS = {"title", "description", "price", "quantity", "unit", "category_id", "is_available"}


def get_products(params: dict) -> dict:
    category_id = params.get("category_id")
    supplier_id = params.get("supplier_id")
    search = params.get("search")
    try:
        limit = min(int(params.get("limit", 20)), 100)
        offset = int(params.get("offset", 0))
    except ValueError:
        return {"error": "limit et offset doivent être des entiers"}, 400

    products = ProductModel.get_all(category_id, supplier_id, search, limit, offset)
    return {"products": products, "count": len(products)}, 200


def get_product(product_id: int) -> dict:
    product = ProductModel.get_by_id(product_id)
    if not product:
        return {"error": "Produit non trouvé"}, 404
    return {"product": product}, 200


def create_product(data: dict, user_id: int, user_role: str) -> dict:
    if user_role not in ("fournisseur", "admin"):
        return {"error": "Seuls les fournisseurs peuvent publier des produits"}, 403

    title = (data.get("title") or "").strip()
    price = data.get("price")
    if not title:
        return {"error": "Le titre est requis"}, 400
    if price is None:
        return {"error": "Le prix est requis"}, 400
    try:
        price = float(price)
        if price < 0:
            raise ValueError
    except ValueError:
        return {"error": "Prix invalide"}, 400

    product_id = ProductModel.create(
        title=title,
        description=(data.get("description") or "").strip(),
        price=price,
        quantity=int(data.get("quantity", 0)),
        unit=data.get("unit"),
        category_id=data.get("category_id"),
        supplier_id=user_id,
    )
    return {"message": "Produit créé", "product_id": product_id}, 201


def update_product(product_id: int, data: dict, user_id: int, user_role: str) -> dict:
    if user_role != "admin" and not ProductModel.is_owner(product_id, user_id):
        return {"error": "Non autorisé à modifier ce produit"}, 403

    fields = {k: v for k, v in data.items() if k in ALLOWED_FIELDS and v is not None}
    if not fields:
        return {"error": "Aucun champ valide fourni"}, 400

    if "price" in fields:
        try:
            fields["price"] = float(fields["price"])
        except ValueError:
            return {"error": "Prix invalide"}, 400

    updated = ProductModel.update(product_id, fields)
    if not updated:
        return {"error": "Produit non trouvé"}, 404
    return {"message": "Produit mis à jour"}, 200


def delete_product(product_id: int, user_id: int, user_role: str) -> dict:
    if user_role != "admin" and not ProductModel.is_owner(product_id, user_id):
        return {"error": "Non autorisé à supprimer ce produit"}, 403

    deleted = ProductModel.delete(product_id)
    if not deleted:
        return {"error": "Produit non trouvé"}, 404
    return {"message": "Produit supprimé"}, 200
