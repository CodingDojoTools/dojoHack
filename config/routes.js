var teams = require('../controllers/teams.js');
var hackathons = require('../controllers/hackathons.js');


module.exports = function(app) {
    // session check for all routes but /login, /register & /
    app.all(/^\/(?!login$|register$|$).*$/, (req, res, next) => {
        console.log(req.originalUrl);
        if (req.session.userId) {
            console.log('user '+req.session.userId+' is logged in');
            next();
        } else {
            console.log('no user logged in');
            res.redirect('/');
        }
    }),

    app.get('/', (req, res) => { res.send("index"); });

    // teams
    app.post('/login',      (req, res) => { teams.login(req, res); }),

    app.post('/register',   (req, res) => { teams.register(req, res); }),

    app.get('/logout',      (req, res) => { teams.logout(req, res); }),

    // hackathons
    app.get('/hackathons/joined',   (req, res) => { hackathons.joined(req, res); }),

    app.get('/hackathons/current',  (req, res) => { hackathons.current(req, res); }),

    app.get('/hackathons/past',     (req, res) => { hackathons.past(req, res); })

}
