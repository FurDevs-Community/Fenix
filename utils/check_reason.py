import disnake

from database import GuildSettings


def check_reason(interaction: disnake.ApplicationCommandInteraction, reason: str):
    if not reason:
        if GuildSettings.getGuild(interaction.guild).reasonRequired:
            return interaction.response.send_message("You must provide a reason!")
