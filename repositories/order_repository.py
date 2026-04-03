from database.db import db_cursor


class OrderRepository:
    @staticmethod
    def create(product_id, buyer_id, supplier_id, quantity, unit_price, total_price):
        with db_cursor() as cur:
            cur.execute(
                '''
                INSERT INTO orders (product_id, buyer_id, supplier_id, quantity, unit_price, total_price)
                VALUES (%s, %s, %s, %s, %s, %s)
                ''',
                (product_id, buyer_id, supplier_id, quantity, unit_price, total_price),
            )
            return cur.lastrowid

    @staticmethod
    def get_by_id(order_id):
        with db_cursor() as cur:
            cur.execute(
                '''
                SELECT o.*, p.title AS product_title,
                       buyer.full_name AS buyer_name,
                       supplier.full_name AS supplier_name
                FROM orders o
                JOIN products p ON p.id = o.product_id
                JOIN users buyer ON buyer.id = o.buyer_id
                JOIN users supplier ON supplier.id = o.supplier_id
                WHERE o.id = %s
                ''',
                (order_id,),
            )
            return cur.fetchone()

    @staticmethod
    def list_for_user(user_id, role):
        query = '''
            SELECT o.*, p.title AS product_title,
                   buyer.full_name AS buyer_name,
                   supplier.full_name AS supplier_name
            FROM orders o
            JOIN products p ON p.id = o.product_id
            JOIN users buyer ON buyer.id = o.buyer_id
            JOIN users supplier ON supplier.id = o.supplier_id
        '''
        params = []
        if role == 'fournisseur':
            query += ' WHERE o.supplier_id = %s'
            params.append(user_id)
        elif role != 'admin':
            query += ' WHERE o.buyer_id = %s'
            params.append(user_id)
        query += ' ORDER BY o.created_at DESC'

        with db_cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

    @staticmethod
    def update_status(order_id, status):
        with db_cursor() as cur:
            cur.execute('UPDATE orders SET status = %s WHERE id = %s', (status, order_id))
            return cur.rowcount
