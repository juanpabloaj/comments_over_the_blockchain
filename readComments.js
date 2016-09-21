var btcAddress = '1PSkveEc7eq9vnSNyyVrdJtpK3sPxm184z';

function hex_to_ascii(str1){
  var hex  = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

function insertComments(comments){
  html = '<h2>Comments from the blockchain</h2>'
   + '<p>To insert a comment make a transaction to '
   + btcAddress + ' with a transaction message.</p>';

  for (var i = 0; i < comments.length; i ++) {
    var comment = comments[i];

    html += '<p>' + hex_to_ascii(comment.comment) + ' - <i>' + comment.vinAddr
      + ', ' + (new Date(comment.time * 1000)) + '</i></p>'

  }

  return html;
}

$(document).ready(function() {
  var url = 'https://blockexplorer.com/api/txs/?address=' + btcAddress;


  $.get(url).then(function(data){
    var comments = [];

    for (var i = 0; i < data.txs.length; i++) {
      for (var j = 0; j < data.txs[i].vout.length; j++) {

        var vinAddr = data.txs[i].vin[0].addr;
        var scriptPubKey = data.txs[i].vout[j].scriptPubKey.asm;

        if (scriptPubKey.indexOf('OP_RETURN') !== -1){
          var comment = scriptPubKey.split(' ').slice(-1)[0];
          comments.push({
            comment:comment, time:data.txs[i].time, vinAddr:vinAddr
          });
        }

      }
    }

    return comments;
  }).then(function(comments) {

    document.body.innerHTML += insertComments(comments);

  });
});
