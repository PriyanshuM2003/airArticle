const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchware");
const { body, validationResult } = require("express-validator");
const Article = require("../models/Article");

//* Get all articles. Using GET"api/articles/fetchallarticles" login required
router.get("/fetchallarticles", async (req, res) => {
  try {
    const { category } = req.query;
    const articles = category
      ? await Article.find({ category: category }).populate("user", "name")
      : await Article.find({}).populate("user", "name");
    res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// * Article like/unlike
router.get("/likestate/:id", fetchuser, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    const userId = req.user.id;
    const likedByUser = article.likedBy.some(
      (like) => like.user.toString() === userId && like.liked === true
    );
    res.json({ liked: likedByUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//* Toggle like/unlike for an article
router.post("/togglelike/:id", fetchuser, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    const userId = req.user.id;
    const alreadyLikedIndex = article.likedBy.findIndex(
      (like) => like.user.toString() === userId
    );
    if (alreadyLikedIndex !== -1) {
      article.likedBy[alreadyLikedIndex].liked =
        !article.likedBy[alreadyLikedIndex].liked;
    } else {
      article.likedBy.push({ user: userId, liked: true });
    }
    article.likesCount = article.likedBy.filter((like) => like.liked).length;
    await article.save();
    res.json({
      liked:
        alreadyLikedIndex === -1
          ? true
          : article.likedBy[alreadyLikedIndex].liked,
      likesCount: article.likesCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// * Get searched query result
router.get("/search", async (req, res) => {
  const { title } = req.query;

  try {
    if (!title) {
      return res.status(400).json({ error: "title parameter is required" });
    }

    const articles = await Article.find({
      title: { $regex: new RegExp(title, "i") }
    }).populate("user", "name");
    res.json(articles);
  } catch (error) {
    console.error("Error searching articles:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//* Get looged users all articles. Using GET"api/articles/fetchloggeduserarticles" login required
router.get("/fetchloggeduserarticles", fetchuser, async (req, res) => {
  try {
    const articles = await Article.find({ user: req.user.id });
    res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//* Adding articles. Using POST"api/articles/addarticles" login required
router.post(
  "/addarticle",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength(),
    body("description", "Enter your description").isLength(),
  ],
  async (req, res) => {
    try {
      const { title, description, category } = req.body;

      //* To check errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const article = new Article({
        title,
        description,
        category,
        user: req.user.id,
      });

      const savedArticle = await article.save();

      res.json(savedArticle);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//* Updating existing article. Using PUT"api/articles/updatearticle" login required
router.put("/updatearticle/:id", fetchuser, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    //* creating a newArticle object
    const newArticle = {};
    if (title) {
      newArticle.title = title;
    }
    if (description) {
      newArticle.description = description;
    }
    if (category) {
      newArticle.category = category;
    }

    //* Finding the article to be updated and updating it
    let article = await Article.findByIdAndUpdate(req.params.id);
    if (!article) {
      res.status(404).send("Not Found");
    }
    if (article.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: newArticle },
      { new: true }
    );
    res.json({ article });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//* Deleting existing article. Using DELETE"api/articles/deletearticle" login required
router.delete("/deletearticle/:id", fetchuser, async (req, res) => {
  try {
    //* Finding the article to be deleted and deleting it
    let article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      res.status(404).send("Not Found");
    }

    //* Allow deletion only if user owns this article
    if (article.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    article = await Article.findByIdAndDelete(req.params.id);
    res.json({ Success: "Article has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
