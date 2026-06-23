const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserWalletSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    amount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const UserWallet = mongoose.model('UserWallet', UserWalletSchema);
module.exports = UserWallet;