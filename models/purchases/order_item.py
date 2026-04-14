from base_model.base_model import *


class OrderItem(BaseModel):
    item_delivery_date = DateField()
    item_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    item_quantity = IntegerField()
    item_status = TextField()
    item_unit_price = DecimalField()
    order = ForeignKeyField(column_name='order_id', field='order_id', model=ProductOrder, null=True)
    product = ForeignKeyField(column_name='product_id', field='product_id', model=Product, null=True)

    class Meta:
        table_name = 'order_item'