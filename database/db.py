import os
from contextlib import contextmanager
import pymysql
from pymysql.cursors import DictCursor


def get_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=int(os.getenv('DB_PORT', '3306')),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'agri_platform'),
        charset='utf8mb4',
        cursorclass=DictCursor,
        autocommit=False,
    )


@contextmanager
def db_cursor():
    conn = get_connection()
    cur = conn.cursor()
    try:
        yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()
