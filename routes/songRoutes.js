const isAuthorized = require("../middlewares/auth");

const router = require("express").Router();
const Song = require("../models/songModel");

const songsData = async () => {
  const apiKey = process.env.API_KEY;
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=india&api_key=${apiKey}&format=json`,
    {
      method: "GET",
    }
  );
  return response.json();
};

require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const songs = await songsData();

    return res.status(200).json({ songs });
  } catch (error) {
    console.log("<<<<<<<<<", error);
    return res.status(500).json({ error });
  }
});

router.get("/search", async (req, res) => {
  try {
    // Search for songs by query from MongoDB
    const songs = await Song.find({
      $or: [
        { name: { $regex: `${req.query.name}`, $options: "i" } },
        { artist: { $regex: `${req.query.artist}`, $options: "i" } },
      ],
    });

    return res.status(200).json({ songs });
  } catch (error) {
    console.log("<<<<<<<<<", error);
    return res.status(500).json({ error });
  }
});

router.get("/:songID", async (req, res) => {
  try {
    const song = await Song.findOne({
      _id: req.params.songID,
    });

    if (!song) {
      return res.status(404).send("Song not found");
    }

    return res.status(200).json({ song });
  } catch (error) {
    console.log("<<<<<<<<<", error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
