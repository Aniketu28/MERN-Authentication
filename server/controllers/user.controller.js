const userModel = require('../models/user.model');


const getUserData = async (req, res) => {

    const userId  = req.userId;

    try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'user not found' });
        }

        return res.json({ success: true, userName: user.name, isverified: user.isVerified });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}

module.exports = getUserData;

