from disnake.ext import commands
import disnake
from utils import check_reason
from database.Guilds import GuildSettings, Moderation as ModLogs


class Moderation(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.slash_command(
        name="warn",
        guild_ids=[874378015285608568],
        description="Test warn a member",
    )
    async def warn(self, interaction: disnake.ApplicationCommandInteraction, member: disnake.User, reason: str):
        modlogs = ModLogs()
        check_reason(interaction, reason)
        modlogs.createModLog(interaction.guild, interaction.author, member, reason, [], "warn")
        sentMsg = await member.send(
            f"You've been warned in {interaction.guild.name} for {reason}. If you beleive this is a mistake, open an "
            f"inquiry but typing `/staff` in the appriopiate channel in the server")
        sent = "Sent" if sentMsg else "Didn't send"
        await interaction.response.send_message(f"Warned {member}. {sent}")

    async def ban(self, interaction: disnake.ApplicationCommandInteraction, member: disnake.User, reason: str):
        modlogs = ModLogs()
        check_reason(interaction, reason)
        modlogs.createModLog(interaction.guild, interaction.author, member, reason, [], "ban")
        sentMsg = await member.send(
            f"You've been warned in {interaction.guild.name} for {reason}. If you beleive this is a mistake, open an "
            f"inquiry but typing `/staff` in the appriopiate channel in the server")
        await interaction.guild.get_member(member.id).ban(reason=reason)
        sent = "Sent Message in DM" if sentMsg else "Didn't send Message in DM (Probably closed dms)"
        await interaction.response.send_message(f"Warned {member}. {sent}")

    async def mute(self, interaction: disnake.ApplicationCommandInteraction, member: disnake.User, durationreason: str):
        modlogs = ModLogs()
        check_reason(interaction, str)
        modlogs.createModLog(interaction.guild, interaction.author, member, reason, [], "mute")
        await interaction.guild.get_member(member.id).timeout()





def setup(bot: commands.Bot):
    bot.add_cog(Moderation(bot))
