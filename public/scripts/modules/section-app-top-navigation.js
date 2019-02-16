import { bus } from './bus.js';
import { mixinRoutes, mixinSession } from "../mixins.js";

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
                    <a class="button is-light" title="click here to hide content not suitable for work" v-if="nsfw" v-on:click.prevent="hideNSFW()">
                        <span class="icon">
                            <i class="fas fa-user-ninja"></i>
                        </span>
                        <span>nsfw</span>
                    </a>
                    <a class="button is-light" title="click here to show all content (including not suitable for work)" v-else v-on:click.prevent="showNSFW()">
                        <span class="icon">
                            <span class="fa-stack">
                                <i class="fas fa-user-ninja fa-stack-1x"></i>
                                <i class="fas fa-ban fa-stack-1x" style="color:Tomato"></i>
                            </span>
                        </span>
                        <span>sfw</span>
                    </a>
                    <a class="button is-light" v-on:click.prevent="navigateTo('timeline')">
                        <span class="icon">
                            <i class="fas fa-list-alt"></i>
                        </span>
                        <span>timeline</span>
                    </a>
                    <a class="button is-light" v-if="isLogged" v-on:click.prevent="navigateTo('addShout')">
                        <span class="icon">
                            <i class="far fa-comment-alt"></i>
                        </span>
                        <span>add shout</span>
                    </a>
                    <a class="button is-light" v-if="isLogged" v-on:click.prevent="navigateTo('addLink')">
                        <span class="icon">
                            <i class="fas fa-link"></i>
                        </span>
                        <span>add link</span>
                    </a>
                    <a class="button is-light" v-if="isLogged" v-on:click.prevent="navigateTo('myProfile')">
                        <span class="icon">
                            <i class="fas fa-user-circle"></i>
                        </span>
                        <span>my profile</span>
                    </a>
                    <a class="button is-light" v-if="isLogged" v-on:click.prevent="signOut()">
                        <span class="icon">
                            <i class="fas fa-sign-out-alt"></i>
                        </span>
                        <span>sign out</span>
                    </a>
                    <a class="button is-light" v-if="! isLogged" v-on:click.prevent="navigateTo('signIn')">
                        <span class="icon">
                            <i class="fas fa-user-secret"></i>
                        </span>
                        <span>sign in</span>
                    </a>
                    <a class="button is-light" v-if="! isLogged && allowSignUp" v-on:click.prevent="navigateTo('signUp')">
                        <span class="icon">
                            <i class="fas fa-user-plus"></i>
                        </span>
                        <span>sign up</span>
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
            nsfw: false
        });
    },
    mixins: [
        mixinSession, mixinRoutes
    ],
    computed: {
        SFW: function() {
            return(initialState && initialState.nsfw == false);
        }
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
        },
        hideNSFW: function() {
            this.nsfw = false;
        },
        showNSFW: function() {
            this.nsfw = true;
        }
    }
}
