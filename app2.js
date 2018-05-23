var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
var mongoose = require('mongoose');

//**********************************MongoDB*************************************
//connection à la BDD
mongoose.connect('mongodb+srv://Henri:1234@integrationcontinue-5s8t6.mongodb.net/test', function(err) {
  if (err) { throw err; }
});
//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
//mongodb+srv://Amaury:<PASSWORD>@integrationcontinue-5s8t6.mongodb.net/test

var commentaireArticleSchema = new mongoose.Schema({
  numero : { type : String },
  contenu : String,
  date : { type : Date, default : Date.now }
});

// Création du Model pour les commentaires
var CommentaireArticleModel = mongoose.model('contenu', commentaireArticleSchema);

var monCommentaire = new CommentaireArticleModel({ numero : '1' });
// On rajoute le contenu du commentaire, possible de le faire lors de l'instanciation
monCommentaire.contenu = 'Salut, super article sur Mongoose !';

// On le sauvegarde dans MongoDB !
monCommentaire.save(function (err) {
  if (err) { throw err; }
  console.log('Commentaire ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});

//**************************************fin MongoDB*************************************
/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}))


/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})

/* On affiche la todolist et le formulaire */
.get('/todo', function(req, res) { 
    res.render('todo.ejs', {todolist: req.session.todolist});
})

/* On ajoute un élément à la todolist */
.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    res.redirect('/todo');
})

//on ferme la connection à la BDD
//mongoose.connection.close();

.listen(3000);   