from playhouse.postgres_ext import *

database = PostgresqlExtDatabase('agricodb', **{'user': 'postgres', 'password': 'password'})

class BaseModel(Model):
    class Meta:
        database = database
        schema = 'agrico'
        legacy_table_names = False # this way, ProductOrder becomes product_order, and not productorder