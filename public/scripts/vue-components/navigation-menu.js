var navigationMenu = (function () {
    "use strict";

    var template = function () {
        return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item is-uppercase has-text-weight-bold" href="https://github.com/aportela/sumidero">
                <span class="icon">
                    <i class="fa fa-github"></i>
                </span>
                SUMIDERO
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item has-dropdown is-hoverable" v-if="subs.length > 0">
                    <a class="navbar-link">
                        <span class="icon">
                            <i class="fa fa-bookmark"></i>
                        </span>
                        <span>subs</span>
                    </a>
                    <div class="navbar-dropdown">
                        <a v-for="sub in subs" class="navbar-item" v-on:click.prevent="$router.push({ name: 'customSub', params: { sub: sub } })">/s/{{ sub }}</a>
                    </div>
                </div>
                <a class="navbar-item">
                    <span class="icon">
                        <i class="fa fa-bullhorn"></i>
                    </span>
                    <span>add post</span>
                </a>
                <div class="navbar-item">
                    <div class="field has-addons">
                        <div class="control has-icons-left" v-bind:class="searching ? 'is-loading': ''">
                            <input class="input" type="text" :disabled="searching" placeholder="search" v-model="searchText" v-on:keyup.esc="abortInstantSearch();" v-on:keyup="instantSearch();">
                            <span class="icon is-small is-left">
                                <i class="fa fa-search"></i>
                            </span>
                        </div>
                        <p class="control has-icons-left" v-if="showLimitSearch">
                            <span class="select">
                                <select>
                                    <option>limit search to /s/news</option>
                                    <option>search on all subs</option>
                                </select>
                            </span>
                            <span class="icon is-small is-left">
                                <i class="fa fa-filter"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="navbar-end">
                <sumidero-auth-menu-component></sumidero-auth-menu-component>
            </div>
        </div>
    </nav>
    `;
    };

    /* navigation menu component */
    var module = Vue.component('sumidero-navigation-menu-component', {
        template: template(),
        data: function () {
            return ({
                searchText: null,
                searchTimeout: null,
                searching: false,
                showLimitSearch: true,
                logged: initialState.logged,
                session: initialState.session
            });
        },
        computed: {
            subs: function() {
                if (initialState.subs) {
                    return(initialState.subs);
                } else {
                    return([]);
                }
            }
        },
        methods: {
            abortInstantSearch: function () {
                this.searchText = null;
            },
            instantSearch: function () {
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
            search: function () {
                var self = this;
                self.searching = true;
                setTimeout(function () {
                    self.searching = false;
                }, 500);
            },
            signOut: function() {
                var self = this;
                sumideroAPI.signOut(function(response) {
                    if (response.ok) {
                        self.$router.push({ path: '/signin' });
                    } else {
                        self.apiError = response.getApiErrorData();
                        self.errors = true;
                        self.loading = false;
                        // TODO: show error
                    }
                });
            }
        }
    });

    return (module);
})();
