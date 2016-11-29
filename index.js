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
        !this._isFromMenuBot(message) &&
        this._isMentioningMenuBot(message)
    ) {
	if(this._isAddCmd(message)) {
	    this._replyAdd(message);
	} else if (this._isDeleteCmd(message)) {
            this._replyDelete(message);
	} else if (this._isUpdateCmd(message)) {
            this._replyUpdate(message);
        } else if (this._isMenuCmd(message)) {
            this._replyMenu(message);
	} else if (this._isHelpCmd(message)) {
            this._replyHelp(message);
        } else if (this._isListCmd(message)) {
            this._replyList(message);
        } else {
            this._replyErr(message);
        }
    }
};

MenuBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

MenuBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

MenuBot.prototype._isFromMenuBot = function (message) {
    return message.user === this.self.id;
};

MenuBot.prototype._isMentioningMenuBot = function (message) {
    return message.text.toLowerCase().indexOf('menubot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

MenuBot.prototype._isAddCmd = function (message) {
    return message.text.toLowerCase().indexOf('menubot add') == 0;
};

MenuBot.prototype._isDeleteCmd = function (message) {
    return message.text.toLowerCase().indexOf('menubot delete') == 0;
};

MenuBot.prototype._isUpdateCmd = function (message) {
    return message.text.toLowerCase().indexOf('menubot update') == 0;
};

MenuBot.prototype._isMenuCmd = function (message) {
    return message.text.toLowerCase().indexOf('menubot menu') == 0;
};

MenuBot.prototype._isListCmd = function (message) {
    return message.text.toLowerCase().indexOf('menubot list') == 0;
};

MenuBot.prototype._isHelpCmd = function (message) {
    return message.text.toLowerCase().indexOf('menubot help') == 0;
};

MenuBot.prototype._replyErr = function (message) {
    var self = this;
    var channel = self._getChannelById(message.channel);
    self.postMessageToChannel(channel.name, 'Command does not exist. Type "menubot help" for additional information', {as_user: true});
};

MenuBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

MenuBot.prototype._replyAdd = function (message) {
    var self = this;
    var channel = self._getChannelById(message.channel);

    var substr = message.text.substring("menubot add ".length, message.text.length);
    var menuName = substr.split(" ")[0];
    var rate = substr.split(" ")[1];
    console.log(menuName, rate);
    //I might use db.get here
    self.db.get("INSERT INTO menus VALUES ('" + menuName + "', " + rate + ");", function (err, record) {
        console.log(record); 
        self.postMessageToChannel(channel.name, err, {as_user: true});
    });
};

MenuBot.prototype._replyDelete = function (message) {
};

MenuBot.prototype._replyUpdate = function (message) {
};

MenuBot.prototype._replyMenu = function (message) {
    var self = this;
    var channel = self._getChannelById(message.channel);
    self.postMessageToChannel(channel.name, 'menu!', {as_user: true});
};

MenuBot.prototype._replyList = function (message) {
    var self = this;
    var channel = self._getChannelById(message.channel);

    self.db.get('SELECT name, rate FROM menus ORDER BY rate DESC', function (err, records) {
        if (err) {
            return console.error('DATABASE ERROR:', err);
        }
        var msg = "List of Menus:\n";
        console.log(records);

        for(let record in records) {
            msg = msg.concat(record.name + ", rate: " + record.rate + "\n");
        }

        self.postMessageToChannel(channel.name, msg, {as_user: true});
    });
};

MenuBot.prototype._replyHelp = function (message) {
    var self = this;
    var channel = self._getChannelById(message.channel);
    self.postMessageToChannel(channel.name, 'help!', {as_user: true});
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
