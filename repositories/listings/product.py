from models.listings.product import Product
from models.base_model import database
from playhouse.shortcuts import model_to_dict

class ProductRepository:
    @staticmethod
    @database.atomic()
    def add_product(product: dict):
        pass