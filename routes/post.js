const router = require("express").Router();
const { PrismaClient, prisma } = require("@prisma/client");

const { user, post } = new PrismaClient();

router.post("/", async (req, res) => {
  const { title, content, user_id } = req.body;

  const userExists = await user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!userExists) {
    return res.status(400).json({
      msg: "user not found",
    });
  }

  const newPost = await post.create({
    data: {
      title,
      post: content,
      user_id,
    },
  });

  res.json(newPost);
});

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const posts = await post.findMany({
    where: {
      user_id: parseInt(user_id),
    },
    select: {
      title: true,
      created_at: true,
      post: true,
      user: true,
    },
  });

  if (!posts)
    return res.status(400).json({
      msg: "no posts founded",
    });

  return posts;
});

module.exports = router;
