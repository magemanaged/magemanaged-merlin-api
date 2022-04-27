require('dotenv').config();
const express = require ('express');
const router = express.Router();
const standardGreetings = [
    "Have a great day!",
    "Enjoy your day!",
    "Time to kick butt!",
    "Nice to see you.",
    "How's it going?",
    "Make today magical!",
]

router.get('/',
    (req, res) => {
        res.send({greeting: getGreeting(null)});
    })


const getGreeting = (content) => {
    if(content) {

    }
    else {
        return standardGreetings[Math.floor(Math.random() * standardGreetings.length)]
    }
}

module.exports = router;
