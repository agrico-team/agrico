from common import *

class Message(BaseModel):
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    from_user = ForeignKeyField(column_name='from_user_id', field='user_id', model=Account)
    message_content = TextField()
    message_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    message_status = TextField()
    to_user = ForeignKeyField(backref='account_to_user_set', column_name='to_user_id', field='user_id', model=Account)

    class Meta:
        table_name = 'message'