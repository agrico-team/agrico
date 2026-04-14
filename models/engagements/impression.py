from base_model.base_model import *


class Impression(BaseModel):
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    impression = TextField()
    impression_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    parent_comment = ForeignKeyField(column_name='parent_comment_id', field='comment_id', model=Comment, null=True)
    parent_post = ForeignKeyField(column_name='parent_post_id', field='post_id', model=Post, null=True)
    parent_product = ForeignKeyField(column_name='parent_product_id', field='product_id', model=Product, null=True)
    parent_profile = ForeignKeyField(column_name='parent_profile_id', field='user_id', model=Account, null=True)
    parent_service = ForeignKeyField(column_name='parent_service_id', field='service_id', model=Service, null=True)
    user = ForeignKeyField(backref='account_user_set', column_name='user_id', field='user_id', model=Account)

    class Meta:
        table_name = 'impression'