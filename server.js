const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());
const mongoose = require("mongoose");
server.use(express.json());
mongoose.connect(process.env.URL);
const PORT = process.env.PORT;

server.get("/getAPI", getApiHandler);
function getApiHandler(req, res) {
  let ApiUrl = "https://fruit-api-301.herokuapp.com/getFruit";
  axios
    .get(ApiUrl)
    .then((result) => {
      res.send(result.data.fruits);
    })
    .catch((error) => {
      console.log(error);
    });
}

const fruitSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: String,
  email: String,
});
const fruitModel = mongoose.model("fruitModel", fruitSchema);

server.post("/addFruit", addHandler);

async function addHandler(req, res) {
  const { name, image, price, email } = req.body;
  console.log(email);
  fruitModel.create({
    name: name,
    image: image,
    price: price,
    email: email,
  });
  fruitModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
}

server.get("/getFruit", getFruitHandler);
async function getFruitHandler(req, res) {
  const email = req.query.email;
  fruitModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
}

server.delete("/deleteFruit/:id", deleteFruitHandler);
async function deleteFruitHandler(req, res) {
  const fruitId = req.params.id;
  const email = req.query.email;
  fruitModel.deleteOne({ _id: fruitId }, (err, result) => {
    fruitModel.find({ email: email }, (err, result) => {
      if (err) {
        console.log(error);
      } else {
        res.send(result);
      }
    });
  });
}
server.put("/updateFruit/:id", updateFruitHandler);
async function updateFruitHandler(req, res) {
  const fruitId = req.params.id;
  const { name, image, price, email } = req.body;
  fruitModel.findByIdAndUpdate(
    fruitId,
    { name, image, price },
    (err, result) => {
      fruitModel.find({ email: email }, (err, result) => {
        if (err) {
          console.log(error);
        } else {
          res.send(result);
        }
      });
    }
  );
}

server.listen(PORT, () => console.log(`listen on ${PORT}`));
