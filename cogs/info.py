import disnake
from disnake.ext import commands


class PingCommand(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.slash_command(
        guild_ids=[874378015285608568],
        name="ping",
        description="Get the ping of the bot"

    )
    async def ping(self, interaction: disnake.ApplicationCommandInteraction):
        await interaction.response.send_message("PONG BITCHES!")


def setup(bot: commands.Bot):
    bot.add_cog(PingCommand(bot))
