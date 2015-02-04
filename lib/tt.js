var qs = require('querystring');

exports.sendHtml = function(res, html) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.bytelength(html));
  res.end(html);
};

exports.parseReceivedData = function(req, cb) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    body += chunk
  });
  req.on('end', function() {
    var data = qs.parse(body);
    cb(data);
  });
};

exports.actionForm = function(id, path, label) {
  var html = '<form method="POST" action="' + path + '">' +
  '<input type="hidden" name="id" value="' + id + '">' +
  '<input type="submit" value="' + label + '" />' +
  '</form>';

  return html;
};

exports.add = function(db, req, res) {
  exports.parseReceivedData(req, function(work) {
    db.query(
      "INSERT INTO work (hours, data, description) " +
      " VALUES (?, ?, ?)",
      [work.hours, work.data, work.description],

      function (err) {
        if (err) throw err;
        exports.show(db, res);
      }
    );
  });
};

exports.delete = function(db, req, res) {
  exports.parseReceivedData(req, function(work) {
    db.query(
      "DELETE FROM work WHERE id=?",
      [work.id],
      function(err) {
        if (err) throw err;
        exports.show(db, res);
      }
    );
  });
};

exports.archive = function(db, req, res) {
  exports.parseReceivedData(req, function(work) {
    db.query(
      "UPDATE work SET archived=1 WHERE id=?",
      [work.id],
      function (err) {
        if (err) throw err;
        exports.show(db, res);
      }
    );
  });
};

exports.show = function(db, res, showArchived) {
  var query = "SELECT * FROM work " +
    "WHERE archived=? " +
    "ORDER BY date DESC";

  var achiveValue = (showArchived) ? 1 : 0;

  db.query(
    query,
    [achiveValue],
    function(err, rows) {
      if (err) throw err;
      html = (showArchived) ? '' : '<a href="/archived">Archived Work</a>';
      html += exports.workHitlistHtml(rows);
      html += exports.workFormHtml();
      exports.sendHtml(res, html);
    }
  );
};