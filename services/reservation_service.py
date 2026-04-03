from datetime import datetime

from repositories.reservation_repository import ReservationRepository
from models.service_model import ServiceModel


FINAL_STATES = {'accepted', 'refused', 'cancelled'}


def create_reservation(data: dict, user_id: int, user_role: str):
    if user_role == 'prestataire':
        return {'error': 'Un prestataire ne peut pas réserver son propre service'}, 403

    service_id = data.get('service_id')
    reservation_date = data.get('reservation_date')
    notes = (data.get('notes') or '').strip() or None

    if not service_id or not reservation_date:
        return {'error': 'service_id et reservation_date sont requis'}, 400

    try:
        parsed_date = datetime.fromisoformat(reservation_date)
    except ValueError:
        return {'error': 'reservation_date doit être au format ISO (YYYY-MM-DD HH:MM:SS)'}, 400

    service = ServiceModel.get_by_id(service_id)
    if not service or not service.get('is_available'):
        return {'error': 'Service non trouvé ou indisponible'}, 404
    if service['provider_id'] == user_id:
        return {'error': 'Vous ne pouvez pas réserver votre propre service'}, 403

    reservation_id = ReservationRepository.create(
        service_id=service['id'],
        client_id=user_id,
        provider_id=service['provider_id'],
        reservation_date=parsed_date,
        notes=notes,
    )
    return {'message': 'Réservation créée', 'reservation_id': reservation_id}, 201


def list_reservations(user_id: int, user_role: str):
    reservations = ReservationRepository.list_for_user(user_id, user_role)
    return {'reservations': reservations, 'count': len(reservations)}, 200


def update_reservation_status(reservation_id: int, status: str, user_id: int, user_role: str):
    if status not in FINAL_STATES - {'cancelled'}:
        return {'error': 'Statut invalide'}, 400

    reservation = ReservationRepository.get_by_id(reservation_id)
    if not reservation:
        return {'error': 'Réservation non trouvée'}, 404
    if user_role != 'admin' and reservation['provider_id'] != user_id:
        return {'error': 'Seul le prestataire peut accepter ou refuser'}, 403
    if reservation['status'] != 'pending':
        return {'error': 'Cette réservation a déjà été traitée'}, 400

    ReservationRepository.update_status(reservation_id, status)
    return {'message': f'Réservation {"acceptée" if status == "accepted" else "refusée"}'}, 200


def cancel_reservation(reservation_id: int, user_id: int, user_role: str):
    reservation = ReservationRepository.get_by_id(reservation_id)
    if not reservation:
        return {'error': 'Réservation non trouvée'}, 404
    if user_role != 'admin' and reservation['client_id'] != user_id:
        return {'error': 'Seul le client peut annuler sa réservation'}, 403
    if reservation['status'] != 'pending':
        return {'error': 'Seule une réservation en attente peut être annulée'}, 400

    ReservationRepository.update_status(reservation_id, 'cancelled')
    return {'message': 'Réservation annulée'}, 200
