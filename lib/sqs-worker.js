(function(){
  var

  cluster = require('cluster'),
  aws = require('aws-sdk'),
  config = require('./config.json'),
  workers = [],
  currentWorkerIndex = 0,
  processCount = config.numProcesses;

  aws.config.update(config.awsConfig);

  var sqs = new aws.SQS(),

 
  module.exports.run = function() {
    var self = this;
    
    if(cluster.isMaster) {

      cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
      });

      for(var i = 0; i < processCount; i++) {
        var worker = cluster.fork();
        workers[i] = worker;
      }

      setInterval(receiveMessage, 5000)

    } else {
      process.on('message', function(msg) {
        console.log("Processing: " + JSON.stringify(msg) + "on worker: " + process.pid);
        if (self.work) {
          self.work(msg);
        }
      });
    }
  }

  

})();
