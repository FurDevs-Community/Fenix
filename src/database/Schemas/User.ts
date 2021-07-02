const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        require: true,
        unique: true,
    },
    usernameTag: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    guilds: {
        type: Array,
        required: true,
    },
});

interface IUser extends Document {
    userID: String;
    usernameTag: String;
    avatar: String;
    guilds: Array<any>;
}

export const User = mongoose.model('User', UserSchema);
