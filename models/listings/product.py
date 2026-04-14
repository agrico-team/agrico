from base_model.base_model import *

class Product(BaseModel):
    category = ForeignKeyField(column_name='category_id', field='category_id', model=Category)
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    product_delivery_date = DateField()
    product_description = TextField()
    product_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    product_quantity = IntegerField(constraints=[SQL("DEFAULT 0")])
    product_status = TextField(constraints=[SQL("DEFAULT 'public'::text")])
    product_title = TextField()
    product_unit_price = DecimalField()
    user = ForeignKeyField(column_name='user_id', field='user_id', model=Account)

    class Meta:
        table_name = 'product'