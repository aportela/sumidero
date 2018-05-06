"use strict";

/**
 * common object for interact with API
 * all methods return callback with vue-resource response object
 */
const sumideroAPI = {
    poll: function (callback) {
        Vue.http.get("api/user/poll").then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
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
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
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
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    },
    signOut: function (callback) {
        Vue.http.get("api/user/signout").then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    },
    scrap: function (url, callback) {
        var params = {
            url: url
        };
        Vue.http.post("api/post/scrap", params).then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    },
    addPost: function (url, title, body, sub, tags, thumbnail, callback) {
        var params = {
            externalUrl: url,
            title: title,
            body: body,
            sub: sub,
            tags: tags,
            thumbnail: thumbnail
        };
        Vue.http.post("api/post/add", params).then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    },
    updatePost: function (id, url, title, body, sub, tags, thumbnail, callback) {
        var params = {
            id: id,
            externalUrl: url,
            title: title,
            body: body,
            sub: sub,
            tags: tags,
            thumbnail: thumbnail
        };
        Vue.http.put("api/post/update", params).then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    },
    getPost: function (permaLink, callback) {
        var params = {
            permaLink: permaLink
        };
        Vue.http.get("api/post/permalink/" + permaLink).then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    },
    getPosts: function (timestamp, sub, tag, title, callback) {
        var params = {
            timestamp: timestamp,
            sub: sub,
            tag: tag,
            count: 256,
            title: title,
            order: null
        };
        Vue.http.get("api/posts", { params: params }).then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    }, deletePost: function (id, callback) {
        Vue.http.delete("api/post/id/" + id).then(
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            },
            response => {
                if (callback && typeof callback === "function") {
                    callback(response);
                }
            }
        );
    }
};