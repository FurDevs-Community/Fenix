import disnake
import uuid
from .Core import Database


class Rules(Database):
    def __init__(self):
        super().__init__("Bot", "rules")

    def add_rule(self, guild: disnake.Guild, rule_title: str, rule_info: str):
        self.col.insert_one({
            "_id": guild.id,
            "title": rule_title,
            "information": rule_info
        })

    def remove_rule(self, ruleID: str, guild: disnake.Guild):
        self.col.find_one_and_delete({"_id": ruleID, "guildID": guild.id})

    def list(self, guild: disnake.Guild):
        self.col.find({"guildID": guild.id})


class Moderation(Database):
    def __init__(self):
        super().__init__("Bot", "moderations")

    # Creates a infraction onto the user
    def createModLog(self, guild: disnake.Guild, user: disnake.User, issuer: disnake.User, reason: str,
                     rulesViolated: list[str], violationType: str):
        self.col.insert_one({
            "_id": str(uuid.uuid4()),
            "issuer": issuer.id,
            "user": user.id,
            "reason": reason,
            "rules": rulesViolated,
            "type": violationType  # Ban, Mute, Warn, Kick, [...]
        })

    # Gets all the user's infractions
    def getUserModLogs(self, guild: disnake.Guild, user: disnake.User):
        self.col.find({
            "guildID": guild.id,
            "user": user.id
        })


class AntiRaid(Database):
    def __init__(self):
        super().__init__("Bot", "antiraid")

    def createDefault(self, guild: disnake.Guild):
        self.col.insert_one({
            "_id": guild.id,
            # Scores
            "score": 0,
            "decay": 1, # (Per Minute)
            "newMemberScore": 0,
            "warnScore": 0,
            "muteScore": 0,
            "banScore": 0,
            "antiraidScore": 0,
            # Anti-raid modules
            "welcomeGate": False,
            "inviteWipe": False,
            "indefiniteMute": False,
            "lockdown": False,
            "phoneNumberVerification": False,
            # Thresholds
            "welcomeGateThreshold": 0,
            "inviteWipeThreshold": 0,
            "indefiniteMuteThresold": 0,
            "phoneNumberVerificaionThreshold": 0,
            "lockdownThreshold": 0
        })

class GuildSettings(Database):
    def __init__(self):
        super().__init__("Bot", "guildSettings")

    def createDefault(self, guild: disnake.Guild):
        return self.col.insert_one({
            "_id": guild.id,
            "botManagerRole": None,
            "botModeratorRole": None,
            "verifiedRole": None,
            "unverifiedRole": None,
            "supportCategory": None,
            # Logging
            "banLogChannel": None,
            "kickLogChannel": None,
            "modLogChannel": None,
            "publicModLogChannel": None,
            "joinLogChannel": None,
            "leaveLogChanenl": None,
            "autoModChannel": None,
            "channelLogChannel": None,
            "messageLogChannel": None,
            "userLogChannel": None,
            "generalChannel": None,
            "announcementChannel": None,
            "selfModeration": 0, # Number of reports by user to mute,
            "selfModerationMinutes": 60, # Minutes for mute,
            "vptsDecay": 0,
            "reasonRequired": False,
            "welcomeMessage": None,
            "verificationInstruction": None
        })

    def getGuild(self, guild: disnake.Guild):
        return self.col.find_one({ "_id": guild.id })

    def findOrCreate(self, guild:disnake.Guild):
        data = self.col.find_one({ "_id": guild.id})
        if data:
            return data
        else:
            return GuildSettings.createDefault(self, guild)