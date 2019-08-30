#!/usr/bin/env node
var fs = require('fs');
var glob = require('glob');
var path = require('path');

var sourcePath = path.resolve(__dirname, '../src');
var files = glob.sync(sourcePath + '/**/*.ts');

var filesCompilation = '';

for (var i in files) {
  var filePath = files[i];
  var fileContents = fs.readFileSync(filePath);

  filesCompilation += fileContents;
}

var tmp = require('tmp');
var process = require('child_process');

tmp.file(function (err, filename) {
  fs.writeFileSync(filename, filesCompilation);
  process.exec('tsc --module none --target es5 --declaration --removeComments node_modules/pixi.js/pixi.js.d.ts ' + filename, function(err, stdout, stderr) {
    var dtsPath = filename.replace('.ts', '.d.ts');
    var dtsContent = '' + fs.readFileSync(dtsPath);

    fs.writeFileSync(
      path.resolve('dist/pixi-compressed-textures.d.ts'),
      dtsContent.replace(/namespace pixi_compressed_textures/g, 'namespace PIXI.compressedTextures')
		  .replace(/pixi_compressed_textures/g, 'PIXI.compressedTextures')
    );
  });
}, {postfix: '.ts'});