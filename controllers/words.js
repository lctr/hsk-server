const knex = require('./../db');

exports.wordsAll = async (req, res) => {
  knex.select('*').from('words')
    .then(data => { res.json(data); })
    .catch(err => {
      res.json({ message: `there was an error loading all hsk words: ${ err }` });
    });
};

exports.wordsByLevel = async (req, res) => {
  let level = parseInt(req.params.level, 10);
  if (![ 1, 2, 3, 4, 5, 6 ].includes(level)) {
    level = 1;
    console.log('invalid level provided, going with default level = 1');
  }
  knex.select('*').from('words').where('level', level)
    // .then(data => console.log(data))
    .then(data => { res.json(data); })
    .catch(err => console.error(err));
};
