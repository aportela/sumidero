var sumideroPosts = (function () {
    "use strict";

    var template = function () {
        return `
    <div class="box" id="sumidero-posts">
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
        <sumidero-api-error-component v-else v-bind:apiError="apiError"></sumidero-api-error-component>
    </div>
    `;
    };

    var module = Vue.component('sumidero-posts', {
        template: template(),
        created: function () {
        },
        data: function () {
            return ({
                loading: false,
                errors: false,
                apiError: null,
                posts: []
            });
        },
        props: ['sub', 'tags', 'compact'],
        watch: {
            '$route'(to, from) {
                this.loadItems();
            }
        },
        created: function () {
            this.loadItems();
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
            loadItems: function () {
                var self = this;
                self.loading = true;
                bus.$emit("startProgress");
                sumideroAPI.getPosts(function (response) {
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