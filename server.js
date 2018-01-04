const http = require('http');

let defaultTemplate = `<!DOCTYPE html>
                       <html>
                         <head>
                           <title>FreeCodeCamp - API Projects - Timestamp Microservice</title>
                           <style>
                             body {
                               font-family: Helvetica, sans-serif;
                               padding: 1rem 2rem;
                             }
                             div {
                               padding-left: 1rem;
                               margin: 0.5rem;
                               border-left: 5px solid rgb(235, 235, 235);
                             }
                             p {
                               -webkit-margin-before: 0rem;
                               -webkit-margin-after: 0rem;
                               -webkit-margin-start: 0rem;
                               -webkit-margin-end: 0rem;
                               margin: 1rem 0rem 0rem 0rem;
                               text-decoration: underline;
                             }
                             ol {
                               -webkit-margin-before: 0rem;
                               -webkit-margin-after: 0rem;
                               -webkit-margin-start: 0rem;
                               -webkit-margin-end: 0rem;
                               margin: 0.5rem 0rem 0rem 0rem;
                             }
                             li {
                               font-size: 0.85rem;
                               margin-bottom: 0.1rem;
                             }
                             span {
                               display: inline-block;
                               margin: 3px 0rem;
                               padding: 3px;
                               font-size: 0.75rem;
                               color: firebrick;
                               background-color: rgba(255, 150, 150, 0.1);
                             }
                             h3 {
                               -webkit-margin-before: 0rem;
                               -webkit-margin-after: 0rem;
                               -webkit-margin-start: 0rem;
                               -webkit-margin-end: 0rem;
                               margin: 1rem 0rem 0rem 0rem;
                             }
                           </style>
                         </head>
                         <body>
                           <h1>API Basejump: Timestamp Microservice</h1>
                           <div>
                             <p>User stories:</p>
                             <ol>
                               <li>I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural  language date (example: January 1, 2016)</li>
                               <li>If it does, it returns both the Unix timestamp and the natural language form of that date.</li>
                               <li>If it does not contain a date or Unix timestamp, it returns null for those properties.</li>
                             </ol>
                           </div>
                           <h3>Example usage:</h3>
                           <span>https://timestamp-ms.herokuapp.com/December%2015,%202015</span>
                           <br>
                           <span>https://timestamp-ms.herokuapp.com/1450137600</span>
                           <h3>Example output:</h3>
                           <span>{ "unix": 1450137600, "natural": "December 15, 2015" }</span>
                         </body>
                       </html>`;

let months = [['january', 'jan'], ['february', 'feb'], ['march', 'mar'], ['april', 'apr'], ['may'], ['june', 'jun'], ['july', 'jul'], ['august', 'aug'], ['september', 'sept'], ['october', 'oct'], ['november', 'nov'], ['december', 'dec']];

function checkDateInput(date) {
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
      return(i);
      break;
    }
  }
  
  return(null);
}

function getNaturalDate(query) {
  if(query.length !== 1) {
    if(transformMonth(query[0]) !== null) {
      if(query[1] <= 31 && query[1] <= 9) {
        query[1] = `0${query[1]}`;
      }
      else if(query[2] <= 31 && query[2] <= 9) {
        query[2] = `0${query[2]}`;
      }
      query[0] = transformMonth(query[0]);
      query[0] = months[query[0]][0].charAt(0).toUpperCase() + months[query[0]][0].slice(1);
    }
    else if(transformMonth(query[1]) !== null) {
      if(query[0] <= 31 && query[0] <= 9) {
        query[0] = `0${query[0]}`;
      }
      else if(query[2] <= 31 && query[2] <= 9) {
        query[2] = `0${query[2]}`;
      }
      query[1] = transformMonth(query[1]);
      query[1] = months[query[1]][0].charAt(0).toUpperCase() + months[query[1]][0].slice(1);
    }
    else if(transformMonth(query[2]) !== null) {
      if(query[0] <= 31 && query[0] <= 9) {
        query[0] = `0${query[0]}`;
      }
      else if(query[1] <= 31 && query[1] <= 9) {
        query[1] = `0${query[1]}`;
      }
      query[2] = transformMonth(query[2]);
      query[2] = months[query[2]][0].charAt(0).toUpperCase() + months[query[2]][0].slice(1);
    }
    
    return(`${query[0]} ${query[1]} ${query[2]}`);
  }
  else {
    let date = new Date(query[0] * 1000);
    let dateDate = date.getDate();
    let dateMonth = date.getMonth();
    let dateYear = date.getFullYear();

    if(dateDate <= 9) {
      dateDate = `0${dateDate}`;
    }

    dateMonth = months[dateMonth][0];
    dateMonth = dateMonth.charAt(0).toUpperCase() + dateMonth.slice(1);

    return(`${dateDate} ${dateMonth} ${dateYear}`);
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
    let dateOrder = checkDateInput(extract);
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

let server = http.createServer((req, res) => {
  let query = determineQuery(req.url);
  
  if(req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(defaultTemplate);
  }
  else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify(query));
  }
}).on('error', (err) => { console.lg(err); throw err; });

let listener = server.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});