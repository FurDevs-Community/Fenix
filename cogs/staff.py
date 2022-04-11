from disnake.ext import commands


class Staff(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot


def setup(bot: commands.Bot):
    bot.add_cog(Staff(bot))
