var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
              req.flash("error", "campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "you don't have permission to do that! ");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "you need to be logged in to do that ");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
               
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "you need to be logged in to do that! ");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkProfileOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            User.findById(req.params.id, function(err, foundUser){
                if(err || !foundUser){
                    req.flash("error","User not found");
                    res.redirect("back");
                } else {
                      
                        //does user own the campground?
                        if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                            next();
                        } else {
                            req.flash("error","you dont have permission to do that...");
                            res.redirect("back");
                        }
                }
        });
        } else {
            req.flash("error","You need to be logged in to do that...");
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that! ");
    res.redirect("/login");
}

module.exports = middlewareObj;