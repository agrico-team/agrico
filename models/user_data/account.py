from common import *

class Account(BaseModel):
    date_created = DateTimeTZField(constraints=[SQL("DEFAULT CURRENT_TIMESTAMP")])
    date_of_birth = DateField()
    email = TextField(unique=True)
    first_name = TextField()
    last_name = TextField()
    middle_name = TextField(null=True)
    password = TextField()
    phone_number = TextField(null=True)
    profile_bio = TextField(null=True)
    profile_header = TextField(null=True)
    profile_picture = TextField(null=True)
    user_id = UUIDField(constraints=[SQL("DEFAULT gen_random_uuid()")], primary_key=True)
    user_role = TextField()
    username = TextField(unique=True)

    class Meta:
        table_name = 'account'