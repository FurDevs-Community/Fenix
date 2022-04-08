import os

from disnake.ext import commands
from dotenv import load_dotenv

from database import GuildSettings

load_dotenv()

bot = commands.Bot(
    command_prefix="J>",
    test_guilds=[874378015285608568]
)


@bot.event
async def on_ready():
    database = GuildSettings()
    for file in os.listdir(f"./cogs"):
        if file.endswith(".py"):
            extension = file[:-3]
            try:
                bot.load_extension(f"cogs.{extension}")
                print(f"Loaded extension '{extension}'")
            except Exception as e:
                print(f"Failed to load extension {extension}\nError: {e}")
    for guild in bot.guilds:
        database.findOrCreate(guild)


bot.run(os.getenv("TOKEN"))
