from models.user_data.account import Account
from models.user_data.account import database
from models.user_data.address import Address

from playhouse.shortcuts import model_to_dict

class AccountRepository:
    @staticmethod
    @database.atomic
    def add_user(user: dict, address: dict):
        try:
            Account.create(**user)
            return user | address;  
        except:
            return {}

    @database.atomic
    def get_user_by_id(id: str):
        return model_to_dict(Account.get_by_id(id))

    @database.atomic
    def update_user(user: dict):
        return Account.update(user).where(Account.id == user['user_id'])

    @database.atomic
    def remove_user_by_id(id: str):
        return Account.delete_by_id(id)