const knex = require('./../db');

exports.isUser = async function isUser (req, res) {
  let username = req.params.usr.replace(/\;|\s/g, '');
  if (username) {
    const isUser = await knex.select('id')
      .from('users').where('username', '=', username).limit(1)
      .catch(e => console.error(e));
    console.log(isUser);
    res.send(isUser[ 0 ] ? true : false);
  } else {
    res.send(null);
  }
};

exports.registerUser = async function registerUser (req, res) {
  knex('users').insert({
    'username': req.body.username,
    'password': req.body.password
  }, [ 'id' ]).then(data => {
    const userId = data[ 0 ] ? data[ 0 ][ 'id' ] : null;
    res.json({
      status: userId ? 'success' : 'failure',
      user: req.body.username,
      userId: data[ 0 ][ 'id' ]
    });
  })
    .catch(console.error);
};

exports.loginUser = async function loginUser (req, res) {
  let { username, password } = req.body;
  knex.select('*')
    .from('users')
    .where('username', '=', username)
    .andWhere('password', '=', password)
    .limit(1)
    .then(data => {
      console.log(data);
      let id = data[ 0 ][ 'id' ];
      let loggedIn = false;
      if (data[ 0 ][ 'id' ]) {
        loggedIn = true;
      }
      console.log({ id, loggedIn });
      res.json({ id, loggedIn });
    })
    .catch(console.error);
};

// exports.newUserScore = async function recordDrill(req, res) {
//   const scoreId = await knex.insert({
//     'user_id': req.body.id,
//     'overall_score': req.body.overallScore,
//     'pinyin_score': req.body.pinyinScore,
//     'meaning_score': req.body.meaningScore
//   }, ['id']).into('scores').catch(console.error);
//   return scoreId; 
// }