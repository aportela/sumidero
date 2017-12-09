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
    scrap: function (url, callback) {
        var params = {
            url: url
        };
        Vue.http.post("api/post/scrap", params).then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    },
    addPost: function (url, title, body, sub, tags, callback) {
        var params = {
            externalUrl: url,
            title: title,
            body: body,
            sub: sub,
            tags: tags
        };
        Vue.http.post("api/post/add", params).then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    },
    getPosts: function (timestamp, sub, tag, callback) {
        var params = {
            timestamp: timestamp,
            sub: sub,
            tag: tag
        };
        Vue.http.get("api/posts", { params: params }).then(
            response => {
                callback(response);
            },
            response => {
                callback(response);
            }
        );
    }
};