import {
    getModelForClass,
    ModelOptions,
    prop,
    Severity,
} from "@typegoose/typegoose";

@ModelOptions({
    options: {
        allowMixed: Severity.ALLOW,
    },
})
class GuildSchema {
    @prop({ required: true })
    public guildID: string;
    @prop({
        default: {
            verificationLoggingChannelID: null,
            pendingVerificationChannelID: null,
            welcomeChannelID: null,
            verifiedRolesID: null,
            unverifiedRolesID: null,
            welcomeRoleID: null,
            verificationWelcomeMessage: null,
            verificationInstruction: null,
        },
    })
    public verification: IVerificationaInterface;
}

export interface IVerificationaInterface {
    verificationLoggingChannelID: string | null;
    pendingVerificationChannelID: string | null;
    welcomeChannelID: string | null;
    verifiedRolesID: string[] | null;
    unverifiedRolesID: string[] | null;
    welcomeRoleID: string | null;
    verificationWelcomeMessage: string | null;
    verificationInstruction: string | null;
}

export const Guild = getModelForClass(GuildSchema);
