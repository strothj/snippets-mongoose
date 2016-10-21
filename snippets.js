const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/');

mongoose.connection.on('error', (err) => {
  console.error('Could not connect. Error:', err);
});

mongoose.connection.once('open', () => {
  const snippetSchema = mongoose.Schema({ // eslint-disable-line new-cap
    name: { type: String, unique: true },
    content: String,
  });

  const Snippet = mongoose.model('Snippet', snippetSchema);

  const create = (name, content) => {
    const item = { name, content };
    Snippet.create(item, (err, snippet) => {
      if (err || !snippet) {
        console.error('Could not create snippet', name);
        mongoose.disconnect();
        return;
      }
      console.log('Created snippet', snippet.name);
      mongoose.disconnect();
    });
  };

  const read = (name) => {
    Snippet.findOne({ name }, (err, snippet) => {
      if (err || !snippet) {
        console.error('Could not read snippet', name);
        mongoose.disconnect();
        return;
      }
      console.log('Read snippet', snippet.name);
      console.log(snippet.content);
    });
  };

  const update = (name, content) => {
    Snippet.findOneAndUpdate({ name }, { content }, (err, snippet) => {
      if (err || !snippet) {
        console.error('Could not update snippet', name);
        mongoose.disconnect();
        return;
      }
      console.log('Updated snippet', snippet.name);
      mongoose.disconnect();
    });
  };

  const del = (name) => {
    Snippet.findOneAndRemove({ name }, (err, snippet) => {
      if (err || !snippet) {
        console.error('Could not delete snippet', name);
        mongoose.disconnect();
        return;
      }
      console.log('Deleted snippet', snippet.name);
      mongoose.disconnect();
    });
  };

  switch (process.argv[2]) {
    case 'create':
      create(process.argv[3], process.argv[4]);
      break;
    case 'read':
      read(process.argv[3]);
      break;
    case 'update':
      update(process.argv[3], process.argv[4]);
      break;
    case 'delete':
      del(process.argv[3]);
      break;
    default:
      console.error('Invalid command.');
  }

  mongoose.connection.close();
});
