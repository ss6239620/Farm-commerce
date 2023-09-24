const jwtStrategy = require('passport-jwt').Strategy
const mongoose = require('mongoose')
const User = mongoose.model("users");
const keys = require('./keys');
const { ExtractJwt } = require('passport-jwt');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey

module.exports = (passport) => {
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return (null, false);
                })
                .catch(err => { console.log(err) })
        })
    )
}
