const http = require('http'); //imports Node's built in web server module
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json())
app.use(morgan('tiny'));

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number":"040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number":"39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number":"12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number":"39-23-6423122"
    },
]

app.get('/', (request, response) => {
    response.send('<h1> Hello World! <h1>');
})

app.get('/api/persons', (request, response) =>{
    response.json(phonebook);
})

app.get('/info', (request, response) => {
    let phonebooklist = phonebook.length;
    response.send(`Phonebook has info for ${phonebooklist} people <br /><br /> ${new Date()}`);
})

app.get('/api/persons/:personid', (request, response) => {
    const id = Number(request.params.personid);
    const person = phonebook.find(phoneEntry => phoneEntry.id === id);

    if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter(person => person.id !== id);
  
    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const randomId = Math.floor(Math.random() * 1000000);


  const newMeowMeow = request.body;
  console.log(request);
  newMeowMeow.id = randomId;
  let newName = newMeowMeow.name;
  let nameTaken = phonebook.find(person => person.name === newName);
  let numberTaken = phonebook.find(person => person.number === newMeowMeow.number);

  if (nameTaken) {
    return response.status(400).json({ 
      error: 'name taken' 
    })
  }

  if (numberTaken) {
    return response.status(400).json({ 
      error: 'number taken' 
    })
  }

  phonebook = phonebook.concat(newMeowMeow);

  response.json(newMeowMeow);

  
})

morgan.token('newPerson', (request, response) => {
    if (request.method === 'POST'){
        return JSON.stringify(request.body)
    }
    else{
    return null
    }
})


const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`); //bind the http server assigned to the app variable, to listen to HTTP requests sent to the port 3001

