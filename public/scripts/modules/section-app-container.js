import { bus } from './bus.js';
import { mixinSession as mixinSession } from "../mixins.js";

const template = `
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
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
                        <a class="button is-light">
                            <span class="icon">
                                <i class="fas fa-comment-medical"></i>
                            </span>
                            <span>post</span>
                        </a>
                        <a class="button is-light">
                            <span class="icon">
                                <i class="fas fa-user-circle"></i>
                            </span>
                            <span>my profile</span>
                        </a>
                        <a class="button is-light" v-on:click.prevent="signOut()">
                            <span class="icon">
                                <i class="fas fa-sign-out-alt"></i>
                            </span>
                            <span>sign out</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
        <transition name="fade">
            <!-- component matched by the route will render here -->
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
        mixinSession
    ],
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
