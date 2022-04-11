import disnake
from disnake.ext import commands
from utils import check_cog_loaded
from disnake.ext.commands.errors import ExtensionNotLoaded, ExtensionNotFound
import os

cogs = []
for file in os.listdir("cogs"):

    if (file.endswith(".py")):
        cogs.append(f"{file[:-3]}")
cogs.append("all")
print(cogs)


class CogManagement(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.slash_command(
        name="reload",
        description="Reload a cog",
        guild_ids=[874378015285608568],
    )
    async def reload(self, interaction: disnake.ApplicationCommandInteraction,
                     extention: str = commands.Param(choices=cogs)):
        if extention == "all":
            for file in os.listdir("cogs"):
                if file.endswith(".py"):
                    checker = await check_cog_loaded(interaction, file[:-3])
                    if checker:
                        fail = 0
                        success = 0
                        try:
                            await self.bot.reload_extension("cogs." + extention)
                            success += 1
                        except ExtensionNotLoaded:
                            fail += 1
                        except ExtensionNotFound:
                            fail += 1
                await interaction.response.send_message("All Cogs are now reloaded")
            return
        checker = await check_cog_loaded(interaction, extention)
        if checker:
            self.bot.reload_extension("cogs." + extention)
            await interaction.response.send_message(f"Cog: {extention} is now reloaded!")


def setup(bot: commands.Bot):
    bot.add_cog(CogManagement(bot))
