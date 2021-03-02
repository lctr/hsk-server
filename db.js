const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db/hsk.db');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true
});

const M = {
  created: t => console.log(`Table '${ t }' has been created!`),
  notCreated: (t, e) => console.error(`An error occurred creating the table ${ t }: ${ e }`),
  done: t => console.log(`table '${ t } exists`),
  stalled: e => console.error(`An error occurred setting up the database: ${ e }`)
};

// check for existence of words table
knex.schema
  .hasTable('words')
  .then((exists) => {
    if (!exists) {
      // recall columns are: id, level, character, pin1yin1, pinyin, english
      return knex.schema.createTable('words', table => {
        table.increments('id');
        table.integer('level');
        table.string('character');
        table.string('pin1yin1');
        table.string('pinyin');
        table.string('english');
      })
        .then(() => M.created('words'))
        .catch(e => M.notCreated('words', e));
    }
  })
  .then(() => M.done('words')).catch(M.stalled);

knex.schema.hasTable('users').then(exists => {
  if (!exists) {
    return knex.schema.createTable('users', tbl => {
      tbl.increments('id');
      tbl.string('username');
      tbl.string('password');
    })
      .then(() => M.created('users'))
      .catch(e => M.notCreated('users', e));
  }
})
  .then(() => M.done('users')).catch(M.stalled);

knex.schema.hasTable('scores').then(exists => {
  if (!exists) {
    return knex.schema.createTable('scores', tbl => {
      tbl.increments('id').primary();
      tbl.string('user_id');
      tbl.float('overall_score');
      tbl.float('pinyin_score');
      tbl.float('meaning_score');

      tbl.foreign('user_id').references('id').inTable('users');
    }).then(() => M.created('scores'))
      .catch(e => M.notCreated('scores', e));
  }
}).then(() => M.done('scores')).catch(M.stalled);

knex.schema.hasTable('attempts').then(exists => {
  if (!exists) {
    return knex.schema.createTable('attempts', tbl => {
      tbl.increments('id');
      tbl.integer('score_id').unsigned().notNullable();
      tbl.integer('word_id').unsigned().notNullable();
      tbl.boolean('attempted').notNullable();
      tbl.string('pinyin_attempt');
      tbl.boolean('pinyin_correct').notNullable();
      tbl.string('meaning_attempt');
      tbl.boolean('meaning_correct').notNullable();

      tbl.foreign('score_id').references('id').inTable('scores');
      tbl.foreign('word_id').references('id').inTable('words');
    });
  }
}).then(() => M.done('attempts')).catch(M.stalled);

knex.schema.hasTable('drills').then(exists => {
  if (!exists) {
    return knex.schema.createTable('drills', table => {
      table.increments('id');
      table.string('user_id');
      table.date('date_taken');
      table.integer('length').unsigned().notNullable();
      table.string('attempt_id');

      table.foreign('user_id').references('id').inTable('users');
      table.foreign('attempt_id').references('id').inTable('attempts');
    }).then(() => M.created('drills')).catch(e => M.notCreated('drills', e));
  }
}).then(() => M.done('drills')).catch(M.stalled);

// debugging
console.log(knex.schema.toSQL());
knex.select('*').from('drills')
  .then(data => console.log('results:', data))
  .catch(err => console.log(err));

module.exports = knex; 