from repositories.order_repository import OrderRepository
from models.product_model import ProductModel


FINAL_STATES = {'accepted', 'refused', 'cancelled'}


def create_order(data: dict, user_id: int, user_role: str):
    if user_role == 'fournisseur':
        return {'error': 'Un fournisseur ne peut pas commander ses propres produits'}, 403

    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not product_id:
        return {'error': 'product_id est requis'}, 400
    try:
        quantity = int(quantity)
        if quantity <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return {'error': 'Quantité invalide'}, 400

    product = ProductModel.get_by_id(product_id)
    if not product or not product.get('is_available'):
        return {'error': 'Produit non trouvé ou indisponible'}, 404
    if product['supplier_id'] == user_id:
        return {'error': 'Vous ne pouvez pas commander votre propre produit'}, 403
    if quantity > product.get('quantity', 0):
        return {'error': 'Stock insuffisant'}, 400

    unit_price = float(product['price'])
    total_price = unit_price * quantity
    order_id = OrderRepository.create(
        product_id=product['id'],
        buyer_id=user_id,
        supplier_id=product['supplier_id'],
        quantity=quantity,
        unit_price=unit_price,
        total_price=total_price,
    )
    return {'message': 'Commande créée', 'order_id': order_id}, 201


def list_orders(user_id: int, user_role: str):
    orders = OrderRepository.list_for_user(user_id, user_role)
    return {'orders': orders, 'count': len(orders)}, 200


def update_order_status(order_id: int, status: str, user_id: int, user_role: str):
    if status not in FINAL_STATES - {'cancelled'}:
        return {'error': 'Statut invalide'}, 400

    order = OrderRepository.get_by_id(order_id)
    if not order:
        return {'error': 'Commande non trouvée'}, 404
    if user_role != 'admin' and order['supplier_id'] != user_id:
        return {'error': 'Seul le fournisseur peut accepter ou refuser'}, 403
    if order['status'] != 'pending':
        return {'error': 'Cette commande a déjà été traitée'}, 400

    OrderRepository.update_status(order_id, status)
    return {'message': f'Commande {"acceptée" if status == "accepted" else "refusée"}'}, 200


def cancel_order(order_id: int, user_id: int, user_role: str):
    order = OrderRepository.get_by_id(order_id)
    if not order:
        return {'error': 'Commande non trouvée'}, 404
    if user_role != 'admin' and order['buyer_id'] != user_id:
        return {'error': 'Seul le client peut annuler sa commande'}, 403
    if order['status'] != 'pending':
        return {'error': 'Seule une commande en attente peut être annulée'}, 400

    OrderRepository.update_status(order_id, 'cancelled')
    return {'message': 'Commande annulée'}, 200
