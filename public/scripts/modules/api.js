
/**
 * common object for interact with API
 * all methods return callback with vue-resource response object
 */
export default {
    user: {
        poll: function (nsfw, callback) {
            Vue.http.get("api/poll", { params: { nsfw: nsfw } }).then(
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
        signUp: function (email, name, password, callback) {
            const params = {
                email: email,
                name: name,
                password: password
            }
            Vue.http.post("api/signup", params).then(
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
            let params = {
                email: email,
                password: password
            }
            Vue.http.post("api/signin", params).then(
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
            Vue.http.get("api/signout").then(
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
        get: function (id, callback) {
            Vue.http.get("api/user/" + id).then(
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
        update: function (id, email, name, avatar, password, callback) {
            let params = {
                id: id,
                email: email,
                name: name,
                avatar: avatar,
                password: password
            }
            Vue.http.put("api/user/" + id, params).then(
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
        uploadAvatar: function (userId, file, callback) {
            var formData = new FormData();
            formData.append("avatar", file, file.name);
            Vue.http.post("api/user/" + userId + "/avatar", formData).then(
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
    },
    scrap: function (url, callback) {
        var params = {
            url: url
        };
        Vue.http.post("api/scrap", params).then(
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
    post: {
        add: function (id, url, title, body, sub, tags, thumbnail, callback) {
            var params = {
                id: id,
                externalUrl: url,
                title: title,
                body: body,
                sub: sub,
                tags: tags,
                thumbnail: thumbnail
            };
            Vue.http.post("api/post/" + id, params).then(
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
        update: function (id, url, title, body, sub, tags, thumbnail, callback) {
            var params = {
                id: id,
                externalUrl: url,
                title: title,
                body: body,
                sub: sub,
                tags: tags,
                thumbnail: thumbnail
            };
            Vue.http.put("api/post/" + id, params).then(
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
        get: function (id, callback) {
            Vue.http.get("api/post/" + id).then(
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
        delete: function (id, callback) {
            Vue.http.delete("api/post/" + id).then(
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
        search: function (timestamp, sub, tag, title, nsfw, callback) {
            var params = {
                timestamp: timestamp,
                sub: sub,
                tag: tag,
                title: title,
                nsfw: nsfw,
                order: null,
                currentPage: 1,
                resultsPage: 32
            };
            Vue.http.post("api/search", params).then(
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
    }
}
