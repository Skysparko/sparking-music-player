const router = require("express").Router();

const isAuthorized = require("../middlewares/auth");
const Playlist = require("../models/playlistModel");

router.post("/", isAuthorized, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userID = req.user.id;

    if (!name || !description) {
      return res.status(400).send("please enter all the requried fields");
    }

    const playlistData = {
      name,
      description,
      userID,
    };

    const playlistDB = new Playlist(playlistData);
    await playlistDB.save();

    return res.status(201).json({ playlistDB });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.get("/", isAuthorized, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userID: req.user.id });

    return res.status(200).json({ playlists });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.get("/:id", isAuthorized, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!playlist) {
      return res.status(404).send("playlist not found");
    }

    return res.status(200).json({
      playlist,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.put("/:id", isAuthorized, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).send("please fill all the required fields");
    }

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!playlist) {
      return res.status(404).send("playlist not found");
    }

    playlist.name = name;
    playlist.description = description;
    playlist.save();
    return res.status(200).json({ playlist });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.delete("/:id", isAuthorized, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!playlist) {
      return res.status(404).send("playlist not found");
    }

    playlist.deleteOne();
    return res.status(200).send("playlist deleted sucessfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.post("/:id/songs", isAuthorized, async (req, res) => {
  try {
    const { songID } = req.body;

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!songID) {
      return res.status(400).send("please fill the required fields");
    }

    if (!playlist) {
      return res.status(404).send("playlist not found");
    }

    await playlist.update({
      $push: {
        songIDs: songID,
      },
    });

    console.log(playlist.songIDs);

    return res.status(200).send("song Added");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.delete("/:id/songs", isAuthorized, async (req, res) => {
  try {
    const { songID } = req.body;
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });

    if (!songID) {
      return res.status(400).send("please fill the required fields");
    }

    if (!playlist) {
      return res.status(404).send("playlist not found");
    }

    const index = playlist.songIDs.indexOf(songID);
    if (index <= -1) {
      return res.status(404).send("song not found in playlist");
    }

    playlist.songIDs.splice(index, 1);
    playlist.save();

    return res.status(200).json({ songID: playlist.songIDs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;
