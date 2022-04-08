import inspect
import disnake
from disnake.ext import commands

class Owner(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.is_owner()
    @commands.slash_command(
        name="eval",
        description="Evalute python stuff",
        guild_ids=[874378015285608568]
    )
    async def evaluate(self, interaction: disnake.ApplicationCommandInteraction, script: str):
        try:
            result = eval(script)
            if inspect.isawaitable(result):
                result = await result
        except Exception as e:
            await interaction.response.send_message(f"An Error Occured with the eval command: \n{e}")
            return
        await interaction.response.send_message(f"Input:\n```py\n{script}\n```\nOutput```py\n{result}\n```")

    @commands.is_owner()
    @commands.slash_command(
        name="exec",
        description="Execute terminal stuffies",
        guild_ids=[874378015285608568]
    )
    async def execute(self, interaction: disnake.ApplicationCommandInteraction, script: str):
        try:
            result = exec(script)
        except Exception as e:
            await interaction.response.send_message(f"An Error Occured with the exec command: \n{e}")
            return
        await interaction.response.send_message(f"Input:\n```py\n{script}\n```\nOutput```py\n{result}\n```")





def setup(bot: commands.Bot):
    bot.add_cog(Owner(bot))