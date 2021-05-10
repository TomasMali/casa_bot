const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const readline = require("readline");

const TelegramBot = require("node-telegram-bot-api");
//E-das Token
const token = "1382962316:AAHI9DmkxWm0RfZsFBTKR_PMXJFSUai7i-E";
const bot = new TelegramBot(token, { polling: true });
exports.bot = bot;

var cron = require("node-cron");
const { time } = require("console");

const IMMOBILIARE = "\ud83d\udde3 Immobiliare.it";
const SUBITO = "\ud83d\udde3 Subito.it";
const CASE = "\ud83d\udde3 Case.it";
const IDEALISTA = "\ud83d\udde3 Idealista.it";

inline_keyboard = [];

// Imobiliare
const immobiliareLink =
    "https://www.immobiliare.it/vendita-case/selvazzano-dentro/?criterio=rilevanza&prezzoMinimo=50000&prezzoMassimo=190000&superficieMinima=100&idMZona[]=11150&idMZona[]=11149&idMZona[]=11148&idMZona[]=104&idMZona[]=105";
const immobiliarePageNexts =
    "https://www.immobiliare.it/vendita-case/selvazzano-dentro/?criterio=rilevanza&prezzoMinimo=50000&prezzoMassimo=190000&superficieMinima=100&idMZona[]=11150&idMZona[]=11149&idMZona[]=11148&idMZona[]=104&idMZona[]=105&pag=";

const immobiliareAbanoLink =
    "https://www.immobiliare.it/ricerca.php?idCategoria=1&idContratto=1&idTipologia%5B0%5D=7&idTipologia%5B1%5D=12&idTipologia%5B2%5D=13&idNazione=IT&idRegione=ven&idProvincia=PD&idComune=12078&prezzoMinimo=50000&prezzoMassimo=190000&superficieMinima=100&criterio=rilevanza&ordine=desc&pag=1&idMZona[]=18000&idMZona[]=18001&idMZona[]=18002&idMZona[]=18003&idMZona[]=18004&idMZona[]=18005&idMZona[]=18006&idMZona[]=18007";
const immobiliareAbanoPageNexts =
    "https://www.immobiliare.it/ricerca.php?idCategoria=1&idContratto=1&idTipologia%5B0%5D=7&idTipologia%5B1%5D=12&idTipologia%5B2%5D=13&idNazione=IT&idRegione=ven&idProvincia=PD&idComune=12078&prezzoMinimo=50000&prezzoMassimo=190000&superficieMinima=100&criterio=rilevanza&ordine=desc&pag=1&idMZona[]=18000&idMZona[]=18001&idMZona[]=18002&idMZona[]=18003&idMZona[]=18004&idMZona[]=18005&idMZona[]=18006&idMZona[]=18007&pag=";

// Casa.it
const casaLink =
    "https://www.casa.it/vendita/residenziale/selvazzano-dentro?priceMin=40000&mqMin=100&priceMax=190000&page=";
const casaLinkPadovaAnche =
    "https://www.casa.it/srp/?tr=vendita&mqMin=100&priceMin=40000&priceMax=190000&propertyTypeGroup=case&q=7bdd3da8%2C64f24246%2Cdcbe6f3c%2C4e5dbec1%2Cd0b19401%2C07abe6d0%2C78a38c93%2C0343f5cc%2Cc29a206e%2C6f9640c8%2C0afdac10&page=";

const casaAbanoLink =
    "https://www.casa.it/vendita/residenziale/abano-terme?mqMin=100&priceMin=40000&priceMax=190000&page=";

const subitoUrl =
    "https://www.subito.it/annunci-veneto/vendita/appartamenti/padova/selvazzano-dentro/?q=casa&ps=50000&pe=190000&szs=100";
const subitoPadovaAnche =
    "https://www.subito.it/annunci-veneto/vendita/appartamenti/padova/padova/?q=casa&ps=50000&pe=190000&szs=100";

const subitoAbano = "https://www.subito.it/annunci-veneto/vendita/appartamenti/padova/abano-terme/?q=casa&ps=50000&pe=190000&szs=100"

// Here starts everything
bot.onText(/\/start/, (msg) => {
    var telegramUser = msg.from;
    // Aggiorno il file
    const usersFile = fs.readFileSync("users.txt").toString();
    if (!usersFile.includes(msg.chat.id)) {
        fs.writeFile(
            "users.txt",
            usersFile + msg.chat.id + "\n",
            "utf-8",
            function(err) {
                if (err) throw err;
                console.log("UsersAsinc complete");
            }
        );
    }

    bot.sendMessage(
        msg.chat.id,
        "Welcome " + msg.from.first_name + ", Notifiche On!", {
            reply_markup: {
                keyboard: [
                    [IMMOBILIARE],
                    [CASE],
                    [SUBITO]
                ],
            },
        }
    );
});

// Catch every messagge text
bot.on("message", (msg) => {
    // Immobiliare.it
    if (msg.text.toString() === IMMOBILIARE) {
        var links = [];
        var contents = fs.readFileSync("immobiliare.txt", "utf8");
        links = contents.split(/\r?\n/);
        // Check all the links if it is a new one
        var diff = links.length - 10 <= 0 ? 0 : links.length - 11;
        for (let index = diff; index < links.length; index++) {
            if (links[index] != "") bot.sendMessage(msg.chat.id, links[index]);
        }
    }
    // Case.it
    else if (msg.text.toString() === CASE) {
        var links = [];
        var contents = fs.readFileSync("case.txt", "utf8");
        links = contents.split(/\r?\n/);
        // Check all the links if it is a new one
        var diff = links.length - 10 <= 0 ? 0 : links.length - 11;
        for (let index = diff; index < links.length; index++) {
            if (links[index] != "") bot.sendMessage(msg.chat.id, links[index]);
        }
    }
    // Subito.it
    else if (msg.text.toString() === SUBITO) {
        var links = [];
        var contents = fs.readFileSync("subito.txt", "utf8");
        links = contents.split(/\r?\n/);
        // Check all the links if it is a new one
        var diff = links.length - 10 <= 0 ? 0 : links.length - 11;
        for (let index = diff; index < links.length; index++) {
            if (links[index] != "") bot.sendMessage(msg.chat.id, links[index]);
        }
    } else {
        if (msg.text.toString() != "/start")
            bot.sendMessage(msg.chat.id, "Commando non riconosciuto!");
    }
});







/**
 * CronTab Immobiliare.i
 */
cron.schedule("*/5 8-21 * * *", () => {
    // Immobiliare.it ##################################################################################################################

    console.log("Crontab In")

    var finalImobiliareURL = "";

    for (let i = 1; i < 5; i++) {
        if (i > 1) {
            finalImobiliareURL = immobiliarePageNexts + i.toString();
        }
        // first page
        else {
            finalImobiliareURL = immobiliareLink;
        }

        request(finalImobiliareURL, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];
                var img = [];
                let main = $(".listing-item ").each(function() {
                    const t = $(this).find("a[data-row-link]");

                    if (t.attr("href") !== undefined && t.attr("href")) {
                        var elemento = t.attr("href");

                        links.push(elemento);
                    }
                    //   const y = $(this).find('div[data-role="foto-gallery"]').first().find("img")
                    //   img.push(y.attr("src"))
                });

                // Check all the links if it is a new one
                links.forEach((el) => {
                    var contents = fs.readFileSync("immobiliare.txt", "utf8");
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync(
                            "immobiliare.txt",
                            contents + el + "\n",
                            "utf-8",
                            function(err) {
                                if (err) throw err;
                            }
                        );

                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require("fs").createReadStream("users.txt"),
                        });
                        lineReader.on("line", function(line) {
                            if (line !== "") {
                                console.log("Imobiliare Selvazzano user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                                bot.sendMessage(line, el)
                            };
                        });
                    }
                });
            }
        });
    }

    //##################################################################################################################

    var finalImobiliareAbanoURL = "";

    for (let i = 1; i < 5; i++) {
        if (i > 1) {
            finalImobiliareAbanoURL = immobiliareAbanoPageNexts + i.toString();
        }
        // first page
        else {
            finalImobiliareAbanoURL = immobiliareAbanoLink;
        }

        request(finalImobiliareAbanoURL, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];
                var img = [];
                let main = $(".listing-item ").each(function() {
                    const t = $(this).find("a[data-row-link]");

                    if (t.attr("href") !== undefined && t.attr("href")) {
                        var elemento = t.attr("href");
                        links.push(elemento);
                    }
                    //   const y = $(this).find('div[data-role="foto-gallery"]').first().find("img")
                    //   img.push(y.attr("src"))
                });

                // Check all the links if it is a new one
                links.forEach((el) => {
                    var contents = fs.readFileSync("immobiliare.txt", "utf8");
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync(
                            "immobiliare.txt",
                            contents + el + "\n",
                            "utf-8",
                            function(err) {
                                if (err) throw err;
                            }
                        );

                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require("fs").createReadStream("users.txt"),
                        });
                        lineReader.on("line", function(line) {
                            if (line !== "") {
                                console.log("Imobiliare Abano user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                                bot.sendMessage(line, el)
                            };
                        });
                    }
                });
            }
        });
    }

    //###########################################  FINE IMOBILIARE TUTTO  #######################################################################

    // Casa.it ##################################################################################################################

    for (let i = 1; i < 5; i++) {
        // Solo Selvazzano
        request(casaLink + i.toString(), (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];

                let main = $("article").each(function() {
                    const t = $(this).find("a[title]");

                    if (t.attr("href") !== undefined && t.attr("href")) {
                        var elemento = t.attr("href");

                        links.push("www.casa.it" + elemento);
                    }
                });

                links.forEach((el) => {
                    var contents = fs.readFileSync("case.txt", "utf8");
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync(
                            "case.txt",
                            contents + el + "\n",
                            "utf-8",
                            function(err) {
                                if (err) throw err;
                            }
                        );

                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require("fs").createReadStream("users.txt"),
                        });
                        lineReader.on("line", function(line) {
                            if (line !== "") {
                                console.log("Casa Selvazzano user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                                bot.sendMessage(line, el)
                            };
                        });
                    }
                });
            }
        });

        // Padova anche
        request(casaLinkPadovaAnche + i.toString(), (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];

                let main = $("article").each(function() {
                    const t = $(this).find("a[title]");

                    if (t.attr("href") !== undefined && t.attr("href")) {
                        var elemento = t.attr("href");

                        links.push("www.casa.it" + elemento);
                    }
                });

                links.forEach((el) => {
                    var contents = fs.readFileSync("case.txt", "utf8");
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync(
                            "case.txt",
                            contents + el + "\n",
                            "utf-8",
                            function(err) {
                                if (err) throw err;
                            }
                        );

                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require("fs").createReadStream("users.txt"),
                        });
                        lineReader.on("line", function(line) {
                            if (line !== "") {
                                console.log("Case,it Padova user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                                bot.sendMessage(line, el)
                            };
                        });
                    }
                });
            }
        });


        // Abano terme anche
        request(casaAbanoLink + i.toString(), (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                var links = [];

                let main = $("article").each(function() {
                    const t = $(this).find("a[title]");

                    if (t.attr("href") !== undefined && t.attr("href")) {
                        var elemento = t.attr("href");

                        links.push("www.casa.it" + elemento);
                    }
                });

                links.forEach((el) => {
                    var contents = fs.readFileSync("case.txt", "utf8");
                    // check if a line is not included
                    if (contents.toString().indexOf(el.toString()) === -1) {
                        fs.writeFileSync(
                            "case.txt",
                            contents + el + "\n",
                            "utf-8",
                            function(err) {
                                if (err) throw err;
                            }
                        );

                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require("fs").createReadStream("users.txt"),
                        });
                        lineReader.on("line", function(line) {
                            if (line !== "") {
                                console.log("Casa Abano user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                                bot.sendMessage(line, el)
                            };
                        });
                    }
                });
            }
        });


    }

    // Subito.it ##################################################################################################################
    request(subitoUrl, (error, response, html) => {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            var links = [];

            let main = $(
                "#layout > main > div.jsx-206193370 > div.jsx-206193370.container > div.jsx-206193370.col.items > div.jsx-59941399.container > div.jsx-59941399.items.visible > div"
            ).each(function() {
                const t = $(this).find("a[href]");

                if (t.attr("href") !== undefined && t.attr("href")) {
                    var elemento = t.attr("href");

                    links.push(elemento);
                }
            });

            links.forEach((el) => {
                var contents = fs.readFileSync("subito.txt", "utf8");
                // check if a line is not included
                if (contents.toString().indexOf(el.toString()) === -1) {
                    fs.writeFileSync(
                        "subito.txt",
                        contents + el + "\n",
                        "utf-8",
                        function(err) {
                            if (err) throw err;
                        }
                    );

                    // Send bradcast
                    var lineReader = readline.createInterface({
                        input: require("fs").createReadStream("users.txt"),
                    });
                    lineReader.on("line", function(line) {
                        if (line !== "") {
                            console.log("Subito user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                            bot.sendMessage(line, el)
                        };
                    });
                }
            });
        }
    });

    // Subito.it Padova Anche  ##################################################################################################################
    request(subitoPadovaAnche, (error, response, html) => {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            var links = [];

            let main = $(
                "#layout > main > div.jsx-206193370 > div.jsx-206193370.container > div.jsx-206193370.col.items > div.jsx-59941399.container > div.jsx-59941399.items.visible > div"
            ).each(function() {
                const t = $(this).find("a[href]");

                if (t.attr("href") !== undefined && t.attr("href")) {
                    var elemento = t.attr("href");

                    links.push(elemento);
                }
            });

            links.forEach((el) => {
                var contents = fs.readFileSync("subito.txt", "utf8");
                // check if a line is not included
                if (contents.toString().indexOf(el.toString()) === -1) {
                    fs.writeFileSync(
                        "subito.txt",
                        contents + el + "\n",
                        "utf-8",
                        function(err) {
                            if (err) throw err;
                        }
                    );

                    // Send bradcast
                    var lineReader = readline.createInterface({
                        input: require("fs").createReadStream("users.txt"),
                    });
                    lineReader.on("line", function(line) {
                        if (line !== "") {
                            console.log("Subito Padova user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                            bot.sendMessage(line, el)
                        };
                    });
                }
            });
        }
    });


    // Subito.it Abano Terme  ##################################################################################################################
    request(subitoAbano, (error, response, html) => {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            var links = [];

            let main = $(
                "#layout > main > div.jsx-206193370 > div.jsx-206193370.container > div.jsx-206193370.col.items > div.jsx-59941399.container > div.jsx-59941399.items.visible > div"
            ).each(function() {
                const t = $(this).find("a[href]");

                if (t.attr("href") !== undefined && t.attr("href")) {
                    var elemento = t.attr("href");

                    links.push(elemento);
                }
            });

            links.forEach((el) => {
                var contents = fs.readFileSync("subito.txt", "utf8");
                // check if a line is not included
                if (contents.toString().indexOf(el.toString()) === -1) {
                    fs.writeFileSync(
                        "subito.txt",
                        contents + el + "\n",
                        "utf-8",
                        function(err) {
                            if (err) throw err;
                        }
                    );

                    // Send bradcast
                    var lineReader = readline.createInterface({
                        input: require("fs").createReadStream("users.txt"),
                    });
                    lineReader.on("line", function(line) {
                        if (line !== "") {
                            console.log("Subito Abano user=" + line + "  Link=" + el + "  " + new Date().toISOString() + "\n")
                            bot.sendMessage(line, el)
                        };
                    });
                }
            });
        }
    });


});