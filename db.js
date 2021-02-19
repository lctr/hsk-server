const path = require('path');

const dbPath = path.resolve(__dirname, 'db/hsk.db');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true
});

// check for existence of words table
knex.schema
  .hasTable('words')
  .then((exists) => {
    if (!exists) {
      // recall columns are: id, level, character, pin1yin1, pinyin, english
      return knex.schema.createTable('words', (table) => {
        table.increments('id').primary();
        table.integer('level');
        table.string('character');
        table.string('pin1yin1');
        table.string('pinyin');
        table.string('english');
      })
        .then(() => console.log("Table 'words' has been created!"))
        .catch(e => console.log(`An error occurred creating the table 'words': ${e}`));
    }
  })
  .then(() => console.log('done'))
  .catch(e => console.log(`An error occurred setting up the database: ${e}`)); 

// debugging
// knex.select('*').from('words')
//   .then(data => console.log('results:', data))
//   .catch(err => console.log(err)); 

module.exports = knex; 