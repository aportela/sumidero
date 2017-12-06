"use strict";

/**
 * common object for interact with API
 * all methods return callback with vue-resource response object
 */
const sumideroAPI = {
    poll: function (callback) {
        Vue.http.get("api/user/poll").then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    },
    signUp: function (email, password, nick, callback) {
        var params = {
            email: email,
            password: password,
            nick: nick
        }
        Vue.http.post("api/user/signup", params).then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    },
    signIn: function (email, password, callback) {
        var params = {
            email: email,
            password: password
        }
        Vue.http.post("api/user/signin", params).then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    },
    signOut: function (callback) {
        Vue.http.get("api/user/signout").then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    },
    getPosts: function(callback) {
        Vue.http.get("api/posts").then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    }
};