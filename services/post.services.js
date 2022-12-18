const PostModel = require("../models/signals");

const createNotification = ({ postId, authorId, userId }) => {
  return {
    userId: authorId,
    title: `Your post has been liked by user ${userId}`,
    type: "signal",
    meta: {
      id: postId,
    },
  };
};

module.exports = {
  createNotification,
};