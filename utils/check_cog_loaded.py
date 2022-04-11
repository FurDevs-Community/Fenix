import disnake
from disnake.ext import commands
from disnake.ext.commands import ExtensionNotLoaded, ExtensionAlreadyLoaded

async def check_cog_loaded(interaction: disnake.ApplicationCommandInteraction, cog_name: str):
    try:
        await interaction.bot.load_extension(f"cogs.{cog_name}")
    except ExtensionAlreadyLoaded:
        return True
    else:
        await interaction.bot.unload_extension(f"cogs.{cog_name}")
        return False
