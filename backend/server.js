/*
....###....##....##.########..########..########..######.
...##.##...###...##.##.....##.##.....##.##.......##....##
..##...##..####..##.##.....##.##.....##.##.......##......
.##.....##.##.##.##.##.....##.########..######....######.
.#########.##..####.##.....##.##...##...##.............##
.##.....##.##...###.##.....##.##....##..##.......##....##
.##.....##.##....##.########..##.....##.########..######.
*/ 
const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = 3000
const cors = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash');
const axios = require('axios');
const apiKey = "8e947815f384fcb9147fa6e4657a4b45cd8345368b9249d3707da8c63c08ced0";
const apiUrl = "https://api.webflow.com/collections/5e74d1a9ef2235c09ec7d619";
let settings = {
	method: "Get",
	headers: {
		'Authorization': `Bearer ${apiKey}`,
		'Content-Type': 'application/x-www-form-urlencoded',
		'accept-version': '1.0.0'
	}
};
app.use(cors());
app.use(bodyParser.urlencoded({
	limit: '10mb',
	extended: true
}))

// Get data function
app.get('/allData', function (req, res) {
	getData().then(results => {
		res.send(results);
	}).catch(() => console.log("REJECTED"));;
})

// Get data of api call
let getData = () => {
	return new Promise(function (resolve, reject) {
		axios.get(apiUrl + '/items', settings)
			.then((json) => {
				let results = json.data.items;
				resolve(results);
			})
	});
}

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))