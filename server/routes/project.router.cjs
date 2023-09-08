const query = require("../queries/project.query.cjs");

const express = require("express");
const {
  requireAuthenticationMiddleware,
} = require("../middlewares/auth.middleware.cjs");

const router = express.Router();

/** 
@api {POST} /api/project Create a new project and set its zip code
@apiBody {Object} body The user’s zip code: {“zipCode”: <String>, "userId"; <Number>}
@apiSuccess {Object} response The project ID: {“id”: <Number>}
*/

router.post("/", requireAuthenticationMiddleware, async (req, res) => {
  try {
    await query.addZipCode(req.body);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
