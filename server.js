'use strict';


const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/digimon', { useNewUrlParser: true, useUnifiedTopology: true });

const digimonSchema = new mongoose.Schema({

    name: String,
    img: String,
    level: String,
})

const digimonArr = mongoose.model('poki', digimonSchema);

// // http://localhost:3001/
// server.get('/',getHandeler);

// get data from api
// http://localhost:3001/getData
server.get('/getData', getDataHandler);

// add fav digimon to dataBase
// http://localhost:3001/postData
server.post('/postData', postDataHandler);

// get fav digimon from databas
// http://localhost:3001/getFavData
server.get('/getFavData', getFavDataHandler);

// http://localhoset:3001/deleteData/
server.delete('/deleteData/:id', deleteDataHandler);

// http://localhost:3001/updateData/
server.put('/updateData/:id', updateDataHandler);


function updateDataHandler(req, res) {
    const id = req.params.id;

    const { nameDigimon, imgDigimon, levelDigimon } = req.body;

    digimonArr.findOne({ _id: id }, (error, data) => {

        data.name = nameDigimon;
        data.img = imgDigimon;
        data.level = levelDigimon;

        data.save().then(() => {
            digimonArr.find({}, (error, newData) => {
                res.send(newData)
            })
        })
    })

}

function deleteDataHandler(req, res) {
    const id = req.params.id;

    digimonArr.remove({ _id: id }, (error, data) => {
        digimonArr.find({}, (error, newData) => {
            res.send(newData);
        })
    })
}

function getFavDataHandler(req, res) {

    digimonArr.find({}, (err, data) => {
        res.send(data);
    })
}


function postDataHandler(req, res) {

    const { name, img, level } = req.body;

    const newDigimon = new digimonArr({
        name: name,
        img: img,
        level: level,

    })

    newDigimon.save();
}


function getDataHandler(req, res) {

    const url = `https://digimon-api.vercel.app/api/digimon`;
    axios
        .get(url)
        .then(result => {
            const DigimonArray = result.data.map((digimon, idx) => {
                // console.log(digimon);
                return new Digimon(digimon);
            })
            res.send(DigimonArray);
        })

}

// function getHandeler(req,res){
//     res.send('hello from root route')
// }

class Digimon {

    constructor(digimon) {
        this.name = digimon.name;
        this.img = digimon.img;
        this.level = digimon.level;
    }
}


server.listen(PORT, () => {
    console.log(`listing from PORT ${PORT}`);
})

