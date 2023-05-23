const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeUserData(key, website) {
    console.log("API Call")
    const url = 'https://www.fussball.de/widget2/-/schluessel/' + key + '/target/widget1/caller/' + website;

    try {

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);


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
    } catch(error) {
        console.log("Error in scrapeData()")
        return JSON.parse('{}');
    }
}



module.exports.returnAPI = async (req, res) => {
    const key = req.params.key;
    const website = req.params.website;
    const data = await scrapeUserData(key, website)
    if (data.length === 0) {
        console.log("Error occurred on the user's side")
        res.json({errorCode : "no data found"})
        return;
    }
    console.log("Send JSON data")
    res.json(data);
}

module.exports.viewAPI = async (req, res) => {
    const key = req.params.key;
    const website = req.params.website;
    const data = await scrapeUserData(key, website)
    if (data.length === 0) {
        console.log("Error occurred on the user's side")
        res.send("Überprüfe die URL. Es konnten keine Daten von Fußball.de gefunden werden!")
        return;
    }
    const tableRows = data.map(item => `<tr><td>${item.position}</td><td> <img src="${item.logo}"></td><td>${item.clubName}</td><td>${item.gamesPlayed}</td><td>${item.goalDiff}</td><td>${item.points}</td></tr>`).join('');
    const table = `<table>${tableRows}</table>`;
    console.log("Display table")
    res.send(table);
}

module.exports.fetcher = async (req, res) => {
    const key = req.body.key;
    const website = req.body.website;
    const data = await scrapeUserData(key, website);
    if (data.length === 0) {
        console.log("Error occurred on the user's side")
        res.json({
            success: false
        });
    } else {
        console.log("Send API link to user")
        res.json({
            success: true
        });
    }
}

