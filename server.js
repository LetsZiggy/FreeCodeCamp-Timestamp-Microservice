const http = require('http');
const fs = require('fs');

let months = [
  ['january', 'jan'],
  ['february', 'feb'],
  ['march', 'mar'],
  ['april', 'apr'],
  ['may', 'may'],
  ['june', 'jun'],
  ['july', 'jul'],
  ['august', 'aug'],
  ['september', 'sept'],
  ['october', 'oct'],
  ['november', 'nov'],
  ['december', 'dec']
];

function checkDateInputOrder(date) {
  let result = [null, null, null];
  for(let i = 0; i < date.length; i++) {
    if(checkIfYear(date[i])) {
      if(result[i] === null) {
        result[i] = 0;
     }
    }
    else if(checkIfMonth(date[i])) {
      if(result[i] === null) {
        result[i] = 1;
     }
    }
    else if(checkIfDate(date[i])) {
      if(result[i] === null) {
        result[i] = 2;
     }
    }
  }
  
  return(result);
}

function checkIfYear(year) {
  if(Number(year) && year >= 1970) {
    return(true);
  }
  else {
    return(false);
  }
}

function checkIfMonth(month) {
  let check = false;
  
  for(let i = 0; i < months.length; i++) {
    if(months[i].indexOf(month) !== -1) {
      check = true;
      break;
    }
  }
  
  return(check);
}

function checkIfDate(date) {
  if(Number(date) && date <= 31) {
    return(true);
  }
  else {
    return(false);
  }
}

function transformMonth(month) {
  month = month.toLowerCase();
  
  for(let i = 0; i < months.length; i++) {
    if(months[i].indexOf(month) !== -1) {
      return(months[i][0].charAt(0).toUpperCase() + months[i][0].slice(1));
      break;
    }
  }
  
  return(null);
}

function getNaturalDate(query) {
  if(query.length === 1) {
    let date = new Date(query[0] * 1000);
    let dateDate = date.getDate();
    let dateMonth = date.getMonth();
    let dateYear = date.getFullYear();

    if(dateDate <= 9) {
      dateDate = `0${dateDate}`;
    }

    console.log(dateMonth);
    dateMonth = months[dateMonth][0];
    dateMonth = dateMonth.charAt(0).toUpperCase() + dateMonth.slice(1);

    return(`${dateDate} ${dateMonth} ${dateYear}`);
  }
  else {
    if(transformMonth(query[0]) !== null) {
      if(query[1] <= 31 && query[1] <= 9) {
        query[1] = `0${query[1]}`;
      }
      else if(query[2] <= 31 && query[2] <= 9) {
        query[2] = `0${query[2]}`;
      }
      query[0] = transformMonth(query[0]);
    }
    else if(transformMonth(query[1]) !== null) {
      if(query[0] <= 31 && query[0] <= 9) {
        query[0] = `0${query[0]}`;
      }
      else if(query[2] <= 31 && query[2] <= 9) {
        query[2] = `0${query[2]}`;
      }
      query[1] = transformMonth(query[1]);
    }
    else if(transformMonth(query[2]) !== null) {
      if(query[0] <= 31 && query[0] <= 9) {
        query[0] = `0${query[0]}`;
      }
      else if(query[1] <= 31 && query[1] <= 9) {
        query[1] = `0${query[1]}`;
      }
      query[2] = transformMonth(query[2]);
    }
    
    return(`${query[0]} ${query[1]} ${query[2]}`);
  }
}

function extractQuery(query) {
  return(query.slice(1).split('%20'));
}

function determineQuery(query) {
  let result = { unix: null, natural: null };
  let extract = extractQuery(query);

  if(extract.length === 1) {
    result.unix = extract[0];
    result.natural = getNaturalDate(extract);
  }
  else {
    let dateOrder = checkDateInputOrder(extract);
    let date = [null, null, null];

    for(let i = 0; i < dateOrder.length; i++) {
      if(dateOrder[i] === 0) {
        date[0] = extract[i];
      }
      else if(dateOrder[i] === 1) {
        date[1] = extract[i];
      }
      else {
        date[2] = extract[i];
      }
    }

    result.unix = new Date(date).getTime() / 1000;
    result.natural = getNaturalDate(extract);
  }

  return(result);
}

let html = null;
let css = null;

fs.readFile('./www/index.html', (err, data) => {
  if(err) { console.log(err); throw err; }
  else {
    html = data;
  }
});

fs.readFile('./www/style.css', (err, data) => {
  if(err) { console.log(err); throw err; }
  else {
    css = data;
  }
});

let server = http.createServer((req, res) => {
  if(req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
  else if(req.url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(css);
  }
  else if(req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end();
  }
  else {
    let query = determineQuery(req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify(query));
  }
}).on('error', (err) => { console.lg(err); throw err; });

let listener = server.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});