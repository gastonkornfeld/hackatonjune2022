


const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/public/pages");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

const db = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-34-200-35-222.compute-1.amazonaws.com',
        user: 'ykwpznbbsgzsam',
        password: '8ce4d68cca141b18bfd046fb4b7bd09947a8c00416238a5e3315386bfe99302d',
        database: 'd49rth5vjf0kgq',
        port: 5432,
        ssl: {rejectUnauthorized: false}
    }
});

app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.log(err);
  }
});


app.get('/players', (req, res) => {
  db
  .select().from('players')
  .then(players =>
    res.render('players', {players})
  )
})


app.get('/teams', (req, res) => {
    db
    .select().from('teams')
    .orderBy('team_name')
    .then(teams =>
      res.render("teams", { teams })
    )
})

app.post('/add_team',(req,res)=>{
  // console.log('req.body=>', req.body);
  db('teams')
    .insert({ team_id: req.body.id, team_name: req.body.name, team_country: req.body.country, team_description: req.body.description, team_logo: req.body.logo })
    .then(teams =>
      res.render("index")
    )
})

app.post('/add_player',(req,res)=>{
  // console.log('req.body=>', req.body);
  db('players')
    .insert({ player_id: req.body.id, player_name: req.body.name, born_date: req.body.born_date, rating: req.body.rating, team_id:req.body.team })
    .then(players =>
      res.render("index")
    )
})

app.get('/team/:id', (req, res) => {
  db
  .select().from('teams')
  .where('team_id', req.params.id)
  .then(team =>
    res.render("team", {team})
  )
})

// app.set("db", db);

app.listen(3000, () => console.log('Example app listening on port 3000!'));



