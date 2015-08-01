var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/workshop-online-julho-2015');

var db = mongoose.connection;
db.on('error', function(err){
    console.log('Erro de conexao.', err);
});
db.on('open', function () {
  console.log('Conexão aberta.');
});
db.on('connected', function(err){
    console.log('Conectado');
});
db.on('disconnected', function(err){
    console.log('Desconectado');
});

var Schema = mongoose.Schema
  ,  _schema = {
        name: { type: String, default: '' }
      , description: { type: String, default: '' }
      , alcohol: { type: Number, min: 0, default: '' }
      , price: { type: Number, min: 0, default: '' }
      , category: { type: String, default: ''}
      , created_at: { type: Date, default: Date.now() }
    }
  , ModelSchema = new Schema(_schema)
  , Model = mongoose.model('Beer', ModelSchema)
  ;

module.exports = Model;