from base_model.base_model import *
from user_data.account import *

with database.atomic():
    print(Account.select().first())