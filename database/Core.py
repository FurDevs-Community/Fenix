import os

from pymongo import MongoClient

client = MongoClient(os.getenv("MONGO_URI"))


class Database:
    def __init__(self, dbName=None, colName=None):
        if not dbName or not colName:
            raise ValueError()

        self.db = client[dbName]
        self.col = self.db[colName]

    def get(self, **filter):
        return [doc for doc in self.col.find(filter)]

    def get_one(self, **filter):
        return self.col.find_one(filter)

    def drop(self):
        return self.col.drop()
