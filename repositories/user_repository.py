from database.db import db_cursor


class UserRepository:
    @staticmethod
    def create(full_name, email, phone, password_hash, role, address=None):
        with db_cursor() as cur:
            cur.execute(
                '''
                INSERT INTO users (full_name, email, phone, password_hash, role, address)
                VALUES (%s, %s, %s, %s, %s, %s)
                ''',
                (full_name, email, phone, password_hash, role, address),
            )
            return cur.lastrowid

    @staticmethod
    def get_by_email(email):
        with db_cursor() as cur:
            cur.execute('SELECT * FROM users WHERE email = %s', (email,))
            return cur.fetchone()

    @staticmethod
    def get_by_phone(phone):
        with db_cursor() as cur:
            cur.execute('SELECT * FROM users WHERE phone = %s', (phone,))
            return cur.fetchone()

    @staticmethod
    def get_by_id(user_id):
        with db_cursor() as cur:
            cur.execute(
                'SELECT id, full_name, email, phone, role, address, created_at, updated_at FROM users WHERE id = %s',
                (user_id,),
            )
            return cur.fetchone()

    @staticmethod
    def find_by_email_or_phone(identifier):
        with db_cursor() as cur:
            cur.execute(
                'SELECT * FROM users WHERE email = %s OR phone = %s LIMIT 1',
                (identifier, identifier),
            )
            return cur.fetchone()

    @staticmethod
    def update_profile(user_id, fields: dict):
        if not fields:
            return 0
        set_clause = ', '.join(f'{key} = %s' for key in fields)
        params = list(fields.values()) + [user_id]
        with db_cursor() as cur:
            cur.execute(f'UPDATE users SET {set_clause} WHERE id = %s', params)
            return cur.rowcount
