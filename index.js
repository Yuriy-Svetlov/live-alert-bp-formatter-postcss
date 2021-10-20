"use strict";

var 
	merge = require('lodash.merge'),
    path = require('path');

var 
    formatted_messages = [],
    style,
    label_style,
    label_message;

/*
| messages        | (default: `undefined`) : 

| user_style      | (default: `{}`)        :

| show_input_file | (default: `false`)     : If you need the position in the PostCSS input 
                                             (e.g., to debug the previous compiler), use `true`.
-------------------
Additiona inforamation : 
- https://github.com/postcss/postcss/blob/main/docs/guidelines/runner.md
- https://postcss.org/api/#csssyntaxerror
- https://postcss.org/api/#warning                                             
 */
var 
	index = function (messages, user_style = {}, show_input_file = false) {
    
	style = getStyle(user_style);

	if(Array.isArray(messages) === true && messages.length > 0){
		formatted_messages = formatter_messages(messages);
	}else 
	if(messages.name === 'CssSyntaxError'){
		formatted_messages = formatter_error(messages, show_input_file);
	}

	return formatted_messages;
}

module.exports = index;


function formatter_messages(messages){
	let 
		file,
		data = [];

	messages.forEach(function(item){
	  	if(item.type === 'warning'){
	  		label_style = style.label.warning;
	  		label_message = 'Warning';
	  	}else 
	  	if(item.type === 'error'){
	  		label_style = style.label.error;
	  		label_message = 'Error';
	  	}

	  	file = path.relative(process.cwd(), item.node.source.input.file);

		data.push({ 
			label: { 
				style: label_style, 
				name: label_message 
			}, 
			message: 
				html_template('', file, style.file) 
				+
				html_template('Line:', item.line, style.line)		
				+
				html_template('Col:', item.column, style.column)			
				+
				html_template('Reason:', item.text, style.reason)																	
		});
	}); 

	return data;
}


function formatter_error(message, show_input_file){
	let 
		file,
		line,
		column,
		source,
		data = [];

	file = (!show_input_file) ? message.file : message.input.file;
  	line = (!show_input_file) ? message.line : message.input.line;
  	column = (!show_input_file) ? message.column : message.input.column;
  	source = (!show_input_file) ? message.source : message.input.source;

  	file = path.relative(process.cwd(), file);

	data.push({ 
		label: { 
			style: style.label.error, 
			name: 'Error' 
		}, 
		message: 
			html_template('', file, style.file) 
			+
			html_template('Line:', line, style.line)		
			+
			html_template('Col:', column, style.column)	
			+
			html_template(' ', showSourceCode(source, line, column), style.evidence)		
			+
			html_template('Reason:', message.reason, style.reason)																	
	});

	return data;
}


function html_template(field = '', message, style){
	if(message == undefined){
		return ''
	}else
	if(field != '' && message != ''){
		return 	'<span style="' + style.field + '">' + field + '</span>' + 
	       		'<span style="' + style.message + '">' + message + '</span>';
	}else 
	if(field == ''){
		return 	'<span style="' + style + '">' + message + '</span>';
	}
}


function getStyle(user_style){	
	const
		style_default = {};	


	style_default.label = {
		error: { backgroundColor: '#ff0000', color: '#ffffff' },
		warning: { backgroundColor: 'yellow', color: '#000000' },
		info: { backgroundColor: '#90ee90', color: '#000000' }
	};

	style_default.file = 'color: #ffffff !important; text-decoration: underline !important;';
	
	style_default.line = {
		field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
		message: 'color: #ffffff !important; padding-left: 3px !important;'
	};

	style_default.column = {
		field: 'color: #aaaaaa !important; padding-left: 7px !important;', 
		message: 'color: #ffffff !important; padding-left: 3px !important;'
	};

	style_default.evidence = {
		field: 'color: #aaaaaa !important; display: block !important; padding-bottom: 8px !important;', 
		message: 'box-sizing: border-box !important; width: 100% !important; overflow-x: auto !important; color: #ffffff !important; display: inline-block !important; border: dashed 1px #b9b9b9 !important; padding: 20px !important;'
	};

	style_default.reason = {
		field: 'color: #aaaaaa !important; display: block !important;  padding-top: 3px !important;', 
		message: 'color: #ffffff !important;'
	};	

	// Setting the user's style, if any	
	return merge(style_default, user_style);
}


function showSourceCode(css, error_line, error_column){
  let 
    lines = css.split(/\r?\n/),
    start = Math.max(error_line - 3, 0),
    end = Math.min(error_line + 2, lines.length),
    list_code = [], 
    content = '';

  for (let i = start; i < end + 1; i++) {
    list_code.push({ line: i + 1, css: lines[i] });
  }

  list_code.forEach(function(item){
      if(item.line === error_line){

      	let start_col = replaceSpaces(item.css.slice(0, error_column - 1));
      	let end_col = replaceSpaces(item.css.slice(error_column - 1, item.css.length));
        let css = error_mark(start_col, end_col);

        content = content + html_content(item.line, css);
      }else{

        content = content + html_content(item.line, '<span style="opacity: 0.5 !important;">' + replaceSpaces(item.css) + '</span>');
      }
  }); 
  
  return html_container(content);


  function error_mark(start_col, end_col){
  	return '<span style="opacity: 0.5 !important;">' + start_col + '</span>' + 
  	'<span style="font-weight: bold !important; opacity: 1.0 !important;">' + end_col + '</span>';
  }


  function replaceSpaces(text){
    if(text === undefined){
       return '';
    }

    text = text.replace(/(\t)/g, '&ensp;&ensp;&ensp;&ensp;');

    text = text.replace(/(	)/g, '&ensp;&ensp;&ensp;&ensp;');

    return text.replace(/( )/g, '&ensp;');
  }


  function html_container(content){
    return `
    <span style="display: inline-grid !important; grid-template-columns: auto auto !important; padding: 0px !important; grid-row-gap: 3px !important;"> 
      ${content}
    </span>`;
  }


  function html_content(line, css){
   return `
    <span style="border-right: 1px solid #ffffff !important; padding-right: 5px !important; text-align: right !important; opacity: 0.5 !important;">
      ${line}
    </span>

    <span style="padding-left: 5px !important; text-align: left !important;">
      ${css}
    </span>`;
  }
}