const {
    createNotification,
  } = require("../services/post.services");
  const sse = require("../sse");
  
  const updateReactionController = async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    const result = await updatePostReaction(postId, userId);
    res.status(result.statusCode).json(result);
    if (!result.error) {
      const post = result.data[0];
      const data = { liker: userId, post };
      // emit post_reaction event to all users
      sse.send(data, "post_reaction");
      // send notification to the post author
      if (post.userId !== userId) {
        const authorId = post.userId;
        const _notif = createNotification({ postId, userId, authorId });
        // emit notification_{userId} to the post author
        sse.send(_notif, `notification-${authorId}`);
      }
    }
  };
  
  module.exports = {
    updateReactionController,
  };