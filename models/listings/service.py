from base_model.base_model import *


class Service(BaseModel):
    category = ForeignKeyField(column_name='category_id', field='category_id', model=Category)
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    service_availability = TextField()
    service_description = TextField()
    service_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    service_status = TextField(constraints=[SQL("DEFAULT 'public'::text")], null=True)
    service_title = TextField()
    service_unit = TextField()
    service_unit_price = DecimalField()
    user = ForeignKeyField(column_name='user_id', field='user_id', model=Account)

    class Meta:
        table_name = 'service'