"use strict";

var vTemplateNavigationMenu = function () {
    return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
                <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span class="icon">
                            <i class="fa fa-bookmark"></i>
                        </span>
                        <span>subs</span>
                    </a>
                    <div class="navbar-dropdown">
                        <a v-for="sub in subs" class="navbar-item" v-bind:href="sub.path">{{ sub.name }}</a>
                    </div>
                </div>
                <a class="navbar-item" href="/#/add-post">
                    <span class="icon">
                        <i class="fa fa-bullhorn"></i>
                    </span>
                    <span>add post</span>
                </a>
                <div class="navbar-item">
                    <div class="control has-icons-left" v-bind:class="searching ? 'is-loading': ''">
                        <input class="input" type="text" :disabled="searching" placeholder="search" v-model="searchText" v-on:keyup.esc="abortInstantSearch();" v-on:keyup="instantSearch();">
                        <span class="icon is-small is-left">
                            <i class="fa fa-search"></i>
                        </span>
                    </div>
                </div>

            </div>
            <div class="navbar-end">
                <div class="navbar-item has-dropdown is-hoverable" v-if="logged">
                    <a class="navbar-link">
                        <span class="icon">
                            <i class="fa fa-user"></i>
                        </span>
                        <span>{{ userName }}</span>
                    </a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item">
                            <span class="icon">
                                <i class="fa fa-id-card-o"></i>
                            </span>
                            <span>my profile</span>
                        </a>
                        <a class="navbar-item">
                            <span class="icon">
                                <i class="fa fa-sign-out"></i>
                            </span>
                            <span>signout</span>
                        </a>
                    </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable" v-else>
                    <a class="navbar-link">
                        <span class="icon">
                            <i class="fa fa-user"></i>
                        </span>
                        <span>anonymous (not logged)</span>
                    </a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item">
                            <span class="icon">
                                <i class="fa fa-sign-in"></i>
                            </span>
                            <span>signin</span>
                        </a>
                        <a class="navbar-item">
                            <span class="icon">
                            <i class="fa fa-user-plus"></i>
                            </span>
                            <span>signup</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    `;
}

/* navigation menu component */
var navigationMenu = Vue.component('sumidero-navigation-menu-component', {
    template: vTemplateNavigationMenu(),
    data: function () {
        return ({
            searchText: null,
            searchTimeout: null,
            searching: false,
            userName: "aportela",
            subs: [
                {
                    name: "/s/ (frontpage)",
                    path: "/#/s/"
                },
                {
                    name: "/s/news",
                    path: "/#/s/news"
                },
                {
                    name: "/s/television",
                    path: "/#/s/television"
                },
                {
                    name: "/s/games",
                    path: "/#/s/games"
                }
            ]
        });
    },
    props: [ 'logged' ],
    methods: {
        abortInstantSearch: function() {
            this.searchText = null;
        },
        instantSearch: function() {
            if (this.searchText) {
                var self = this;
                if (self.searchTimeout) {
                    clearTimeout(self.searchTimeout);
                }
                self.searchTimeout = setTimeout(function () {
                    self.search();
                }, 128);
            } else {
                this.abortInstantSearch();
            }
        },
        search: function() {
            var self = this;
            self.searching = true;
            setTimeout(function () {
                self.searching = false;
            }, 500);
        }
    }
});
