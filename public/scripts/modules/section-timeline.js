import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';
import { default as sumideroTimelinePostItem } from "./timeline-post-item.js";
import { mixinRoutes } from './mixins.js';

const template = `
    <div class="container">
        <div v-if="! loading" class="sumidero-post" v-for="post in posts">
            <sumidero-timeline-post-item v-bind:post="post" v-on:onDelete="removeItemFromList($event)"></sumidero-timeline-post-item>
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
    props: ['sub', 'tag', 'compact'],
    watch: {
        '$route'(to, from) {
            this.loadItems();
        }
    },
    created: function () {
        this.loadItems();
        var self = this;
        bus.$on("search", function (text) {
            self.loadItems(text);
        });
        bus.$on("refreshTimeline", function(text) {
            self.loadItems(text);
        });
    },
    updated: function () {
        //imageLazyLoadObserver.observe();
    },
    mixins: [
        mixinRoutes
    ],
    components: {
        'sumidero-timeline-post-item': sumideroTimelinePostItem
    },
    methods: {
        loadItems: function (title) {
            var self = this;
            self.posts = [];
            self.loading = true;
            sumideroAPI.post.search(null, this.$route.params.userId, this.$route.params.sub, this.$route.params.tag, null, initialState.session.nsfw, 1, 16, "creationTimestamp", "DESC", function (response) {
                if (response.ok) {
                    self.posts = response.body.posts;
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        removeItemFromList: function (id) {
            this.posts = this.posts.filter((post) => post.id !== id);
        }
    }
}
