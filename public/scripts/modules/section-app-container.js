import { bus } from './bus.js';
import { mixinRoutes, mixinSession } from "../mixins.js";
import { default as sumideroAppTopNavigation } from "./section-app-top-navigation.js";

const template = `
    <div>
        <sumidero-section-app-top-navigation></sumidero-section-app-top-navigation>
        <transition name="fade">
            <!-- component matched by the route will render here -->
            <router-view></router-view>
        </transition>
    </div>
`;

export default {
    name: 'sumidero-section-app-container',
    template: template,
    data: function () {
        return ({
            isSearching: false,
            searchText: null
        });
    },
    mixins: [
        mixinSession, mixinRoutes
    ],
    components: {
        'sumidero-section-app-top-navigation': sumideroAppTopNavigation
    },
    methods: {
        search: function () {
            var self = this;
            self.isSearching = true;
            setTimeout(function () {
                self.isSearching = false;
                self.$nextTick(() => self.$refs.search.focus());
            }, 500);
        },
        signOut: function () {
            bus.$emit('signOut');
        }
    }
}
