"""
Service model – raw SQL queries against the `services` table.
"""

from database.db import db_cursor


class ServiceModel:

    @staticmethod
    def get_all(category_id=None, provider_id=None, search=None, limit=20, offset=0):
        conditions = ["s.is_available = TRUE"]
        params = []

        if category_id:
            conditions.append("s.category_id = %s")
            params.append(category_id)
        if provider_id:
            conditions.append("s.provider_id = %s")
            params.append(provider_id)
        if search:
            conditions.append("(s.title LIKE %s OR s.description LIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])

        where = "WHERE " + " AND ".join(conditions)
        params.extend([limit, offset])

        with db_cursor() as cur:
            cur.execute(
                f"""
                SELECT s.*, u.full_name AS provider_name, c.name AS category_name
                FROM services s
                LEFT JOIN users u ON s.provider_id = u.id
                LEFT JOIN categories c ON s.category_id = c.id
                {where}
                ORDER BY s.created_at DESC
                LIMIT %s OFFSET %s
                """,
                params,
            )
            return cur.fetchall()

    @staticmethod
    def get_by_id(service_id):
        with db_cursor() as cur:
            cur.execute(
                """
                SELECT s.*, u.full_name AS provider_name, u.phone AS provider_phone,
                       c.name AS category_name
                FROM services s
                LEFT JOIN users u ON s.provider_id = u.id
                LEFT JOIN categories c ON s.category_id = c.id
                WHERE s.id = %s
                """,
                (service_id,),
            )
            return cur.fetchone()

    @staticmethod
    def create(title, description, price, duration_minutes, category_id, provider_id):
        with db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO services (title, description, price, duration_minutes, category_id, provider_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (title, description, price, duration_minutes, category_id, provider_id),
            )
            return cur.lastrowid

    @staticmethod
    def update(service_id, fields: dict):
        if not fields:
            return 0
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [service_id]
        with db_cursor() as cur:
            cur.execute(
                f"UPDATE services SET {set_clause} WHERE id = %s", values
            )
            return cur.rowcount

    @staticmethod
    def delete(service_id):
        with db_cursor() as cur:
            cur.execute("DELETE FROM services WHERE id = %s", (service_id,))
            return cur.rowcount

    @staticmethod
    def is_owner(service_id, user_id):
        with db_cursor() as cur:
            cur.execute(
                "SELECT id FROM services WHERE id = %s AND provider_id = %s",
                (service_id, user_id),
            )
            return cur.fetchone() is not None
