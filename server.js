const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');


const TelegramBot = require('node-telegram-bot-api');
//E-das Token
const token = '1382962316:AAHI9DmkxWm0RfZsFBTKR_PMXJFSUai7i-E'
const bot = new TelegramBot(token, { polling: true });
exports.bot = bot;


var cron = require('node-cron');


const IMMOBILIARE = "\ud83d\udde3 Immobiliare.it"
const SUBITO = "\ud83d\udde3 Subito.it"
const CASE = "\ud83d\udde3 Case.it"
const IDEALISTA = "\ud83d\udde3 Idealista.it"



inline_keyboard = [];

const immobiliareLink = "https://www.immobiliare.it/vendita-case/selvazzano-dentro/?criterio=rilevanza&prezzoMinimo=50000&prezzoMassimo=140000&idMZona[]=11150&idMZona[]=11149&idMZona[]=11148"
const immobiliarePageNexts = "https://www.immobiliare.it/vendita-case/selvazzano-dentro/?criterio=rilevanza&prezzoMinimo=50000&prezzoMassimo=140000&idMZona[]=11150&idMZona[]=11149&idMZona[]=11148&pag="

const casaLink = "https://www.casa.it/vendita/residenziale/selvazzano-dentro?priceMin=40000&priceMax=140000&page="

const subitoUrl = "https://www.subito.it/annunci-veneto/vendita/appartamenti/padova/selvazzano-dentro/?q=casa&ps=50000&pe=130000"


// Here starts everything
bot.onText(/\/start/, (msg) => {
    var telegramUser = msg.from
    // Aggiorno il file 
    const usersFile = fs.readFileSync('users.txt').toString()
    if (!usersFile.includes(msg.chat.id)) {
        fs.writeFile('users.txt', usersFile + msg.chat.id + "\n", 'utf-8', function (err) {
            if (err) throw err;
            console.log('UsersAsinc complete');
        });
    }

    bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name + ", Notifiche On!", {
        "reply_markup": {
            "keyboard": [
                [IMMOBILIARE],
                [CASE],
                [SUBITO]
            ]
        }
    });
});


// Catch every messagge text 
bot.on('message', (msg) => {
    // Immobiliare.it
    if (msg.text.toString() === IMMOBILIARE) {
        var links = [];
        var contents = fs.readFileSync('immobiliare.txt', 'utf8');
        links = contents.split(/\r?\n/)
        // Check all the links if it is a new one
        var diff = (links.length - 10) <= 0 ? 0 : (links.length - 11);
        for (let index = diff; index < links.length; index++) {
            if (links[index] != "")
                bot.sendMessage(msg.chat.id, links[index])
        }
    }
    // Case.it
    else if (msg.text.toString() === CASE) {
        var links = [];
        var contents = fs.readFileSync('case.txt', 'utf8');
        links = contents.split(/\r?\n/)
        // Check all the links if it is a new one
        var diff = (links.length - 10) <= 0 ? 0 : (links.length - 11);
        for (let index = diff; index < links.length; index++) {
            if (links[index] != "")
                bot.sendMessage(msg.chat.id, links[index])
        }

    }
    // Subito.it
    else if (msg.text.toString() === SUBITO) {

        var links = [];
        var contents = fs.readFileSync('subito.txt', 'utf8');
        links = contents.split(/\r?\n/)
        // Check all the links if it is a new one
        var diff = (links.length - 10) <= 0 ? 0 : (links.length - 11);
        for (let index = diff; index < links.length; index++) {
            if (links[index] != "")
                bot.sendMessage(msg.chat.id, links[index])
        }
    }
    else {
        if (msg.text.toString() != "/start")
            bot.sendMessage(msg.chat.id, "Commando non riconosciuto!")
    }

})





/**




/**
 * CronTab Idealista.it
 */
cron.schedule("*/20 8-20 * * *", () => {


    // Immobiliare.it ##################################################################################################################

    var finaURL = ""

    for (let i = 1; i < 5; i++) {

        if (i > 1) {
            finaURL = immobiliarePageNexts + i.toString()
        }
        // first page
        else {
            finaURL = immobiliareLink
        }

        request(finaURL, (error, response, html) => {

            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];
                var img = []
                let main = $(".listing-item ").each(function () {
                    const t = $(this).find("a[data-row-link]")

                    if (t.attr('href') !== undefined && t.attr('href')) {


                        var elemento = t.attr('href')

                        links.push(elemento);
                    }
                    //   const y = $(this).find('div[data-role="foto-gallery"]').first().find("img")
                    //   img.push(y.attr("src"))
                });
                // Check all the links if it is a new one
                links.forEach(el => {
                    var contents = fs.readFileSync('immobiliare.txt', 'utf8');
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync('immobiliare.txt', contents + el + "\n", 'utf-8', function (err) {
                            if (err) throw err;
                        });


                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require('fs').createReadStream('users.txt')
                        });
                        lineReader.on('line', function (line) {
                            if (line !== "")
                                bot.sendMessage(line, el)
                        });

                    }

                })

            };

        });


    }





    // Casa.it ##################################################################################################################

    for (let i = 1; i < 5; i++) {

        request(casaLink + i.toString(), (error, response, html) => {

            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];

                let main = $("article").each(function () {
                    const t = $(this).find("a[title]")

                    if (t.attr('href') !== undefined && t.attr('href')) {


                        var elemento = t.attr('href')

                        links.push("www.casa.it" + elemento);
                    }

                });

                links.forEach(el => {
                    var contents = fs.readFileSync('case.txt', 'utf8');
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync('case.txt', contents + el + "\n", 'utf-8', function (err) {
                            if (err) throw err;
                        });



                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require('fs').createReadStream('users.txt')
                        });
                        lineReader.on('line', function (line) {
                            if (line !== "")
                                bot.sendMessage(line, el)
                        });


                    }

                })


            };

        });

    }









    // Subito.it ##################################################################################################################
    request(subitoUrl, (error, response, html) => {

        console.log(response.statusCode)
        if (!error && response.statusCode == 200) {

            const $ = cheerio.load(html);

            var links = [];

            let main = $("#layout > main > div.jsx-206193370 > div.jsx-206193370.container > div.jsx-206193370.col.items > div.jsx-59941399.container > div.jsx-59941399.items.visible > div").each(function () {
                const t = $(this).find("a[href]")


                if (t.attr('href') !== undefined && t.attr('href')) {


                    var elemento = t.attr('href')

                    links.push(elemento);
                }

            });

            links.forEach(el => {
                var contents = fs.readFileSync('subito.txt', 'utf8');
                // check if a line is not included
                if (contents.toString().indexOf(el.toString()) === -1) {
                    fs.writeFileSync('subito.txt', contents + el + "\n", 'utf-8', function (err) {
                        if (err) throw err;
                    });


                    // Send bradcast
                    var lineReader = readline.createInterface({
                        input: require('fs').createReadStream('users.txt')
                    });
                    lineReader.on('line', function (line) {
                        if (line !== "")
                            bot.sendMessage(line, el)
                    });


                }

            })

        }

    })



});
































