from base_model.base_model import *


class Media(BaseModel):
    media_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    media_path = TextField()
    parent_post = ForeignKeyField(column_name='parent_post_id', field='post_id', model=Post, null=True)
    parent_product = ForeignKeyField(column_name='parent_product_id', field='product_id', model=Product, null=True)
    parent_service = ForeignKeyField(column_name='parent_service_id', field='service_id', model=Service, null=True)

    class Meta:
        table_name = 'media'