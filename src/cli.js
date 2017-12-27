const path = require('path');
var csv = require('csv');
var axios = require('axios');
var parse = require('url-parse')
// const cheerio = require('cheerio');
// var $$ = require('xml-selector');
var HtmlDom = require('htmldom');

async function processLink(link) {
  let body = await axios.get(link);
  var html = new HtmlDom(body.data);
  var $ = html.$;

  // return $('[data-bull-photos=usual] .b-advItemGallery__main img').attr('src');
  return $('.detail-picture img').attr('src');
}

(function() {
 var colors = require("colors");
 
 exports.print = function(options) {
  
     if (options && options.file) {

      fs = require('fs');
      var lcol = options.link_col;
      console.log('options: ', options);
      var stringifier = csv.stringify();

      fs.readFile(
        path.join( process.cwd(), options.file), 'utf8', 
        function (err,data) {
          
          if (err) {
            console.log(err);
          }

          csv.parse(data, async (err, parsedData) => {

            console.log('count: ', parsedData.length);            

            for(var i=1; i<parsedData.length; i++) {
              let link = parsedData[i][lcol-1];

              if( !link || link.length === 0) continue;

              let parsed = parse(link);
              let protocol = parsed.protocol;
              let host = parsed.hostname;
              
              link = await processLink(link);
              let newLink = parse(link);
              newLink.set('hostname', host);
              newLink.set('protocol', protocol);

              parsedData[i][lcol-1] = newLink.href;

              console.log('i: ', i);              
            }

            console.log('READY');

            csv.stringify(parsedData, function(err, output){
              let newName = path.join( process.cwd(),'1'+options.file);
              fs.writeFile( newName, output, function (err) {
                if (err) return console.log(err);
                console.log('>' + newName);
              });

            });

          });
        });

        console.log("[", "fix-links".white, "]", options.file.toString().cyan);
     } else {
         throw new Error('no files specified!');
     }
 };

}).call(this);