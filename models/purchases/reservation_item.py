from common import *
class ReservationItem(BaseModel):
    item_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    item_quantity = IntegerField()
    item_status = TextField()
    item_unit = TextField()
    item_unit_price = DecimalField()
    reservation = ForeignKeyField(column_name='reservation_id', field='reservation_id', model=ServiceReservation, null=True)
    service = ForeignKeyField(column_name='service_id', field='service_id', model=Service, null=True)

    class Meta:
        table_name = 'reservation_item'