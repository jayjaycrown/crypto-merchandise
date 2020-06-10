const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');

var app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(cors({
  origin: '*'
}));

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, process.env.IP, () => {
  console.log('Server is running on ' + port);
})