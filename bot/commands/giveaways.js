'use strict';

// Initialise everything we're going to use.

// Internal libraries.
const Logging = require('../../common/Logging')
const Settings = require('../../common/Settings')
const Command = require('../../common/Command')

// External libraries.
const csv = require('csv-parser');
const fs = require('fs');

var BOT_CONFIG = Settings.loadConfig();


// Category Name and Descripton
module.exports.categoryName = "Giveaways"
module.exports.version = "0.0.1"
module.exports.categoryDescription = "Do giveaways with the bot."

module.exports.commands = {
    "gw-randomping": {
        pretty_name: "gw-randomping",
        description: "Get a random ping from a list of roles, given an ID.",
        execute: async function(MesgElement, Args, client, Discord) {
            // Random ping

            if (args[2] === undefined) { 
                message.channel.send("Must specify number of winners.")
                return
            }

            if (!message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send("Must be a server administrator to use this command (preventing against spam pinging)")
                return
            }

            //console.log("Ran.")

            if ( args[1] !== undefined ) {
                // We have a role mention.
                //console.log("In.")
                BOT_CONFIG = Settings.loadConfig();
                var sentMessage = await message.channel.send("**Analysing...**")

                //var guild = await message.guild.fetchMembers();
                var MemberObject = message.guild.roles.cache.get(args[1]).members
                
                // console.log( MemberObject )
                var ArrayNum = 0;
                var ArrayRar = []

                MemberObject.forEach(function(test) {
                    ArrayRar[ArrayNum] = test.user.id;

                    ArrayNum++;
                })
                
                var ArrayWinners = [];
                
                //console.log(ArrayRar)
                var NumberOfWinners = parseInt(args[2]);
                var CollectedWinners = 0;
                while ( CollectedWinners !== NumberOfWinners ) {
                    //console.log("In while loop")
                    let selectedUser = ArrayRar[module.exports.functions.random(0,ArrayNum)]

                    if (!ArrayWinners.includes(selectedUser)) {
                        ArrayWinners[CollectedWinners] = selectedUser
                        //console.log(ArrayWinners[CollectedWinners])
                        CollectedWinners++;
                        //console.log("User selected")
                    } else {
                        //console.log("Duplicate user found, skipping")
                    }

                    if (CollectedWinners >= NumberOfWinners) {
                        //console.log('winners collected')
                        break;
                    }
                }
                
                var Finalmsg = ""
                ArrayWinners.forEach(function(winnerID) {
                    Finalmsg += ("<@" + winnerID + "> ")
                })

                //var RandomAnalysis = ArrayRar[module.exports.functions.random(0,ArrayNum)]

                message.channel.send(Finalmsg)
                
                sentMessage.edit("Analysis completed.")
            } else {
                message.channel.send("Must provide a proper role mention. Please make sure this role is mentionable (you can make it unmentionable after running this command).")
            }

        }
    },
    "gw-randomping-csv": {
        pretty_name: "gw-randomping-csv",
        description: "Get a random ping from a list of roles, given an ID. Send each winner a DM containing content of a CSV file.",
        execute: async function(MesgElement, Args, client, Discord) {
            // Random ping

            if (args[2] === undefined) { 
                message.channel.send("Must specify number of winners.")
                return
            }
            
            if (args[3] === undefined) { 
                message.channel.send("Must specify a CSV file.")
                return
            }
            
            if (args[4] === undefined ) {
                message.channel.send("Must specify a giveaway name.")
                return
            }
            
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send("Must be a server administrator to use this command (preventing against spam pinging)")
                return
            }

            //console.log("Ran.")

            if ( args[1] !== undefined ) {
                // We have a role mention.
                //console.log("In.")
                BOT_CONFIG = Settings.loadConfig();
                var sentMessage = await message.channel.send("**Analysing...**")

                //var guild = await message.guild.fetchMembers();
                //console.log(args)
                //console.log(message.guild.roles.cache.get(args[1]))
                var MemberObject = message.guild.roles.cache.get(args[1]).members
                
                //console.log(MemberObject)
                
                // console.log( MemberObject )
                var ArrayNum = 0;
                var ArrayRar = []

                MemberObject.forEach(function(test) {
                    ArrayRar[ArrayNum] = test.user.id;

                    ArrayNum++;
                })
                
                var ArrayWinners = [];
                
                //console.log(ArrayRar)
                var NumberOfWinners = parseInt(args[2]);
                var CollectedWinners = 0;
                while ( CollectedWinners !== NumberOfWinners ) {
                    //console.log("In while loop")
                    let selectedUser = ArrayRar[module.exports.functions.random(0,ArrayNum)]

                    if (!ArrayWinners.includes(selectedUser)) {
                        ArrayWinners[CollectedWinners] = selectedUser
                        //console.log(ArrayWinners[CollectedWinners])
                        CollectedWinners++;
                        //console.log("User selected")
                    } else {
                        //console.log("Duplicate user found, skipping")
                    }

                    if (CollectedWinners >= NumberOfWinners) {
                        //console.log('winners collected')
                        break;
                    }
                }
                
                var ResultArray = [];
                var i = 0;
                fs.createReadStream("./csv/" + args[3])
                    .pipe(csv())
                    .on('data', (row) => {
                        ResultArray[i] = row.CODE
                        i++;
                    })
                    .on('end', () => {
                        //console.log('CSV file successfully processed');
                        //console.log(ResultArray)
                        
                        var Finalmsg = ""
                        var k = 0;
                        console.log("CSV parsed, sending codes. No output from a user means success.")
                        ArrayWinners.forEach(function(winnerID) {
                            Finalmsg += ("<@" + winnerID + "> ")
                            client.users.fetch(winnerID)
                                .then( (userObj) => {
                                    process.stdout.write("Sending " + userObj.tag + " code " + ResultArray[k] + "... ")
                                    userObj.send("Congratulations on winning " + message.guild.name + "'s **" + args.slice(4).join(" ") + "** giveaway! Your code is: " + ResultArray[k] + ".")
                                    .catch( (error) => {
                                        process.stdout.write("FAILED!")
                                    })
                                    process.stdout.write("\n")
                                    k++;
                                });
                                
                            
                
                            
                        })
                        
                        message.channel.send(Finalmsg)
                        sentMessage.edit("Analysis completed.")
                    });
                    

                
                

                //var RandomAnalysis = ArrayRar[module.exports.functions.random(0,ArrayNum)]

          
            } else {
                message.channel.send("Must provide a proper role mention. Please make sure this role is mentionable (you can make it unmentionable after running this command).")
            }

        }
    
    },
    "gw-start": {
        pretty_name: "gw-start",
        description: "Start a giveaway.",
        execute: async function(message, Args, client, Discord) {
            const gArgs = message.content.slice(BOT_CONFIG.bot_prefix.length).trim().split(/ +/g)
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send("Must be a server administrator to use this command (preventing against spam pinging)")
                return
            }
            // horrible way to bypass owner check
            if (true) {
                BOT_CONFIG = Settings.loadConfig();
                client.giveawaysManager.start(message.channel, {
                    time: ms(args[1]),
                    prize: args.slice(3).join(" "),
                    winnerCount: parseInt(args[2]),
                    messages: {
                        giveaway: "\n\n🎉🎉 **GIVEAWAY** 🎉🎉",
                        giveawayEnded: "\n\n🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
                        timeRemaining: "Time remaining: **{duration}**!",
                        inviteToParticipate: "React with 🎉 to participate!",
                        winMessage: "Congratulations, {winners}! You won **{prize}**!",
                        embedFooter: "Giveaways",
                        noWinner: "Giveaway cancelled, no valid participations.",
                        hostedBy: "Hosted by: {user}",
                        winners: "winner(s)",
                        endedAt: "Ended at",
                        units: {
                            seconds: "seconds",
                            minutes: "minutes",
                            hours: "hours",
                            days: "days",
                            pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                        }
                    }
                }).then((gData) => {
                    //console.log(gData); // {...} (messageid, end date and more)
                });
            }

            // And the giveaway has started!
        }
    },
    "gw-reroll": {
        pretty_name: "gw-reroll",
        description: "Reroll a giveaway.",
        execute: async function(message, Args, client, Discord) {
            let messageID = args[1];
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send("Must be a server administrator to use this command (preventing against spam pinging)")
                return
            }

            BOT_CONFIG = Settings.loadConfig();
            if (true) {
                client.giveawaysManager.reroll(messageID).then(() => {
                    message.channel.send("Success! Giveaway rerolled!");
                }).catch((err) => {
                    message.channel.send("No giveaway found for "+messageID+", please check and try again");
                });
            }
        }
    },
    "gw-delete": {
        pretty_name: "gw-delete",
        description: "Deletes a giveway.",
        execute: async function(message, Args, client, Discord) {
            let messageID = args[1];
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send("Must be a server administrator to use this command (preventing against spam pinging)")
                return
            }

            BOT_CONFIG = Settings.loadConfig();
            if (true) {
                client.giveawaysManager.delete(messageID).then(() => {
                    message.channel.send("Success! Giveaway deleted!");
                }).catch((err) => {
                    message.channel.send("No giveaway found for "+messageID+", please check and try again");
                });
            }
        }
    }
}