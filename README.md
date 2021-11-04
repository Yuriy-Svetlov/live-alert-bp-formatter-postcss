# Live Alert BP Formatter PostCSS

The PostCSS message formatter for [live-alert-bp](https://github.com/Yuriy-Svetlov/live-alert-bp)


##  Install
```shell
npm i live-alert-bp-formatter-postcss --save-dev
```

## How to use

```javascript
  const formatterPostCSS = require("live-alert-bp-formatter-postcss");

  liveAlert.open(
    formatterPostCSS(MessagesPostCSS)
  );
```


## Examples how to use

[Example for Grunt](https://github.com/Yuriy-Svetlov/live-alert-bp/tree/master/documentation/examples/grunt/sass-postcss-formatters)

## API

```javascript
const formatterPostCSS = require("live-alert-bp-formatter-postcss");

formatterPostCSS(messages, user_style, show_input_file)
```

* return:  formatted messages for [live-alert-bp](https://github.com/Yuriy-Svetlov/live-alert-bp)

#### messages
* Type: `Array`

PostCSS messages

#### user_style
* Type: `ObjectJSON`

Set custom style messages

Exmaple:
```javascript
  const style = {};	

  style.label = {
	error: { backgroundColor: '#ff0000', color: '#ffffff' },
	warning: { backgroundColor: 'yellow', color: '#000000' },
	info: { backgroundColor: '#90ee90', color: '#000000' }
  };

  style.file = 'color: #90ee90 !important; text-decoration: underline !important;';
	
  style.line = {
	field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
	message: 'color: #ffffff !important; padding-left: 3px !important;'
  };
	
  style.column = {
	field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
	message: 'color: #ffffff !important; padding-left: 3px !important;'
  };

  style.evidence = {
	field: 'color: #aaaaaa !important; display: block !important; padding-bottom: 8px !important;', 
	message: 'box-sizing: border-box !important; width: 100% !important; overflow-x: auto !important; color: #ffffff !important; display: inline-block !important; border: dashed 1px #b9b9b9 !important; padding: 20px !important;'
  };

  style.reason = {
	field: 'color: #aaaaaa !important; display: block !important;  padding-top: 3px !important;', 
		message: 'color: #ffffff !important;'
  };	
```

#### show_input_file
* Type: `Boolean`

If you need the position in the PostCSS input (e.g., to debug the previous compiler), use `true`.

Example
```
  liveAlert.open(
    liveAlertFormatterPostCSS(MessagesPostCSS, {}, true)
  );
```
