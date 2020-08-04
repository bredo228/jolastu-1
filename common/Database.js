'use strict';

const api_database = require("better-sqlite3")

function initialiseDatabase(guildID) {
    let configDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
    let dbDir = path.join(configDir, "/jolastu_" + guildID + ".db")

    let db = new api_database(dbDir, { fileMustExist: false } )


    return db;
}

function check_table(guildID, tableName) {
    let database = initialiseDatabase(guildID);
    try {
        let statement = database.prepare("SELECT * FROM " + tableName).all();
    } catch (error) {
        //console.log("Table no exist, create.")
        database.exec(`CREATE TABLE "` + tableName + `" (
            "userID"	INTEGER,
            "moderatorID"	INTEGER,
            "reason"	TEXT
        );`)

        //console.log("Should have it now.")
        
    }
    
    let statement = database.prepare("SELECT * FROM " + tableName).all();
    ////console.log(statement);

}

module.exports.add = async function (guildID, propertyName, opts) {
    // guildID must be guild ID of server.
    // propertyName must be the property we're looking to add stuff to (valid: user_warns, user_bans, user_kicks)
    
    let database = initialiseDatabase(guildID);
    
    if ( propertyName == "user_warns" ) {
        // opts must contain user_id, moderator_id and reason
        check_table(guildID, "user_warns");
        return database.exec(`INSERT INTO user_warns (userID,moderatorID,reason) VALUES(`+opts.user_id+`,`+opts.moderator_id+`,'`+opts.reason+`');`)
    } else if ( propertyName == "user_bans" ) {
        // opts must contain user_id, moderator_id and reason
        check_table(guildID, "user_bans");
        return database.exec(`INSERT INTO user_bans (userID,moderatorID,reason) VALUES(`+opts.user_id+`,`+opts.moderator_id+`,'`+opts.reason+`');`)
    } else if ( propertyName == "user_kicks" ) {
        // opts must contain user_id, moderator_id and reason
        check_table(guildID, "user_kicks");
        return database.exec(`INSERT INTO user_kicks (userID,moderatorID,reason) VALUES(`+opts.user_id+`,`+opts.moderator_id+`,'`+opts.reason+`');`)
    }
    
}

module.exports.get = async function (guildID, propertyName, opts) {
    // guildID must be guild ID of server.
    // propertyName must be the property we're looking for (valid: user_warns, user_bans, user_kicks)

    let database = initialiseDatabase(guildID);

    if (propertyName == "user_warns") {
        // opts must contain user_id
        let statement = database.prepare("SELECT * FROM user_warns WHERE userID = " + opts.user_id);
        check_table(guildID, "user_warns");
        
        var finalArray = [];
        
        var i = 0;
        for (const current of statement.iterate()) {
            finalArray.push({
                userID: current.userID,
                moderatorID: current.moderatorID,
                reason: current.reason,
            })
            i++;
        }
        
        //console.log(finalArray)
        
        return finalArray;
    } else if (propertyName == "user_bans") {
        // opts must contain user_id
        let statement = "SELECT * FROM user_bans WHERE userID = " + opts.user_id
        check_table(guildID, "user_bans");
        let ran = database.prepare(statement).all();
        
        return ran;
    } else if (propertyName == "user_kicks") {
        // opts must contain user_id
        let statement = "SELECT * FROM user_kicks WHERE userID = " + opts.user_id
        check_table(guildID, "user_kicks");
        let ran = database.prepare(statement).all();
        
        return ran;
    }
    
}