from base_model.base_model import *


class Following(BaseModel):
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    from_user = ForeignKeyField(column_name='from_user_id', field='user_id', model=Account)
    to_user = ForeignKeyField(backref='account_to_user_set', column_name='to_user_id', field='user_id', model=Account)

    class Meta:
        table_name = 'following'
        primary_key = False