from base_model.base_model import *

class Category(BaseModel):
    category_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    category_name = TextField()

    class Meta:
        table_name = 'category'