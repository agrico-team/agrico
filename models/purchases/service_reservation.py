from base_model.base_model import *


class ServiceReservation(BaseModel):
    date_created = DateTimeTZField(null=True)
    reservation_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    total_amount = DecimalField()
    user = ForeignKeyField(column_name='user_id', field='user_id', model=Account, null=True)

    class Meta:
        table_name = 'service_reservation'