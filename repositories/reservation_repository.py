from database.db import db_cursor


class ReservationRepository:
    @staticmethod
    def create(service_id, client_id, provider_id, reservation_date, notes):
        with db_cursor() as cur:
            cur.execute(
                '''
                INSERT INTO reservations (service_id, client_id, provider_id, reservation_date, notes)
                VALUES (%s, %s, %s, %s, %s)
                ''',
                (service_id, client_id, provider_id, reservation_date, notes),
            )
            return cur.lastrowid

    @staticmethod
    def get_by_id(reservation_id):
        with db_cursor() as cur:
            cur.execute(
                '''
                SELECT r.*, s.title AS service_title,
                       client.full_name AS client_name,
                       provider.full_name AS provider_name
                FROM reservations r
                JOIN services s ON s.id = r.service_id
                JOIN users client ON client.id = r.client_id
                JOIN users provider ON provider.id = r.provider_id
                WHERE r.id = %s
                ''',
                (reservation_id,),
            )
            return cur.fetchone()

    @staticmethod
    def list_for_user(user_id, role):
        query = '''
            SELECT r.*, s.title AS service_title,
                   client.full_name AS client_name,
                   provider.full_name AS provider_name
            FROM reservations r
            JOIN services s ON s.id = r.service_id
            JOIN users client ON client.id = r.client_id
            JOIN users provider ON provider.id = r.provider_id
        '''
        params = []
        if role == 'prestataire':
            query += ' WHERE r.provider_id = %s'
            params.append(user_id)
        elif role != 'admin':
            query += ' WHERE r.client_id = %s'
            params.append(user_id)
        query += ' ORDER BY r.created_at DESC'

        with db_cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

    @staticmethod
    def update_status(reservation_id, status):
        with db_cursor() as cur:
            cur.execute('UPDATE reservations SET status = %s WHERE id = %s', (status, reservation_id))
            return cur.rowcount
