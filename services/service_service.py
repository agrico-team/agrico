"""
Service service – business logic for CRUD on services.
"""

from models.service_model import ServiceModel

ALLOWED_FIELDS = {"title", "description", "price", "duration_minutes", "category_id", "is_available"}


def get_services(params: dict) -> dict:
    category_id = params.get("category_id")
    provider_id = params.get("provider_id")
    search = params.get("search")
    try:
        limit = min(int(params.get("limit", 20)), 100)
        offset = int(params.get("offset", 0))
    except ValueError:
        return {"error": "limit et offset doivent être des entiers"}, 400

    services = ServiceModel.get_all(category_id, provider_id, search, limit, offset)
    return {"services": services, "count": len(services)}, 200


def get_service(service_id: int) -> dict:
    service = ServiceModel.get_by_id(service_id)
    if not service:
        return {"error": "Service non trouvé"}, 404
    return {"service": service}, 200


def create_service(data: dict, user_id: int, user_role: str) -> dict:
    if user_role not in ("prestataire", "admin"):
        return {"error": "Seuls les prestataires peuvent publier des services"}, 403

    title = (data.get("title") or "").strip()
    if not title:
        return {"error": "Le titre est requis"}, 400

    price = data.get("price")
    if price is not None:
        try:
            price = float(price)
        except ValueError:
            return {"error": "Prix invalide"}, 400

    duration = data.get("duration_minutes")
    if duration is not None:
        try:
            duration = int(duration)
        except ValueError:
            return {"error": "Durée invalide"}, 400

    service_id = ServiceModel.create(
        title=title,
        description=(data.get("description") or "").strip(),
        price=price,
        duration_minutes=duration,
        category_id=data.get("category_id"),
        provider_id=user_id,
    )
    return {"message": "Service créé", "service_id": service_id}, 201


def update_service(service_id: int, data: dict, user_id: int, user_role: str) -> dict:
    if user_role != "admin" and not ServiceModel.is_owner(service_id, user_id):
        return {"error": "Non autorisé à modifier ce service"}, 403

    fields = {k: v for k, v in data.items() if k in ALLOWED_FIELDS and v is not None}
    if not fields:
        return {"error": "Aucun champ valide fourni"}, 400

    updated = ServiceModel.update(service_id, fields)
    if not updated:
        return {"error": "Service non trouvé"}, 404
    return {"message": "Service mis à jour"}, 200


def delete_service(service_id: int, user_id: int, user_role: str) -> dict:
    if user_role != "admin" and not ServiceModel.is_owner(service_id, user_id):
        return {"error": "Non autorisé à supprimer ce service"}, 403

    deleted = ServiceModel.delete(service_id)
    if not deleted:
        return {"error": "Service non trouvé"}, 404
    return {"message": "Service supprimé"}, 200
