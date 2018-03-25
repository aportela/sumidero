var sumideroPosts = (function () {
    "use strict";

    var template = function () {
        return `
            <div class="box" id="sumidero-posts" v-if="! gallery">
                <div class="tags has-addons" v-if="this.$route.params.sub">
                    <span class="tag is-dark">
                        <i v-if="loading" class="fa fa-cog fa-spin fa-fw"></i>
                        <i v-else class="fa fa-bookmark fa-fw"></i>
                    </span>
                    <span class="tag is-dark">browsing sub</span>
                    <a href="#" class="tag is-primary">{{ this.$route.params.sub }}</a>
                </div>
                <div class="tags has-addons" v-if="this.$route.params.tag">
                    <span class="tag is-dark">
                        <i v-if="loading" class="fa fa-cog fa-spin fa-fw"></i>
                        <i v-else class="fa fa-tag fa-fw"></i>
                    </span>
                    <span class="tag is-dark">browsing tag</span>
                    <a href="#" class="tag is-primary">{{ this.$route.params.tag }}</a>
                </div>
                <div v-if="! errors">
                    <div v-if="! loading" class="sumidero-post" v-for="post in posts">
                        <sumidero-post v-bind:post="post" v-bind:compact="compact"></sumidero-post>
                        <hr>
                    </div>
                </div>
            </div>
            <div v-else class="columns is-multiline is-mobile">
                <div class="column is-3" v-for="post in posts">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title">
                                <a v-on:click.prevent="$router.push({ name: 'customSub', params: { sub: post.sub } })" class="tag is-info">{{ post.sub }}</a>
                            </p>
                        </header>
                        <div class="card-image">
                            <figure class="image is-16by9">
                                <img rel="noreferrer" v-if="post.thumbnail && post.thumbnail != 'self' && post.thumbnail != 'default'" v-bind:src="'/api/thumbnail?url=' + post.thumbnail">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="card-header-title"><a v-bind:href="post.externalUrl">{{ post.title }}</a></p>
                        </div>
                        <footer class="card-footer" v-if="post.tags">
                            <div class="control" v-for="tag in post.tags.split(',')">
                                <div class="tags has-addons">
                                    <a v-on:click.prevent="$router.push({ name: 'customTag', params: { tag: tag } })" class="tag is-light">{{ tag }}</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        `;
    };

    var module = Vue.component('sumidero-posts', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                errors: false,
                apiError: null,
                posts: [],
                gallery: false
            });
        },
        props: ['sub', 'tag', 'compact' ],
        watch: {
            '$route'(to, from) {
                this.loadItems();
            }
        },
        created: function () {
            this.loadItems();
            var self = this;
            bus.$on("searchByTitle", function (title) {
                self.loadItems(title);
            });
        },
        updated: function () {
            imageLazyLoadObserver.observe();
        },
        methods: {
            poll: function (callback) {
                var self = this;
                self.loading = true;
                sumideroAPI.poll(function (response) {
                    self.loading = false;
                    callback(response);
                });
            },
            loadItems: function (title) {
                var self = this;
                self.posts = [];
                self.loading = true;
                //bus.$emit("startProgress");
                sumideroAPI.getPosts(null, this.$route.params.sub, this.$route.params.tag, title, function (response) {
                    if (response.ok) {
                        self.posts = response.body.posts;
                        self.loading = false;
                        bus.$emit("endProgress");
                    } else {
                        self.errors = true;
                        self.apiError = response.getApiErrorData();
                        self.loading = false;
                        bus.$emit("endProgress");
                    }
                });
            }
        }
    });

    return (module);
})();