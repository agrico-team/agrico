from user_data.account import *
from common import *

with database.atomic():
    print(Account.select().first())