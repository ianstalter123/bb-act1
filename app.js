	var express = require('express'),
	bodyParser = require('body-parser'),
	db = require("./models"),
	app = express(),
	methodOverride = require('method-override');
	cookieParser = require('cookie-parser');
	mongoose = require('mongoose');
	passport = require('passport');
	LocalStrategy = require('passport-local').Strategy;

	routes = require('./routes/index');
	users = require('./routes/users');

	app.use(cookieParser());
	app.use(require('express-session')({
		secret: 'keyboard cat',
		resave: false,
		saveUnitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	var Account = require('./models/account');
	passport.use(new LocalStrategy(Account.authenticate()));
	passport.serializeUser(Account.serializeUser());
	passport.deserializeUser(Account.deserializeUser());
	// favicon = require('serve-favicon');
	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'ejs');
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(methodOverride('_method'));
// app.use(favicon(__dirname + '/public/favicon.ico'));

// var park = new db.Activity({
//   name: 'go to park',
//   location: 'civic park',
// });

// park.save(function(err) {
//   if (err) throw err;

//   console.log('park saved successfully!');
// });



	var apiRouter = express.Router();

	apiRouter.route('/votes/:id')
	.get(function(req, res) {
		//return res.json({message: "Nice you hit the HTTP request :: " + req.params.id});
		db.Activity.findById(req.params.id, function(err, activity) {
			if (activity.votes >= 0) {
				activity.votes = activity.votes + 1
			} else {
				activity.votes = 1
			}

			activity.save();
			res.redirect("/activities/");
		});
	})

	apiRouter.route('/data')
	.get(function(req, res) {
		db.Activity.find({}, function(err, activities) {
			if (err) {
				console.log(err)
			} else {
				console.log(activities)
				res.send(activities);
			}
		})
	})

	app.get("/", function(req, res) {
		res.redirect("/activities")
	})

	app.get("/activities", function(req, res) {
		db.Activity.find({}, function(err, activities) {
			if (err) {
				console.log(err)
			} else {
				res.render('activities/index', {
					activities: activities,user : req.user
				});
			}
		})
	})

	app.get('/activities/new', function(req, res) {
		res.render("activities/new", { user: req.user})
	})

// SHOW
app.get('/activities/:id', function(req, res) {
	db.Activity.findById(req.params.id).populate("babies").populate("tasks").exec(function(err, activity) {
		res.render("activities/show", {
			activity: activity, user: req.user
		});
	})

});

app.get('/activities/:id/tasks/new', function(req, res) {
	db.Activity.findById(req.params.id).populate("babies", "tasks").exec(function(err, activity) {
		res.render("tasks/new", {
			activity: activity, user: req.user
		});
	})

});

app.get('/activities/:id/tasks/new', function(req, res) {
	db.Activity.findById(req.params.id).populate("babies").exec(function(err, activity) {
		res.render("tasks/new", {
			activity: activity, user: req.user
		});
	})

});

app.get('/register', function(req, res) {
	res.render('users/register', { });
});

app.post('/register', function(req, res) {
	Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
		if (err) {
			return res.render('users/register', { account : account });
		}

		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});
});

app.get('/login', function(req, res) {
	res.render('users/login', { user : req.user });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/ping', function(req, res){
	res.status(200).send("pong!");
});

// CREATE baby
app.post('/activities/:id/tasks', function(req, res) {

	db.Task.create({
		name: req.body.name,
		completed: req.body.completed,
	}, function(err, task) {
		console.log(task)
		if (err) {
			console.log(err);
			console.log("pIZIZIPZIP")
			res.render("tasks/new");
		} else {
			db.Activity.findById(req.params.id, function(err, activity) {
				activity.tasks.push(task);
				task.activity = activity._id;
				task.save();
				activity.save();
				res.redirect("/activities/" + req.params.id);
			});
		}
	});
});

// EDIT
app.get('/activities/:id/edit', function(req, res) {
	db.Baby.find({}, function(err, babies) {
		if (err) {
			console.log(err)
		} else {


			db.Activity.findById(req.params.id).populate("babies").exec(function(err, activity) {
				res.render("activities/edit", {
					activity: activity,
					babies: babies, user: req.user
				});
			})
		}
	})

});

// UPDATE
app.put('/activities/:id', function(req, res) {

	db.Activity.findById(req.params.id, function(err, activity) {
		console.log(req.body)
		user: req.body.user
	
	}),
	
	db.Activity.findByIdAndUpdate(req.params.id, {
		name: req.body.name,
		location: req.body.location,
		image: req.body.image,
		completed: req.body.completed,
		date: req.body.date,
		babies: req.body.babyid,
		user: req.body.user,
		

	},
	function(err, activity) {
		if (err) {
			res.render("activities/edit");
		} else {
			console.log("babies:" + activity.babies)
			res.redirect("/activities/" + activity._id);
		}
	});
});

//new baby for activity
app.get('/activities/:activity_id/babies/new', function(req, res) {
	db.Activity.findById(req.params.activity_id,
		function(err, activity) {
			res.render("babies/new", {
				activity: activity, user: req.user
			});
		});
});

// CREATE baby
app.post('/activities/:activity_id/babies', function(req, res) {

	db.Baby.create({
		name: req.body.name,
		age: req.body.age,
		image: req.body.image
	}, function(err, baby) {
		console.log(baby)
		if (err) {
			console.log(err);
			res.render("babies/new");
		} else {
			db.Activity.findById(req.params.activity_id, function(err, activity) {
				activity.babies.push(baby);
				baby.activity = activity._id;
				baby.save();
				activity.save();
				res.redirect("/activities/" + req.params.activity_id);
			});
		}
	});
});


app.get("/babies", function(req, res) {
	db.Baby.find({}, function(err, babies) {
		if (err) {
			console.log(err)
		} else {
			res.render('babies/index', {
				babies: babies, user: req.user
			});
		}
	})
})

app.post('/activities', function(req, res) {
	db.Activity.create({
		name: req.body.name,
		location: req.body.location,
		image: req.body.image,
		completed: 'false'
	}, function(err, activity) {
		if (err) {
			console.log(err);
			res.render("activities/new");
		} else {
			console.log(activity);
			res.redirect("/activities");
		}
	});
});

// DESTROY
app.delete('/babies/:id', function(req, res) {
	db.Baby.findByIdAndRemove(req.params.id,
		function(err, baby) {
			if (err) {
				console.log(err);
				res.render("/babies/");
			} else {
				res.redirect("/babies/");
			}
		});
});

app.use('/', apiRouter);

app.listen(process.env.PORT || 3002, function() {
	console.log("Welcome to the machine");
});