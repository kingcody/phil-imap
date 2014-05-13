var express = require('express');
var router = express.Router();
var MailListener = require("mail-listener2");

var mailListener = new MailListener({
  username: "",
  password: "",
  host: "",
  port: 993, // imap port
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "Inbox", // mailbox to monitor
  //searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: false, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: true} // options to be passed to mailParser lib.
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
  // do something with mail object including attachments
  var data = {
    uid: attributes.uid,
    from: mail.from[0].address,
    to: mail.to[0].address,
    labels: attributes['x-gm-labels']
  };

  /*
  var labels = attributes['x-gm-labels'];

  for (var i = 0, labelsLength = labels.length; i < labelsLength; i++) {
    var label = labels[i];
    console.log(label);
  }
  */
 
  console.log(data);
  
});

/* GET users listing. */
router.get('/setlabel/:uid/:label', function(req, res) {
  mailListener.imap.addLabels(req.params.uid, req.params.label, function(err) {
    (err) ? res.send(500) : res.send(200);
  });
});

module.exports = router;
