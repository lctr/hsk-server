const knex = require('./../db');

exports.wordsAll = async (req, res) => {
  knex.select('*').from('words')
    .then(data => { res.json(data); })
    .catch(err => {
      res.json({ message: `there was an error loading all hsk words: ${err}` });
    });
}

exports.wordsByLevel = async (req, res) => {
  let level = parseInt(req.params.level, 10);
  if (![1, 2, 3, 4, 5, 6].includes(level)) {
    level = 1; 
    console.log('invalid level provided, going with default level = 1')
  }
  knex.select('*').from('words').where('level', level)
    // .then(data => console.log(data))
    .then(data => { res.json(data); })
    .catch(err => console.error(err)); 
}

function shuffleArray(arr, size=25) {
  let indxs = [], r = size, rand;
  do {
    rand = Math.floor(Math.random() * size);
    if (indxs.includes(rand)) {
      r++;
    } else {
      indxs.push(rand);
    }
    r--;
  } while (r);
  if (Array.isArray(arr)) {
    let l = size;
    while (l) {
      indxs[l - 1] = arr[l - 1];
      --l;
    }
  }
  return indxs;
}

// exports.wordsByLevel = async (req, res) => {
//   let level = req.body.level;

// }

// function getQuizByLevel(level) {
//   let db = new sqlite3.Database('./db/hsk.db', err => {
//     if (err) console.error(err.message); 
//     console.log('Connected to HSK database'); 
//   });

//   const sql = `SELECT id, level, character, 
//     pin1yin1, pinyin, english 
//     from words where level = ?`;
  
//   let quiz = []; 
  
//   db.all(sql, [level], (err, rows) => {
//     if (err) {
//       throw err; 
//     }
//     rows.forEach(row => {
//       quiz.push(row); 
//     }); 
//   });

//   db.close(); 

//   return shuffleArray(quiz);
// }

