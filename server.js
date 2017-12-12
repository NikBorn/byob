const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    //had to add a second '=' above because of linter
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  next();
};

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

app.get('/api/v1/houses', (request, response) => {
  database('houses').select()
    .then(houses => {
      return response.status(200).json(houses);
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});


app.get('/api/v1/houses/:id/bills', (request, response) => {
  database('bills').select()
    .then(bills => {
      return response.status(200).json(bills);
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/houses/:id/chores', (request, response) => {
  database('chores').select()
    .then(chores => {
      return response.status(200).json(chores);
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/houses/:id/bulletins', (request, response) => {
  database('bulletins').select()
    .then(bulletins => {
      return response.status(200).json(bulletins);
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.delete('/api/v1/houses/:id/bills/:id', (request, response) => {
  const { id } = request.params;
  database('bills').where('id', id).select()
    .then(bills => {
      if (!bills.length) {
        return response.status(422).json({
          error: `Could not find a bill with an id of ${id}.`
        });
      }
      databse('bills').where('id', id).del()
        .then(() => {
          return response.status(500).json({ error });
        });
    });
});

app.delete('/api/v1/houses/:id/chores/:id', (request, response) => {
  const { id } = request.params;
  database('chores').where('id', id).select()
    .then(chores => {
      if (!chores.length) {
        return response.status(422).json({
          error: `Could not find a bill with an id of ${id}.`
        });
      }
      databse('chores').where('id', id).del()
        .then(() => {
          return response.status(500).json({ error });
        });
    });
});

app.delete('/api/v1/houses/:id/bulletins/:id', (request, response) => {
  const { id } = request.params;
  database('bulletins').where('id', id).select()
    .then(bulletins => {
      if (!bulletins.length) {
        return response.status(422).json({
          error: `Could not find a bill with an id of ${id}.`
        });
      }
      databse('bulletins').where('id', id).del()
        .then(() => {
          return response.status(500).json({ error });
        });
    });
});




app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;