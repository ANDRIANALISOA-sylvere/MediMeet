const Message = require("../models/Message.model");
const getAllMessages = async (req, res) => {
  try {
    const { userId, doctorId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: doctorId },
        { senderId: doctorId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages", error });
  }
};

module.exports = {
  getAllMessages,
};
