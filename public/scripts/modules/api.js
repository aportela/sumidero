
/**
 * common object for interact with API
 * all methods return callback with vue-resource response object
 */
export default {
    user: {
        poll: function (nsfw, callback) {
            const params = {
                nsfw: nsfw
            }
            Vue.http.post("api/poll", params).then(
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
        add: function (id, url, title, body, sub, tags, thumbnail, nsfw, callback) {
            var params = {
                id: id,
                externalUrl: url,
                title: title,
                body: body,
                sub: sub,
                tags: tags,
                thumbnail: thumbnail,
                nsfw: nsfw
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
        update: function (id, url, title, body, sub, tags, thumbnail, nsfw, callback) {
            var params = {
                id: id,
                externalUrl: url,
                title: title,
                body: body,
                sub: sub,
                tags: tags,
                thumbnail: thumbnail,
                nsfw: nsfw
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
        search: function (currentPage, resultsPage, sortBy, sortOrder, filter, callback) {
            var params = {
            };
            if (filter) {
                if (filter.timestamp) {
                    params.timestamp = filter.timestamp;
                }
                if (filter.userId) {
                    params.userId = filter.userId;
                }
                if (filter.sub) {
                    params.sub = filter.sub;
                }
                if (filter.tag) {
                    params.tag = filter.tag;
                }
                if (filter.title) {
                    params.title = filter.title;
                }
                if (filter.body) {
                    params.body = filter.body;
                }
                if (filter.nsfw) {
                    params.nsfw = filter.nsfw;
                }
                if (filter.domain) {
                    params.domain = filter.domain;
                }
                if (filter.globalTextSearch) {
                    params.globalTextSearch = filter.globalTextSearch;
                }
                params.currentPage = currentPage;
                params.resultsPage = resultsPage;
                params.sortBy = sortBy;
                params.sortOrder = sortOrder;
            }
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
