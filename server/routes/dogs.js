// ------------------------------  SERVER DATA ------------------------------

let nextDogId = 1;
function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const dogs = [
  {
    dogId: getNewDogId(),
    name: "Fluffy"
  },
  {
    dogId: getNewDogId(),
    name: "Digby"
  }
];

// ------------------------------  MIDDLEWARES ------------------------------

const validateDogInfo = (req, res, next) => {
  if (!req.body || !req.body.name) {
    const err = new Error("Dog must have a name");
    err.status = 400;
    next(err);
  }
  next();
};
const validateDogId = (req, res, next) => {
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  if (!dog) {
    const err = new Error("Couldn't find dog with that dogId")
    err.status = 404;
    throw err;
    // return next(err); // alternative to throwing it
  }
  next();
}

// ------------------------------  ROUTE HANDLERS ------------------------------

// GET /dogs
const getAllDogs = (req, res) => {
  res.json(dogs);
};

// GET /dogs/:dogId
const getDogById = (req, res) => {
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  res.json(dog);
}

// POST /dogs
const createDog = (req, res) => {
  const { name } = req.body;
  const newDog = {
    dogId: getNewDogId(),
    name
  };
  dogs.push(newDog);
  res.json(newDog);
};

// PUT /dogs/:dogId
const updateDog = (req, res) => {
  const { name } = req.body;
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  dog.name = name;
  res.json(dog);
};

// DELETE /dogs/:dogId
const deleteDog = (req, res) => {
  const { dogId } = req.params;
  const dogIdx = dogs.findIndex(dog => dog.dogId == dogId);
  dogs.splice(dogIdx, 1);
  res.json({ message: "success" });
};

// ------------------------------  ROUTER ------------------------------

// Your code here
const food = require("./dog-foods");
const express = require("express");
const router = express.Router();

router.use("/:dogId", validateDogId);

router.get("/", getAllDogs);

router.get("/:dogId", getDogById);

router.post("/", validateDogInfo, createDog);

router.put("/:dogId", validateDogInfo, updateDog);

router.delete("/:dogId", deleteDog);

// uses lower level router to nest route and a middleware can be passed into the next router
router.use("/:dogId/foods", validateDogId, food);

module.exports = router;
