# MenuBot

MenuBot is a Slack bot helps you to decide what to eat today.

Lots of codes are referenced from https://scotch.io/tutorials/building-a-slack-bot-with-node-js-and-chuck-norris-super-powers

You can add or delete menus with rate (affects picking-frequency), and pick what you gonna eat for your convenience.

```
git clone https://github.com/HurSungYun/menubot

cd menubot

npm install

BOT_API_KEY=<your_api_key> node index.js
```

You should get the api key to allow your bot to join slack channel before running MenuBot. 

## Usage

```
usage: menubot <command> [<args>]

available menubot commands are:
add <item> <rate>      Add item into menu lists
delete <item>          Delete item from menu lists
update <item> <rate>   Set new rate of item
menu                   Pick Menu randomly among menu lists
list                   Show menu lists
help                   See the help document

```

Type "menubot help" for further information.

## License

Licensed under [MIT License](LICENSE). © Ethan Hur.
