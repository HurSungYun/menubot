'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var MenuBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'MenuBot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'menubot.db');

    this.user = null;
    this.db = null;
};

util.inherits(MenuBot, Bot);

MenuBot.prototype.run = function() {
	MenuBot.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};

MenuBot.prototype._onStart = function () {
	this._loadBotUser();
	this._connectDb();
};

MenuBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

MenuBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
};

MenuBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        this._isMentioningMenuBot(message)
    ) {
        this._replyHello(message);
    }
};

MenuBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

MenuBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

MenuBot.prototype._isMentioningMenuBot = function (message) {
    return message.text.toLowerCase().indexOf('menubot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

MenuBot.prototype._replyHello = function (message) {
    var self = this;
    var channel = self._getChannelById(message.channel);
    self.postMessageToChannel(channel.name, 'hell no', {as_user: true});
};

MenuBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};
	
var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var menubot = new MenuBot({
    token: token,
    dbPath: dbPath,
    name: name
});

menubot.run();
