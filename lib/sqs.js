   // Checks the SQS queue for an 
  receiveMessage = function() {
    sqs.receiveMessage({
      QueueUrl: config.queueUrl,
        }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          if(data.Messages) {
            // An array of messages is returned on a call.  Send each call to a different
            // process.
            data.Messages.forEach(function(element, index, array) {
              var currentWorker = workers[currentWorkerIndex];
              currentWorker.send({message:element});
              // Iterate and pass to workers, if we're at the end of the index pass
              // to the first worker.
              if(currentWorkerIndex != (processCount - 1)) {
                currentWorkerIndex = currentWorkerIndex + 1 
              } else {
                currentWorkerIndex = 0;
              } 
            });
          }
        }
      });
  };

deleteMessage = function(data, success, error) {
    sqs.deleteMessage({
      QueueUrl: config.queueUrl,
      ReceiptHandle: ReceiptHandle
    }, function(err, data) {
      if (err) {
        error(err)
      } else {
        success(data);
      }
    });
  }
