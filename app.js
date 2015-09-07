var express = require('express'),
	bodyParser = require('body-parser'),
	db = require("./models"),
	app = express(),
	methodOverride = require('method-override'),
	favicon = require('serve-favicon');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// var park = new db.Activity({
//   name: 'go to park',
//   location: 'civic park',
// });

// park.save(function(err) {
//   if (err) throw err;

//   console.log('park saved successfully!');
// });

app.get("/", function(req, res) {
	res.redirect("/activities")
})

var apiRouter = express.Router();

apiRouter.route('/votes/:id')
.get(function(req,res){
  //return res.json({message: "Nice you hit the HTTP request :: " + req.params.id});
  db.Activity.findById(req.params.id, function(err, activity) {
  	if(activity.votes >= 0){
				activity.votes = activity.votes+1
			}
			else {
				activity.votes = 1
			}
			
				activity.save();
				res.redirect("/activities/");
			});
})

app.get("/activities", function(req, res) {
	db.Activity.find({}, function(err, activities) {
		if (err) {
			console.log(err)
		} else {
			res.render('activities/index', {
				activities: activities
			});
		}
	})
})

app.get('/activities/new', function(req, res) {
	res.render("activities/new")
})

// SHOW
app.get('/activities/:id', function(req, res) {
	db.Activity.findById(req.params.id).populate("babies").exec(function(err, activity) {
		res.render("activities/show", {
			activity: activity
		});
	})

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
					babies: babies
				});
			})
		}
	})

});

// UPDATE
app.put('/activities/:id', function(req, res) {
	console.log(req.body)
	db.Activity.findByIdAndUpdate(req.params.id, {
			name: req.body.name,
			location: req.body.location,
			image: req.body.image,
			date: req.body.date,
			babies: req.body.babyid,
		
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
				activity: activity
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
				babies: babies
			});
		}
	})
})

app.post('/activities', function(req, res) {
	db.Activity.create({
		name: req.body.name,
		location: req.body.location,
		image: req.body.image
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
app.delete('/babies/:id', function(req,res){
 db.Baby.findByIdAndRemove(req.params.id,
      function (err, baby) {
        if(err) {
          console.log(err);
          res.render("/babies/");
        }
        else {
          res.redirect("/babies/");
        }
      });
});

app.use('/', apiRouter);

app.listen(3000, function() {
	"Server is listening on port 3000";
});