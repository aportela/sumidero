import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';
import { default as validator } from './validator.js';
import { mixinRoutes, mixinSession, mixinInitialState } from './mixins.js';

const template = `
    <!-- template credits: daniel (https://github.com/dansup) -->
    <section class="hero is-fullheight is-light is-bold is-unselectable">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-4 is-offset-4">
                        <h1 class="title has-text-centered"><span class="icon is-medium"><i class="fas fa-comments"></i></span> SUMIDERO <span class="icon is-medium"><i class="far fa-comments"></i></span></h1>
                        <h2 class="subtitle is-6 has-text-centered">I ASSURE YOU; WE'RE OPEN</h2>
                        <hr>
                        <h1 class="title is-3 has-text-centered"><i class="fa fa-user"></i> Sign in</h1>
                        <form v-on:submit.prevent="onSubmit">
                            <div class="box">
                                <div class="field">
                                    <label class="label">Email</label>
                                    <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('email') }">
                                        <input class="input" type="email" name="email" maxlength="255" ref="email" required autofocus v-bind:class="{ 'is-danger': validator.hasInvalidField('email') }" v-bind:disabled="loading" v-model.trim="email">
                                        <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                                        <span class="icon is-small is-right" v-show="validator.hasInvalidField('email')"><i class="fa fa-warning"></i></span>
                                        <p class="help is-danger" v-show="validator.hasInvalidField('email')">{{ validator.getInvalidFieldMessage('email') }}</p>
                                    </p>
                                </div>
                                <div class="field">
                                    <label class="label">Password</label>
                                    <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('password') }">
                                        <input class="input" type="password" name="password" required v-bind:class="{ 'is-danger': validator.hasInvalidField('password') }" v-bind:disabled="loading" v-model="password">
                                        <span class="icon is-small is-left"><i class="fa fa-key"></i></span>
                                        <span class="icon is-small is-right" v-show="validator.hasInvalidField('password')"><i class="fa fa-warning"></i></span>
                                        <p class="help is-danger" v-show="validator.hasInvalidField('password')">{{ validator.getInvalidFieldMessage('password') }}</p>
                                    </p>
                                </div>
                                <p class="control">
                                    <button type="submit" class="button is-link is-fullwidth" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading">
                                        <span class="icon"><i class="fa fa-lock"></i></span>
                                        <span>Sign in</span>
                                    </button>
                                </p>
                            </div>
                            <p class="has-text-centered has-text-weight-bold s-mt-1rem" v-if="allowSignUp">Don't have an account ?<br><a href="#" v-on:click.prevent="navigateTo('signUp', {})">Create one</a></p>
                        </form>
                        <p class="has-text-centered s-mt-1rem">
                            <a href="https://github.com/aportela/sumidero" target="_blank"><span class="icon is-small"><i class="fab fa-github"></i></span> <span>Project page</span></a> | <a href="mailto:766f6964+github@gmail.com">by alex</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

export default {
    name: 'sumidero-section-signup',
    template: template,
    data: function () {
        return ({
            loading: false,
            validator: validator,
            email: null,
            password: null
        });
    },
    mixins: [
        mixinRoutes, mixinSession, mixinInitialState
    ],
    created: function () {
        this.$nextTick(() => this.$refs.email.focus());
    },
    methods: {
        onSubmit: function () {
            var self = this;
            self.validator.clear();
            self.loading = true;
            sumideroAPI.user.signIn(this.email, this.password, function (response) {
                if (response.ok && response.body.success) {
                    self.setInitialState(response.body.initialState);
                    // enable fixed top navbar
                    document.getElementsByTagName('html')[0].setAttribute('class', 'has-navbar-fixed-top');
                    self.navigateTo('timeline', {});
                } else {
                    switch (response.status) {
                        case 400:
                            if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                self.validator.setInvalid("email", "Invalid email");
                            } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                self.validator.setInvalid("email", "Invalid password");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        case 404:
                            self.validator.setInvalid("email", "Email not found");
                            break;
                        case 401:
                            self.validator.setInvalid("password", "Incorrect password");
                            break;
                        default:
                            self.showApiError(response.getApiErrorData());
                            break;
                    }
                    self.loading = false;
                }
            });
        }
    }
}