const User = require('../models/User');
const Item = require('../models/Item');

// Verify user ID
exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isVerified = req.body.isVerified;
        await user.save();
        res.json({ message: 'User verification updated' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

// Verify claim
exports.verifyClaim = async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId);
        const claim = item.claims.id(req.params.claimId);
        claim.claimStatus = req.body.claimStatus;
        await item.save();
        res.json({ message: 'Claim status updated' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};
