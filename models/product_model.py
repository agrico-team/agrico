"""
Product model – raw SQL queries against the `products` table.
"""

from database.db import db_cursor


class ProductModel:

    @staticmethod
    def get_all(category_id=None, supplier_id=None, search=None, limit=20, offset=0):
        conditions = ["p.is_available = TRUE"]
        params = []

        if category_id:
            conditions.append("p.category_id = %s")
            params.append(category_id)
        if supplier_id:
            conditions.append("p.supplier_id = %s")
            params.append(supplier_id)
        if search:
            conditions.append("(p.title LIKE %s OR p.description LIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])

        where = "WHERE " + " AND ".join(conditions)
        params.extend([limit, offset])

        with db_cursor() as cur:
            cur.execute(
                f"""
                SELECT p.*, u.full_name AS supplier_name, c.name AS category_name
                FROM products p
                LEFT JOIN users u ON p.supplier_id = u.id
                LEFT JOIN categories c ON p.category_id = c.id
                {where}
                ORDER BY p.created_at DESC
                LIMIT %s OFFSET %s
                """,
                params,
            )
            return cur.fetchall()

    @staticmethod
    def get_by_id(product_id):
        with db_cursor() as cur:
            cur.execute(
                """
                SELECT p.*, u.full_name AS supplier_name, u.phone AS supplier_phone,
                       c.name AS category_name
                FROM products p
                LEFT JOIN users u ON p.supplier_id = u.id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = %s
                """,
                (product_id,),
            )
            return cur.fetchone()

    @staticmethod
    def create(title, description, price, quantity, unit, category_id, supplier_id):
        with db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO products (title, description, price, quantity, unit, category_id, supplier_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (title, description, price, quantity, unit, category_id, supplier_id),
            )
            return cur.lastrowid

    @staticmethod
    def update(product_id, fields: dict):
        if not fields:
            return 0
        set_clause = ", ".join(f"{k} = %s" for k in fields)
        values = list(fields.values()) + [product_id]
        with db_cursor() as cur:
            cur.execute(
                f"UPDATE products SET {set_clause} WHERE id = %s", values
            )
            return cur.rowcount

    @staticmethod
    def delete(product_id):
        with db_cursor() as cur:
            cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
            return cur.rowcount

    @staticmethod
    def is_owner(product_id, user_id):
        with db_cursor() as cur:
            cur.execute(
                "SELECT id FROM products WHERE id = %s AND supplier_id = %s",
                (product_id, user_id),
            )
            return cur.fetchone() is not None

    @staticmethod
    def count_images(product_id):
        with db_cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) AS cnt FROM images WHERE entity_type='product' AND entity_id=%s",
                (product_id,),
            )
            row = cur.fetchone()
            return row["cnt"] if row else 0
