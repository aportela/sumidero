var navigationMenu = (function () {
    "use strict";

    var template = function () {
        return `
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand is-unselectable">
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
                    <a class="navbar-link is-unselectable">
                        <span class="icon">
                            <i class="fa fa-bookmark"></i>
                        </span>
                        <span>subs</span>
                    </a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'allSubs' })">/s (<strong>all subs</strong>)</a>
                        <a v-for="sub in subs" class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'customSub', params: { sub: sub } })">/s/{{ sub }}</a>
                    </div>
                </div>
                <div class="navbar-item has-dropdown" v-bind:class="searchSubs && searchSubs.length > 0 && filteredSubs.length > 0 ? 'is-active' : ''">
                    <div class="field has-addons">
                        <div class="control has-icons-left" v-bind:class="searching ? 'is-loading': ''">
                            <input class="input" type="text" :disabled="searching" placeholder="search" v-model="searchSubs">
                            <span class="icon is-small is-left">
                                <i class="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <div class="navbar-dropdown">
                        <a v-for="sub in filteredSubs" class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'customSub', params: { sub: sub } })">/s/{{ sub }}</a>
                    </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable" v-if="tags.length > 0">
                    <a class="navbar-link is-unselectable">
                        <span class="icon">
                            <i class="fa fa-tag"></i>
                        </span>
                        <span>tags</span>
                    </a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'allTags' })">/s (<strong>all tags</strong>)</a>
                        <a v-for="tag in tags" class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'customTag', params: { tag: tag } })">/t/{{ tag }}</a>
                    </div>
                </div>
                <div class="navbar-item has-dropdown" v-bind:class="searchTags && searchTags.length > 0 && filteredTags.length > 0 ? 'is-active' : ''">
                    <div class="field has-addons">
                        <div class="control has-icons-left" v-bind:class="searching ? 'is-loading': ''">
                            <input class="input" type="text" :disabled="searching" placeholder="search" v-model="searchTags">
                            <span class="icon is-small is-left">
                                <i class="fa fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <div class="navbar-dropdown">
                        <a v-for="tag in filteredTags" class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'customTag', params: { tag: tag } })">/t/{{ tag }}</a>
                    </div>
                </div>
                <a class="navbar-item is-unselectable" v-on:click.prevent="$router.push({ name: 'addPost' })">
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
                            <span class="select is-unselectable">
                                <select>
                                    <option v-if="this.$route.params.sub">limit search to /s/{{ this.$route.params.sub }}</option>
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
                searchSubs: null,
                searchTags: null,
                searchTimeout: null,
                searching: false,
                logged: initialState.logged,
                session: initialState.session
            });
        },
        computed: {
            subs: function () {
                if (initialState.subs) {
                    return (initialState.subs);
                } else {
                    return ([]);
                }
            },
            tags: function () {
                if (initialState.tags) {
                    return (initialState.tags);
                } else {
                    return ([]);
                }
            },
            filteredSubs: function () {
                if (this.searchSubs) {
                    let subs = [];
                    for (let i = 0; i < initialState.subs.length; i++) {
                        if (initialState.subs[i].toLowerCase().indexOf(this.searchSubs.toLowerCase()) != -1) {
                            subs.push(initialState.subs[i]);
                        }
                    }
                    return (subs);
                } else {
                    return ([]);
                }
            },
            filteredTags: function () {
                if (this.searchTags) {
                    let tags = [];
                    for (let i = 0; i < initialState.tags.length; i++) {
                        if (initialState.tags[i].toLowerCase().indexOf(this.searchTags.toLowerCase()) != -1) {
                            tags.push(initialState.tags[i]);
                        }
                    }
                    return (tags);
                } else {
                    return ([]);
                }
            },
            showLimitSearch: function () {
                return (this.$route.params.sub);
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
                bus.$emit("searchByTitle", this.searchText);
            },
            signOut: function () {
                var self = this;
                sumideroAPI.signOut(function (response) {
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
