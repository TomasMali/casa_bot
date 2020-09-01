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


const EDAS = "\ud83d\udde3 E-Das_HTML_format"
const APRI_CANCELLO_2 = "\ud83d\udde3 Apri cancello 2"


inline_keyboard = [];



function getNewAnnunci($) {

    var links = [];
    var img = []
    let main = $(".listing-item ").each(function () {
        const t = $(this).find("a[data-row-link]")
        if(t.attr('href'))
        links.push(t.attr('href'));
     //   const y = $(this).find('div[data-role="foto-gallery"]').first().find("img")
     //   img.push(y.attr("src"))
    });
}





// Here starts everything
bot.onText(/\/start/, (msg) => {
    var telegramUser = msg.from
    //  $.sendMessage("Utente (" + telegramUser.firstName + " " + telegramUser.lastName + ")  " + body.message)

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
                [EDAS]
            ]
        }
    });
});


// Catch every messagge text 
bot.on('message', (msg) => {

    if (msg.text.toString() === EDAS) {
        request('https://www.immobiliare.it/vendita-case/selvazzano-dentro/?criterio=rilevanza&prezzoMinimo=50000&prezzoMassimo=140000&idMZona[]=11150&idMZona[]=11149&idMZona[]=11148', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];
                var img = []
                let main = $(".listing-item ").each(function () {
                    const t = $(this).find("a[data-row-link]")
                    if(t.attr('href'))
                    var elemento = t.attr('href')
                    links.push(elemento);
                 //   const y = $(this).find('div[data-role="foto-gallery"]').first().find("img")
                 //   img.push(y.attr("src"))
         
                });

        //        console.log(links)


                for (let i = 0; i<links.length; i++){
                    const annunciFile = fs.readFileSync('annunci.txt').toString()
                    if (annunciFile.indexOf(links[i]) === -1) {
                        console.log(links[i])
                        fs.writeFile('annunci.txt', annunciFile + links[i] + "\n", 'utf-8', function (err) {
                            if (err) throw err;
                            console.log('UsersAsinc complete');
                        });
                    }
                }

               
                

                //    bot.sendMessage(msg.chat.id, links[0])
            };
            console.log('Scraping Done...');
        });
    }
    else {
        if (msg.text.toString() != "/start")
            bot.sendMessage(msg.chat.id, "Commando non riconosciuto!")
    }

})


/**
 * Crontab Job Scheduler
 */
cron.schedule('*/20 8-20 * * 1-5', () => {

    console.log('running a task 5 minutes');

    request('https://www.adm.gov.it/portale/dogane/operatore/servizi-online/servizio-telematico-doganale-e.d.i./web-service/webservice-ambienteprova#sez-daselettronico', (error, response, html) => {
        if (!error && response.statusCode == 200) {

            const $ = cheerio.load(html);
            let main = $('ul').eq(5)

            const fileContents = fs.readFileSync('content.txt').toString()
            // se ci sono modifiche
            if (fileContents.replace(/\s/g, '') !== main.html().replace(/\s/g, '')) {
                // Send bradcast
                var lineReader = readline.createInterface({
                    input: require('fs').createReadStream('users.txt')
                });
                lineReader.on('line', function (line) {
                    if (line !== "")
                        bot.sendMessage(line, main.html())
                });

                // Aggiorno il file 
                fs.writeFile('content.txt', main.html(), 'utf-8', function (err) {
                    if (err) throw err;
                    console.log('filelistAsync complete');
                });
            }
        }
        else
            bot.sendMessage(145645559, "Controlla il Link delle Dogane")
    })

});
























