import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';

const template = `
    <div class="container">
        <div v-if="! loading" class="sumidero-post" v-for="post in posts">
            <sumidero-post v-bind:post="post" v-bind:compact="compact"></sumidero-post>
            <hr>
        </div>
    </div>
`;

export default {
    name: 'sumidero-section-timeline',
    template: template,
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
}
