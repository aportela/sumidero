var authMenu = (function () {
    "use strict";

    var template = function () {
        return `
            <div class="navbar-item has-dropdown is-hoverable" v-if="initialState.logged">
                <a class="navbar-link">
                    <span class="icon">
                        <i class="fa fa-user"></i>
                    </span>
                    <span>{{ initialState.session.nick }}</span>
                </a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" v-on:click.prevent="$router.push({ name: 'profile' })">
                        <span class="icon">
                            <i class="fa fa-id-card-o"></i>
                        </span>
                        <span>my profile</span>
                    </a>
                    <a class="navbar-item" v-on:click.prevent="signOut();">
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
                        <i class="fa fa-user-secret"></i>
                    </span>
                    <span>anonymous (not logged)</span>
                </a>
                <div class="navbar-dropdown">
                    <form v-on:submit.prevent="submit();">
                        <div class="navbar-item">
                            <label class="checkbox is-unselectable">
                                <input type="checkbox" v-model="signUpChecked"> I don't have an account
                            </label>
                        </div>
                        <div class="navbar-item">
                            <div class="field">
                                <div class="control has-icons-left" v-bind:class="error == 'errorInvalidEmail' || error == 'errorEmailNotFound' || error == 'errorEmailExists' ? 'has-icons-right': ''">
                                    <input class="input" type="email" maxlength="255" placeholder="your email" v-model="email" v-bind:disabled="loading ? true: false" required>
                                    <span class="icon is-left">
                                        <i class="fa fa-envelope"></i>
                                    </span>
                                    <span class="icon is-right" v-if="error == 'errorInvalidEmail' || error == 'errorEmailNotFound' || error == 'errorEmailExists'">
                                        <i class="fa fa-warning"></i>
                                    </span>
                                    <p class="help is-danger" v-if="error == 'errorInvalidEmail'">Invalid email</p>
                                    <p class="help is-danger" v-if="error == 'errorEmailNotFound'">Email not found</p>
                                    <p class="help is-danger" v-if="error == 'errorEmailExists'">Email used</p>
                                </div>
                            </div>
                        </div>
                        <div class="navbar-item" v-if="signUpChecked">
                            <div class="field">
                                <div class="control has-icons-left" v-bind:class="error == 'errorInvalidNick' || error == 'errorNickExists'">
                                    <input class="input" type="text" maxlength="255" placeholder="your nick/alias" v-model="nick" v-bind:disabled="loading ? true: false" v-bind:required="signUpChecked ? true: false">
                                    <span class="icon is-left">
                                        <i class="fa fa-user"></i>
                                    </span>
                                    <span class="icon is-right" v-if="error == 'errorInvalidNick' || error == 'errorNickExists'">
                                        <i class="fa fa-warning"></i>
                                    </span>
                                    <p class="help is-danger" v-if="error == 'errorInvalidNick'">Invalid nick</p>
                                    <p class="help is-danger" v-if="error == 'errorNickExists'">Nick used</p>
                                </div>
                            </div>
                        </div>
                        <div class="navbar-item">
                            <div class="field">
                                <div class="control has-icons-left" v-bind:class="error == 'errorInvalidPassword' || error == 'errorWrongPassword' ? 'has-icons-right': ''">
                                    <input class="input" type="password" placeholder="your password" v-model="password" v-bind:disabled="loading ? true: false" required>
                                    <span class="icon is-left">
                                        <i class="fa fa-key"></i>
                                    </span>
                                    <span class="icon is-right" v-if="error == 'errorInvalidPassword' || error == 'errorWrongPassword'">
                                        <i class="fa fa-warning"></i>
                                    </span>
                                    <p class="help is-danger" v-if="error == 'errorInvalidPassword'">Invalid password</p>
                                    <p class="help is-danger" v-if="error == 'errorWrongPassword'">Wrong password</p>
                                </div>
                            </div>
                        </div>
                        <div class="navbar-item" v-if="! signUpChecked">
                            <p class="control">
                                <button type="submit" class="button is-link " v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading ? true: false">
                                    <span class="icon"><i class="fa fa-lock"></i></span>
                                    <span>Sign in</span>
                                </button>
                            </p>
                        </div>
                        <div class="navbar-item" v-else>
                            <p class="control">
                                <button type="submit" class="button is-link" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading ? true: false">
                                    <span class="icon"><i class="fa fa-user-plus"></i></span>
                                    <span>Sign up</span>
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    };

    /* navigation menu component */
    var module = Vue.component('sumidero-auth-menu-component', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                initialState: initialState,
                email: null,
                nick: null,
                password: null,
                signUpChecked: false,
                error: null
            });
        },
        methods: {
            submit: function () {
                this.error = null;
                if (!this.signUpChecked) {
                    this.signIn();
                } else {
                    this.signUp();
                }
            },
            signIn: function () {
                var self = this;
                this.loading = true;
                sumideroAPI.signIn(this.email, this.password, function (response) {
                    self.loading = false;
                    if (response.ok) {
                        self.initialState = response.body.initialState;
                        self.email = null;
                        self.password = null;
                        self.nick = null;
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.error = "errorInvalidEmail";
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.error = "errorInvalidPassword";
                                } else {
                                    // TODO
                                }
                                break;
                            case 401:
                                self.error = "errorWrongPassword";
                            break;
                            case 404:
                                self.error = "errorEmailNotFound";
                            break;
                            default:
                                // TODO
                            break;
                        }
                    }
                });
            },
            signUp: function () {
                var self = this;
                this.loading = true;
                sumideroAPI.signUp(this.email, this.password, this.nick, function (response) {
                    self.loading = false;
                    if (response.ok) {
                        self.signIn();
                    } else {
                        switch (response.status) {
                            case 400:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.error = "errorInvalidEmail";
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                    self.error = "errorInvalidPassword";
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "nick"); })) {
                                    self.error = "errorInvalidNick";
                                } else {
                                    // TODO
                                }
                                break;
                            case 409:
                                if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                    self.error = "errorEmailExists";
                                } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "nick"); })) {
                                    self.error = "errorNickExists";
                                } else {
                                    // TODO
                                }
                            break;
                            default:
                                // TODO
                            break;
                        }
                    }
                });
            },
            signOut: function () {
                var self = this;
                this.loading = true;
                sumideroAPI.signOut(function (response) {
                    self.loading = false;
                    if (response.ok) {
                        self.initialState = response.body.initialState;
                    } else {
                        // TODO
                    }
                });
            }
        }
    });

    return (module);
})();
