import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';
import { mixinRoutes, mixinSession, mixinInitialState } from "./mixins.js";

const template = `
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand is-unselectable">
            <a class="navbar-item is-uppercase has-text-weight-bold" href="https://github.com/aportela/sumidero" target="_blank">
                <span class="icon">
                    <i class="fab fa-github"></i>
                </span>
                <span>SUMIDERO</span>
            </a>
            <div class="navbar-item">
                <div class="field">
                    <div class="control has-icons-left" v-bind:class="{ 'has-icons-right, is-loading': isSearching }">
                        <span class="icon is-small is-left">
                            <i class="fas fa-search"></i>
                        </span>
                        <input ref="search" class="input is-rounded" type="text" placeholder="search..." v-bind:disabled="isSearching" v-on:keyup.enter="search();" v-on:keyup.esc="searchText = null;" v-model.trim="searchText">
                    </div>
                </div>
            </div>
        </div>
        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-light" title="click here to hide content not suitable for work" v-if="isNSFW" v-on:click.prevent="toggleNSFW()">
                        <span class="icon">
                            <i class="fas fa-user-ninja"></i>
                        </span>
                        <span class="is-hidden-mobile">nsfw</span>
                    </a>
                    <a class="button is-light" title="click here to show all content (including not suitable for work)" v-else v-on:click.prevent="toggleNSFW()">
                        <span class="icon">
                            <span class="fa-stack">
                                <i class="fas fa-user-ninja fa-stack-1x"></i>
                                <i class="fas fa-ban fa-stack-1x" style="color:Tomato"></i>
                            </span>
                        </span>
                        <span class="is-hidden-mobile">sfw</span>
                    </a>
                    <a class="button is-light" title="click here to browse the timeline" v-on:click.prevent="navigateTo('timeline', { pageIndex: 1 })">
                        <span class="icon">
                            <i class="fas fa-list-alt"></i>
                        </span>
                        <span class="is-hidden-mobile">timeline</span>
                    </a>
                    <a class="button is-light" title="click here to add shout" v-if="isLogged" v-on:click.prevent="navigateTo('addShout')">
                        <span class="icon">
                            <i class="far fa-comment-alt"></i>
                        </span>
                        <span class="is-hidden-mobile">add shout</span>
                    </a>
                    <a class="button is-light" title="click here to add link" v-if="isLogged" v-on:click.prevent="navigateTo('addLink')">
                        <span class="icon">
                            <i class="fas fa-link"></i>
                        </span>
                        <span class="is-hidden-mobile">add link</span>
                    </a>
                    <a class="button is-light" title="click here to update your profile" v-if="isLogged" v-on:click.prevent="navigateTo('myProfile')">
                        <span class="icon">
                            <i class="fas fa-user-circle"></i>
                        </span>
                        <span class="is-hidden-mobile">my profile</span>
                    </a>
                    <a class="button is-light" title="click here to sign out" v-if="isLogged" v-on:click.prevent="signOut()">
                        <span class="icon">
                            <i class="fas fa-sign-out-alt"></i>
                        </span>
                        <span class="is-hidden-mobile">sign out</span>
                    </a>
                    <a class="button is-light" title="click here to sign in" v-if="! isLogged" v-on:click.prevent="navigateTo('signIn')">
                        <span class="icon">
                            <i class="fas fa-user-secret"></i>
                        </span>
                        <span class="is-hidden-mobile">sign in</span>
                    </a>
                    <a class="button is-light" title="click here to sign up" v-if="! isLogged && allowSignUp" v-on:click.prevent="navigateTo('signUp')">
                        <span class="icon">
                            <i class="fas fa-user-plus"></i>
                        </span>
                        <span class="is-hidden-mobile">sign up</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>
`;

export default {
    name: 'sumidero-section-app-top-navigation',
    template: template,
    data: function () {
        return ({
            isSearching: false,
            searchText: null,
            isNSFW: initialState.session.nsfw
        });
    },
    mixins: [
        mixinSession, mixinRoutes, mixinInitialState
    ],
    created: function() {
        this.searchText = this.$route.params.text;
        let self = this;
        bus.$on("globalSearchingStarted", function () {
            self.isSearching = true;
        });
        bus.$on("globalSearchingFinished", function () {
            self.isSearching = false;
        });
    },
    watch: {
        '$route': function (to, from) {
            this.searchText = this.$route.params.text;
        }
    },
    methods: {
        search: function () {
            this.navigateTo('timelineFilteredByGlobalSearch', { text: this.searchText });
        },
        signOut: function () {
            bus.$emit('signOut');
        },
        toggleNSFW: function () {
            let self = this;
            sumideroAPI.user.poll(!initialState.session.nsfw, function (response) {
                if (response.ok) {
                    initialState = response.body.initialState;
                    self.isNSFW = initialState.session.nsfw;
                    bus.$emit('refreshTimeline', { globalTextSearch: self.searchText });
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        }
    }
}
