let express = require("express");
let fs = require("fs");
let path = require("path");

let app = express();
let port = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html/typer.html"));
});

app.get("/leaderboard", (req, res) => {
  res.sendFile(path.join(__dirname, "html/leaderboard.html"));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "html/settings.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "html/about.html"));
});

app.get("/main.js", (req, res) => {
  res.sendFile(path.join(__dirname, "main.js"), {
    headers: {
      "Content-Type": "text/javascript",
    },
  });
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles/style.css"), {
    headers: {
      "Content-Type": "text/css",
    },
  });
});

app.get("/topbar.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles/topbar.css"), {
    headers: {
      "Content-Type": "text/css",
    },
  });
});

app.get("/settings_bar.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles/settings_bar.css"), {
    headers: {
      "Content-Type": "text/css",
    },
  });
});

app.get("/game_result.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles/game_result.css"), {
    headers: {
      "Content-Type": "text/css",
    },
  });
});

/////////////////////  GET DATA /////////////////////

app.get("/data", (req, res) => {
  const category = req.query.category;
  let data = "data/" + category + ".json";

  fs.readFile(data, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file.");
      return;
    }
    try {
      let jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (error) {
      console.error("error", error.message);
    }
  });
});

/////////////////////  GET RESULTS /////////////////////

app.get("/getScores", (req, res) => {
  let data = "data/results.json";

  fs.readFile(data, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file.");
      return;
    }
    try {
      let jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (error) {
      console.error("error", error.message);
    }
  });
});

/////////////////////  POST RESULTS /////////////////////

app.post("/postScore", (req, res) => {
  const score = req.body;

  fs.readFile("data/results.json", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    let scores = [];
    if (data.length > 0) {
      scores = JSON.parse(data);
    }

    scores.push(score);

    fs.writeFile("data/results.json", JSON.stringify(scores), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Score appended to results.json");
      res.status(200).send("Score added successfully");
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
