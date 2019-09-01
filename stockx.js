/*jshint esversion: 6 */
const request = require('request');
const cheerio = require('cheerio');
const Discord = require('discord.js');

const client = new Discord.Client();
const token = 'YOURTOKEN';

console.log('Starting...');
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! Created by Mr.Bean#0885`);
});

const stockxCMD = "!stockx";
client.on('message', function(message) {
    if(message.content.indexOf(stockxCMD)==0){ 
        let command = message.content.substring(message.content.indexOf(" ") + 1, message.content.length);
        let url = command;

//Requests
request(url, (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        //Random VAR
        let color = "0x00FF61";
        let goodResell = "Good";

        //Scrap
        const siteHeading = $('.col-md-12');
        const name = siteHeading.find('h1').text();

        let imgHeading = $('.image-container img');
        let img = imgHeading.attr('src');

        const lastSaleHeading = $('.sale-value');
        const lastSaleText = lastSaleHeading.contents().first().text();

        const averageSaleHeading = $('.gauge-value');
        const averageSaleText = averageSaleHeading.last().text();

        const descriptionHeading = $(".product-description p");
        const descriptionText = descriptionHeading.text();

        const numSalesHeading = $(".gauge-value");
        const numSalesText = numSalesHeading.first().text();

        const retailHeading = $(".pinfo-container");
        let retailText = retailHeading.next().last().text();
        
        let retailText1 = $(".pinfo-container").eq(0).next().text();
        let retailText2 = $(".pinfo-container").eq(1).next().text();
        let retailText3 = $(".pinfo-container").eq(2).next().text();
        let retailText4 = $(".pinfo-container").eq(3).next().text();
        let retailText5 = $(".pinfo-container").eq(4).next().text();

        const porHeading = $(".gauge-value");
        let porText = porHeading.eq(1).text();

        const highestHeading = $(".stat-value");
        let highestText = highestHeading.last().text();

        console.log(highestText);

        const lowestHeading = $(".stat-value");
        let lowestText = lowestHeading.first().text();

        console.log(lowestText);
        
        console.log(porText);

        if($(".pinfo-container").eq(3).next().text().startsWith("$")) {
            console.log("Starts With $")
        }
        

        porText = porText.replace("%","");

        if(retailText.startsWith('$', 1)) {
            ('Retail Price' + retailText);
        }
        else {
            if(retailText1.startsWith('$', 1)) {
                retailText = retailText1;
            }
            else {
                if(retailText2.startsWith('$', 1)) {
                    retailText = retailText2;
                }
                else {
                    if(retailText3.startsWith('$', 1)) {
                        retailText = retailText3;
                    }
                    else {
                        if(retailText4.startsWith('$', 1)) {
                            retailText = retailText4;
                        }
                        else {
                            if(retailText5.startsWith('$', 1)) {
                                retailText = retailText5;
                            }
                        }
                    }
                }
            }

        }
        
        //Find Immage
        if(img == null || img === 'undefined') {
            console.log('null')
            imgHeading = $('.product-media img');
            img = imgHeading.attr('src');
        }


        //Resell Prediction
       if(porText >= 100) {
           color = "0x00FF61";
           goodResell = "Great!";
       }
       else {
           if(porText >= 50 && porText <= 99) {
               color = "0xFFEF00";
               goodResell = "Alright";
           }
           else {
               if(porText <= 25)
               {
                   color = "0xFF0000";
                   goodResell = "Not Good";
               }
               else {
                   if(26 < porText < 49)
                   {
                       color = "0xFF9292";
                       goodResell = "Ok";
                   }
               }
           }
       }

        //Log Item
        console.log(name +' '+ img +' '+ lastSaleText +' '+ averageSaleText);

        //Create embed
        const embed = new Discord.RichEmbed()
        .setTitle(name)
        .setAuthor("StockX Scrapper")
        .setColor(color)
        .setDescription(descriptionText)
        .setFooter("StockX Scrapper Created By: Mr.Bean#0885", "https://cdn.discordapp.com/attachments/569387290741440523/569706489602768896/stockxx.png")
        //.setImage(img)
        .setTimestamp()
        .setURL(url)
        .setThumbnail(img)
        .addField("Last Sale ", lastSaleText, true)
        .addField("Average Sale Price", averageSaleText, true)
        .addField("# of Sales", numSalesText, true)
        .addField("Retail Price", retailText, true)
        .addField("Lowest Ask", lowestText, true)
        .addField("Highest Bid", highestText, true)
        .addField("Price Premium", porText+"%", true)
        .addField("Good For Resale?", goodResell,true);
        message.channel.send({embed});

    }
});
    }
});



client.login(token);