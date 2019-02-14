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
        loadItems: function (title) {
            var self = this;
            self.posts = [];
            self.loading = true;
            sumideroAPI.getPosts(null, this.$route.params.sub, this.$route.params.tag, title, function (response) {
                if (response.ok) {
                    self.posts = response.body.posts;
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        }
    }
}
