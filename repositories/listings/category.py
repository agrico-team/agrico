from models.listings.category import Category
from models.base_model import database
from playhouse.shortcuts import model_to_dict

class CategoryRepository:
    @staticmethod
    @database.atomic
    def add_category(category: dict):
        try:
            return Category.create(**category)
        except:
            return {}

    @staticmethod
    @database.atomic
    def remove_category_by_id(category_id: str):
        try:
            return model_to_dict(Category.delete_by_id(category_id))
        except:
            return {}

    @staticmethod
    @database.atomic
    def get_category_by_id(category_id: str):
        try:
            return model_to_dict(Category.select().where(Category.category_id == category_id))
        except:
            return {}

    @staticmethod
    @database.atomic
    def get_category_id_by_name(category_name: str):
        try:
            return Category.select(Category.category_id).where(Category.category_name == category_name).category_id
        except:
            return None
    
    @staticmethod
    @database.atomic
    def update_category(category: dict):
        try:
            return Category.update(category).where(Category.category_id == category['category_id'])
        except:
            return None