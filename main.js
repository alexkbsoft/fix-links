

(function() {
 var cli, colors, err, pkg, program;
 program = require("commander"); 
  colors = require("colors");
 pkg = require("./package.json");
 cli = require("./src/cli");

 program.version(pkg.version)
        .option("-f, --file [file]", "set file with links.")
        .option("-l, --link_col [number]", "number of column with link");

 program.on("-help", function() {
   console.log(" Examples:");
   console.log("");
   console.log(" $ " + "fix-links" + " -f links.csv -lcol 2");
 });

 program.parse(process.argv);

 if (process.argv.length === 2) {
   program.help();
 } else {
   try {
    console.log('dir:', process.cwd());

     cli.print({
       file: program.file,
       link_col: program.link_col
     });

   } catch (_error) {
     err = _error;
     console.log("[", "fix-links".white, "]",err.toString().red);
   }
 }
}).call(this);