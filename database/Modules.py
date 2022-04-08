from .Core import Database

class Module(Database):
    def __init__(self, guild_id, module):
        self.guild = str(guild_id)
        super().__init__("Bot", module)

    def get(self):
        return self.col.find_one({
            "_id": self.guild
        })

    def is_disabled(self, mod):
        DOC =  self.db["modules"].find_one({
            "_id": self.guild
        })

        if not DOC or not mod in DOC: return False

        if (not "enabled" in DOC[mod]) or DOC[mod]["enabled"]: return False

        return True