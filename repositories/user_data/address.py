from models.user_data.account import database
from models.user_data.address import Address

from playhouse.shortcuts import model_to_dict

class AccountRepository:
    @staticmethod
    @database.atomic()
    def add_address_to_user(address: dict, user_id: str):
        return Address.create(**address, user=user_id)

    @staticmethod
    @database.atomic()
    def get_address_by_id(address_id: str):
        return Address.get_by_id(address_id)

    @staticmethod
    @database.atomic()
    def change_address_by_id(address: dict, address_id: str):
        return Address.update(address).where(Address.address_id == address_id)

    @staticmethod
    @database.atomic()
    def remove_address_by_id(address_id: str):
        return Address.delete_by_id(address_id)
    