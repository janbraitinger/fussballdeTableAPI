const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require("path");
const app = express();

app.set('views', './views');
app.use(express.static('public'));

app.use(express.json());




async function scrapeUserData(key, website) {
    console.log("Request number " + number);
    number++;
    const url = 'https://www.fussball.de/widget2/-/schluessel/' + key + '/target/widget1/caller/' + website;

    try {

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);


        // Extrahieren der Daten aus der HTML-Tabelle
        const data = [];
        $('tbody tr').each(function(index) {
            const $tds = $(this).find('td');
            const position = index + 1;
            const $clubWrapper = $tds.eq(2).find('.club-wrapper');
            const clubName = $clubWrapper.find('.club-name').text().trim();
            const gamesPlayed = $tds.eq(3).text().trim();
            const goalDiff = $tds.eq(4).text().trim();
            const points = $tds.eq(5).text().trim();
            const imgUrl = $clubWrapper.find('.club-logo img').attr('src');
            const logo = imgUrl.replace(/^\/\//, 'https://');

            data.push({
                position,
                clubName,
                gamesPlayed,
                goalDiff,
                points,
                logo,
            });
        });

        return data;
    } catch {
        return JSON.parse({});
    }
}


app.post('/newAPI', async (req, res) => {
    const key = req.body.key;
    const website = req.body.website;
    const data = await scrapeUserData(key, website);
    if (data.length === 0) {
        res.json({
            success: false
        });
    } else {
        res.json({
            success: true
        });
    }
    
  });
  



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})



var number = 1
app.get('/show/:key/:website', async (req, res) => {

    const key = req.params.key;
    const website = req.params.website;
    const data = await scrapeUserData(key, website)
    const tableRows = data.map(item => `<tr><td>${item.position}</td><td> <img src="${item.logo}"></td><td>${item.clubName}</td><td>${item.gamesPlayed}</td><td>${item.goalDiff}</td><td>${item.points}</td></tr>`).join('');
    const table = `<table>${tableRows}</table>`;
    res.send(table);
});


app.get('/:key/:website', async (req, res) => {
    const key = req.params.key;
    const website = req.params.website;
    const data = await scrapeUserData(key, website)
    res.json(data);
});




// Starten des Servers auf Port 3000
app.listen(3001, () => {
    console.log('Server started on port 3001');
});