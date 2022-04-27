require('dotenv').config();
const express = require ('express');
const mongoose = require ('mongoose');
const Position = mongoose.model('Position');
const { getIssue, createPosition } = require('../auth/Jira')
const router = express.Router();

router.post('/',
    (req, res, next) => {
        const positionTitle = req.body.position_title;
        const currentDate = Date.now();
        console.log(req.body);
        var position = new Position({
            positionName: positionTitle,
            startDate: req.body.start_date,
            city: req.body.city_location,
            editHistory : {
                user: {
                    name : req.body.user_name,
                    azObjID : req.body.user_id 
                },
                editDate: currentDate,
            }
        })
        console.log(`Creating Jira task for new position: ${positionTitle}`);
        createPosition(req.body).then(response => {
            console.log(response);
          console.log(`Jira task with id ${response.id} created`);
          position.jiraLink = response;
        });
        console.log(`Adding a new position ${positionTitle} - createDate ${currentDate}`);
        position.save().then(() => {
            console.log(`Added position ${positionTitle} - createDate ${currentDate}`);
            res.status(200);
            res.send();
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Sorry! Something went wrong.');
        })
    }
);

router.get('/',
    (req, res) => {
        Position.find({}).then((positions) => {
            res.send(positions);
        })
    })

async function test() {
  //getIssue(19865)
}

router.delete('/',
(req, res) => {
    console.log("received")
    Position.deleteOne({
        "_.id": req.body._id
    }).then(() => {
        console.log("DELETED")
        res.status(200);
        res.send();
    })
})

module.exports = router;