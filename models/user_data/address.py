from common import *

class Address(BaseModel):
    address_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    city = TextField()
    country = TextField()
    state = TextField()
    street = TextField()
    user = ForeignKeyField(column_name='user_id', field='user_id', model=Account, null=True)
    zipcode = TextField()

    class Meta:
        table_name = 'address'