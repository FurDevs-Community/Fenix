# Vulpo's Moderations

Listed below are the changes of the moderation bot in each version

## 0.9.0-alpha.4 -  2021-07-26

### Changes

- Hozol is now Open Source check it out (here)[https://github.com/VulpoTheDev/Hozol]
- Changed Hastebin link
- Update Command now uses yarn to update any dependencies
- Suggestion/Bug Commands so you would need to make an issue on the Hozol GitHub Repository


### Added

- Case command which can be used to get more details on a case
- (WORK IN PROGRESS setup command which is used to setup your settings easily
- Reputation Commands such as `J>addReps` `J>removeReps` `J>rep`
- Per Guild Schedules which is used for AutoModeration 
- Mass Channel, Role creation commands for faster server building
- (WORK IN PROGRESS) Play Command
- Votes
- Subscribe Commands (Which is used for the support server)

### Removed

- CPX which was basically used to copy certificate stuff from the src to the dist folder and used cp
- View Reports/Suggestion Commands

### Fixed

- Mute Command
- Unban Command
- Reload Command


## 0.9.0-alpha.3 - 2021-06-04

### Changes

-   Vulpo's Moderations has been rebranded to Hozol and Now it's a general purpose discord bot

### Added

-   EASTER EGG! Cancel is now an alias for the Ban Command
-   Punish Menu with a little bit of functionailty
-   ModLog command
-   Purge, Clear Alias to prune command
-   Added 3 Helper Functions: askRules, askReason and askQuestion
-   Applied these helper functions across the moderation commmands so if you was were to punish someone from a guild that set the bot to require reasons then it'll go ahead and ask
-   Interogate Command
-   Unmute command
-   Pardon Command
-   Translation Command
-   Disable/Enable Command
-   API Routes
-   Vote Command
-   AFK (Away System)
-   Antispam Settings configurablity
-   Message Stats
-   Stats
-   (WIP) Antispam System
-   Role Info Command
-   Emojis Command
-   Members Command
-   Close Command

### Updated

-   User Info commands to show what permissions they have
-   Made Incidents Intros into embed

### Fixed

-   Continuous Asking Questions/Rules when Unbanning bug
-   CronoTime Helper Funcion was bugging out had to fix it

### Removed

-   Support Command (that shows the bot invite/support server invite as it'll later be replaced with one with differnt functionailty)

## 0.9.0-alpha.2 - 2021-04-12

### Added

-   Logger
-   API Routes such as modLogCount, guildCount, memberCount, version Routes
-   Front Page for the Dashboard. Refer to https://vmod.xyz

### Fixed

-   Create Incidents, when punishing a member it was refering to the message when it never existed.

## 0.9.0-alpha.1 - 2021-04-07

### Changed

-   [BREAKING] The Bot will be rewritten once again in TypeScript as Well as NukeJS. Everything from 0.8.x will not be compatible with this version.
-   Name Change (DMod => VMod)
-   There is now 2 event folders, thanks to NukeJS we have an Event folder for events and another for logging related events

### Added

-   Stats Command where you can be able to see the Bots Stats
-   Userinfo Command where you can be able to see a user's info
-   For Devs the commands in Category Folders for Organization
-   Hastebin so anything that's really long will be put into that hastebin to view
-   Report/Suggest Commands Which will create an issue on the private discord
-   Moderation Commands Such as Ban, Mute, Kick, Warn
-   Lock command which will lock the verified member
-   Ability to Temp Mute and Temp Ban (For more than 7 days)
-   Settings Command where you can be able to configure the bot's behavior
-   Avatar Command where you can display a user's avatar
-   AutoModeration Options such as NoAds, Punish Young Accounts
-   Sponsor Commands to display our sponsors

### Updated

-   Credits Command containing the devs that worked on VMod 0.7 and Newer
-   Domain, VMod dashboard will be https://vmod.xyz rather than https://dmod.dracy.xyz (The Subdomain will work just will redirect you to https://vmod.xyz)

### Removed

-   Kill Command it doesn't work no longer as intended

## 0.7.0-alpha.12 - NEVER RELEASED...

### Added

-   Verify command for welcome incidents channels.

### Fixed

-   rolename and username resolvers.
-   Grant command often did not apply permissions the first time it was used.
-   Column types in models; some needed a specific varchar set.
-   Members Stats whe being run being sharded

## 0.7.0-alpha.11 - 2020-07-30

### Deprecated

-   helpers.moderation.add; it will be replaced by a newly structured moderation system. Do not use this anymore; it will not work.

### Added

-   More stuff to the setup guide on the website.
-   "Discipline" model.
    -   More powerful moderation where each case has an associated collection of discipline records.
    -   This allows for issuing multiple discipline on the same case, and for issuing them at different times, and for appealing specific actions.
-   incidentsCategory to Guilds model for setting the category incidents channels will be created in.
-   helpers.incidents.createChannel for creating an incidents channel.
-   staff command.
-   grant command.
-   helpers.roles.add for adding a guildSettings role, and helpers.roles.remove for removing a guildSettings role.
-   helpers.uid for generating UIDs.

### Changed

-   guildChannel command parameter setNull changed to overrideChannel. Instead of a boolean, this is now a string. Specify a specific channel or category ID if you do not want to set the setting as the channel the command was executed in. Or, use "null" to specify you want to reset a setting.

### Fixed

-   Bug in helpers.permissions.checkRole.

## 0.7.0-alpha.10 - 2020-07-26

### Added

-   Moderation log counts on guild member joined and leave logs.
-   Duration spent in guild on guild member leave logs.

### Removed

-   Any mentions of the administrator role from the set-up guide; Discord plans to remove the capability for bots to have administrator.

### Fixed

-   Username update log, new username showed undefined.

## 0.7.0-alpha.9 - 2020-07-23

### Removed

-   suggest command; posed a sharding nightmare. Not worth fixing given there's a support server for this.

### Fixed

-   Instances of Client.channels.fetch were not shard compatible.

## 0.7.0-alpha.8 - 2020-07-22

### Added

-   Resources to start off the web portion of the bot.
-   Initial page.
-   stats/guilds, stats/members, stats/modlogs, and stats/version for getting stats on the webpage and elsewhere.

### Changed

-   Base URL will not depend on shard as initially planned; all shards will use the same URL load-balanced by NGINX.

## 0.7.0-alpha.7 - 2020-07-21

### Added

-   shardLimit property in config/custom.js
-   Welcome messages for new guilds.
-   baseURLs specific to shard.
-   Bot presence data resembles the guild's shard URL.

### Changed

-   Explanation of sharding in config/custom.js to be more clear.

## 0.7.0-alpha.6 - 2020-07-20

### Added

-   Channel delete logging via Guilds channelLogChannel.
-   Blacklist checking in guildCreate.
-   Message logging.
-   diff NPM package for message update.
-   Logging for changes in usernames, avatars, and presences (presences currently disabled as it generates too many messages).
-   Voice channel kicking when a member is muted or has disciplinary restriction.
-   channel command for setting channel settings for a guild.

## 0.7.0-alpha.5 - 2020-07-19

### Removed

-   [BREAKING] muteLogChannel property from guilds model.
-   [BREAKING] infractionSystem property from guilds model; we're just going to use vpts for simplicity.
-   [BREAKING] Client.settings; since Client is not a Discord structure, it does not work with sharding. Use the sails model directly instead, record id 1.

### Added

-   [UNTESTED] discipline.add helper function for issuing discipline against members.
-   Sharding (You MUST use "npm start" to activate the bot with sharding.).
-   indefiniteMute and indefiniteMuteThreshold properties to the antiraid model.
-   modLogChannel, vptDecayXP, and vptDecayHours properties to guilds model.
-   XP and coins properties to members model.
-   Reputation property to the profiles model.
-   assets/images/discipline for discipline thumbnails.

### Fixed

-   Guilds.disabledCommands defaulted to null when it should have defaulted to an empty array.

### Changed

-   [BREAKING] infractions property renamed to vpts property in members model.
-   Made embed posts by the bot more practical.

## 0.7.0-alpha.4 - 2020-07-12

### Added

-   Ban logging.
-   Kick logging.
-   Join logging.
-   Bot logging.

### Fixed

-   sails.helpers.guild.send.

## 0.7.0-alpha.3 - 2020-07-10

### Fixed

-   Sails.js does not like referencing other configs in another config; temporarily set origins to example.com.
-   Standardized embed outputs for commands.
-   Prune command fails completely if one delete fails. This was fixed with error count.
-   Help command now works.

### Changed

-   update.sh now stashes, then pulls, finally npm installs.
-   DiscordMenu class in util folder (old one did not work well).

## 0.7.0-alpha.2 - 2020-07-10

### Added

-   Migrated some more commands from 0.6.1.
-   Archive command: This command clones the channel used in and then strips away all permissions in the original channel.

### Fixed

-   Bot was not utilizing guild-based prefixes in 0.7.0-alpha.1. This was fixed.

### Changed

-   The prune command in 0.7.0 adds filtering functionality and (theoretically) the ability to delete messages older than 14 days, compared to 0.6.1 prune.

### Removed

-   0.6.1 nuke command in favor of 0.7.0 archive command.

## 0.7.0-alpha.1 - 2010-07-10

### Added

-   Changelog
-   Help command which dynamically takes data from other command files to generate a help embed.

### Changed

-   [BREAKING] Drago now uses the Sails.js framework with Discord.js plugged in. This allows for future development of web interfaces. All development from 0.6 and earlier is NOT compatible with 0.7.
-   Several of the commands from 0.6.x have been migrated to 0.7 (api/helpers/commands) with changes.
    -   Currently, commands do NOT support sub-folders nor aliases. Plans are to support this in the future.
    -   Currently, command parameters must be separated with a " | " or a double-space. A single space will not work. It is unknown if this will be fixed; single space separation causes problems for multiple string inputs.
    -   util/execProcess.js is available for commands that execute things in terminal / command prompt.
    -   Credits command has its own credits configurable object at the top to easily modify it without modifying the embed code.
-   Data is now stored via sails.models (api/models) and the waterline ORM. Each model represents a database table. Each model can also use its own database engine.
-   exec command is now execute command because exec is a reserved sails.js function.
-   eval command is now evaluate command because eval is a reserved Node.js function.
-   Default configuration is located in config/custom.js. Actual config values should be set in config/local.js. Do NOT commit local.js!
-   Code is being formatted with Prettier, and more care is being made to add comments and documentation.
-   Changelog command now utilizes this changelog file.

## 0.6.1 - 2020-07-04

### Added

-   [WIP] Suggest, where you can make a bot suggestion.
-   [WIP] Setup command to set up the bot and create the mute role.

### Changed

-   The changelog command may now be used by everyone.
-   You can now ban members that are not in the guild.
