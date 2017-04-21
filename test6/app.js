var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'sensor',
	password : 'mypassword',
	database : 'data'
});

connection.connect();

app.get('/', function(req, res) {
	res.send('hello world!');
});

app.get('/insert', function(req, res) {

	req.query.value = Number(req.query.value);
	fs.appendFile('mylog.txt', JSON.stringify(req.query), function(err){
	});
	connection.query('insert into sensors set ?', req.query);	
	console.log('data receive!' + JSON.stringify(req.query));
	res.send(JSON.stringify(req.query));
});

app.get('/update', function(req, res) {
	console.log("got it");
	console.log(req.query);
	console.log(typeof req.query);
	console.log(typeof JSON.stringify(req.query));
	console.log(typeof JSON.parse(JSON.stringify(req.query)));
	console.log(typeof req.query.api_key);
	res.send('Hello World!');
});

app.get('/graph', function (req, res) {
	console.log('got app.get(graph)');
	var html = fs.readFile('/home/pi/system-rasperry/test6/myapp.html', function (err, html) {
		html = " " + html
		console.log('read file');

		var qstr = 'select * from sensors';
		connection.query(qstr, function(err, rows, cols) {

			if(err) throw err;

			var data = "data.addRows([";
			var comma = "";
			var date = new Date;

			for(var i = 0; i < rows.length; i++) {
				r = rows[i];
				data += comma + "[new Date(" + r.time.getFullYear() +"," +r.time.getMonth() +","+ r.time.getDate()+"," + r.time.getHours() +"," +r.time.getMinutes() + "," + r.time.getSeconds() + ")"  + ","+ r.value +"]";
				comma = ",";
			}

			data += "]);";
			var header = "data.addColumn('date', 'Date/Time');"
			header += "data.addColumn('number', 'Temp');"
			html = html.replace("<%HEADER%>", header);
			html = html.replace("<%DATA%>", data);

			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(html);
			res.end();
		});
	});
})

app.listen(3000, function() {
	console.log('example app listening on port 3000');
});

