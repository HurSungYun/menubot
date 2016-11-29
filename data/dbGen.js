'use strict';

/**
 * Command line script that generates a SQLite database file that contains jokes about Chuck Norris using the
 * wonderful http://api.icndb.com/jokes APIs
 *
 * Usage:
 *
 *   node databaseGenerator.js [destFile]
 *
 *   destFile is optional and it will default to "norrisbot.db"
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */

var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var outputFile = process.argv[2] || path.resolve(__dirname, 'menubot.db');
var db = new sqlite3.Database(outputFile);

db.serialize();
db.run('CREATE TABLE IF NOT EXISTS menus (name TEXT PRIMARY KEY, rate INT DEFAULT 100)');
db.close();
console.log('DB generated\n');
