var teams = require('../controllers/teams.js');
var users = require('../controllers/users.js');
var hackathons = require('../controllers/hackathons.js');

// =============================================================

//                  Postman collection link

// https://www.getpostman.com/collections/c3d1292b181c6c40672b 

// =============================================================



// =============================================================
//                     Middleware routes
// =============================================================
// if you need a route to be checked for admin or team session,
// add it to the coresponding array.
// If session is not found, {status: false} will be returned

const safeForTeams = [
    '/hackathons/:hackId/join'
]

const safeForAdmin = [
    '/hackathons',
    '/scores'
]

// =============================================================




module.exports = function(app) {

    // =============================================================
    //                        Middleware
    // =============================================================

    // session check for all routes but /login, /register & /
    app.all(/^\/(?!login|register|$).*$/, (req, res, next) => {
        console.log(req.originalUrl);
        if (req.session.userId) {
            console.log('user '+req.session.userId+' is logged in');
            next();
        } else {
            console.log('no user logged in');
            res.redirect('/');
        }
    }),

    // admin check
    app.all(safeForAdmin, (req, res, next) => {
        console.log(req.originalUrl);
        if (req.session.admin) {
            console.log('user '+req.session.userId+' is admin');
            next();
        } else {
            console.log('user is not admin');
            res.json({"status": false});
        }
    }),
    
    // team check
    app.all(safeForTeams, (req, res, next) => {
        console.log(req.originalUrl);
        if (req.session.team) {
            console.log('user '+req.session.userId+' is a team');
            next();
        } else {
            console.log('user is not a team');
            res.json({"status": false});
        }
    })


// -----------------------------------------------------------------
    // angular
    
    app.get('/', (req, res) => { res.send("index"); });
    
    // =============================================================
    //                          Users
    // =============================================================
    app.post('/login/admin',    (req, res) => { users.login(req, res); }),
    
    app.post('/register/admin', (req, res) => { users.register(req, res); }),
    

    // =============================================================
    //                          Teams
    // =============================================================
    app.post('/login',      (req, res) => { users.login(req, res, "teams"); }),
    
    app.post('/register',   (req, res) => { users.register(req, res, "teams"); }),
    
    app.get('/logout',      (req, res) => { users.logout(req, res); }),
    

    // =============================================================
    //                       Hackathons
    // =============================================================
    app.post('/hackathons',         (req, res) => { hackathons.create(req, res); }),

    app.get('/hackathons/joined',   (req, res) => { hackathons.joined(req, res); }),

    app.get('/hackathons/current',  (req, res) => { hackathons.current(req, res); }),

    app.get('/hackathons/past',     (req, res) => { hackathons.past(req, res); }),

    app.get('/hackathons/:hackId/join', (req, res) => { hackathons.join(req, res); })

}
