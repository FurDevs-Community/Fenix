import {exec} from "child_process";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import FenixClient from "../../lib/FenixClient";
import BaseSlashCommand from "../../structures/BaseInteraction";

export default class ExecCommand extends BaseSlashCommand {
  constructor(client: FenixClient) {
    super(client, {
      name: "exec",
      shortDescription: "Execute terminal stuff!",
      args: [
        {
          name: "command",
          description:
                        "Command you would want the execute command to run",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      cooldown: 0,
      userPermissions: [],
      botPermissions: [],
      type: ApplicationCommandType.ChatInput,
      ownerOnly: true,
    });
  }
  async run(interaction: ChatInputCommandInteraction) {
    // Checking 3 times in a row because just in case
    if (interaction.user.id !== "852070153804972043") {
      return interaction.reply(
          "Dunno how you got through all the checkings before this but you know damn well you're not suppose to do that",
      );
    }

    const script = interaction.options.getString("command", true);
    if (!script) {
      throw new Error("Please provide a command for me to execute");
    }
    // Disallow certain scripts to be ran
    if (
      script.toLowerCase().includes("/.|.&/") ||
            script.toLowerCase().includes("mkdir") ||
            script.toLowerCase().includes("restart/*  */") ||
            script.toLowerCase().includes("reboot") ||
            script.toLowerCase().includes("shutdown") ||
            script.toLowerCase().includes("rm")
    ) {
      throw new Error(
          "mkdir, restart, reboot, shutdown, rm, and dot based directory structures are not permitted.",
      );
    }

    // Execute the command

    exec(`${script}`, async (error, stdout) => {
      const response = error || stdout;
      try {
        const embed = new EmbedBuilder()
            .setAuthor({
              name: interaction.user.tag,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle("Execute")
            .setDescription(
                `**Ran: \`\`\`${script}\`\`\`**\n\`\`\`js\n${response.toString()} \n\`\`\``,
            )
            .setThumbnail(this.client!.user?.displayAvatarURL()!)
            .setTimestamp()
            .setFooter({
              text: `User ID: ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setColor(0xaa00ae);
        // Sends the embed with the response embed in it... Get it?
        await interaction.reply({embeds: [embed]});
      } catch (e) {
        throw new Error(`${e}`);
      }
    });
  }
}
