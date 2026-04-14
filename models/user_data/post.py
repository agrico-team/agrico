from base_model.base_model import *


class Post(BaseModel):
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    post_content = TextField()
    post_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    post_title = TextField()
    user = ForeignKeyField(column_name='user_id', field='user_id', model=Account)

    class Meta:
        table_name = 'post'