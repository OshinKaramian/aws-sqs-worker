#!/usr/bin/env node
var 
  sqsWorker = require('./sqs-worker.js'),
  path = require('path'),
  spawn = require('child_process').spawn;

sqsWorker.work = function(data) {

  console.log("some stuff: " + JSON.stringify(data));
  console.log(data.message);

  var body = data.message.Body,
      output = '',
      batchBuilder = path.resolve(__dirname, "node_modules", "batch-player-builder-cli", "index.js");
    
  console.log(body);
   
  spawn(batchBuilder, ['--aid', body.accountId, '--ot', body.token, '--pid', body.playerId, '--eid', body.embedId, '--c', JSON.stringify(body.config)])
    .stdout.on('data', function(chunk) {
      output += chunk.toString();
    })
    .on('error', function(error) {
      console.log("spaghet! " + error);
      console.log("spaghet! " + output);
    })
    .on('close', function(code) {
      console.log("good job! " + code);
      console.log("good job! " + output);
    });
}

sqsWorker.run();

