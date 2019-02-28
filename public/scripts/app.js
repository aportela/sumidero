import { bus } from './modules/bus.js';
import { default as sumideroAPI } from './modules/api.js';
import { router as router } from './modules/router.js';
import { mixinRoutes, mixinInitialState } from './modules/mixins.js';

const imageLazyLoadObserver = lozad(); // lazy loads elements with default selector as '.lozad'
if (imageLazyLoadObserver) {
    imageLazyLoadObserver.observe();
}


/**
 * top scroll window before change router page
 */
router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    next();
});

/**
 * parse vue-resource (custom) resource and return valid object for api-error component
 * @param {*} r a valid vue-resource response object
 */
const getApiErrorDataFromResponse = function (r) {
    var data = {
        request: {
            method: r.rMethod,
            url: r.rUrl,
            body: r.rBody
        },
        response: {
            status: r.status,
            statusText: r.statusText,
            text: r.bodyText
        }
    };
    data.request.headers = [];
    for (var headerName in r.rHeaders.map) {
        data.request.headers.push({ name: headerName, value: r.rHeaders.get(headerName) });
    }
    data.response.headers = [];
    for (var headerName in r.headers.map) {
        data.response.headers.push({ name: headerName, value: r.headers.get(headerName) });
    }
    return (data);
};

/**
 * vue-resource interceptor for adding (on errors) custom get data function (used in api-error component) into response
 */
Vue.http.interceptors.push((request, next) => {
    next((response) => {
        if (!response.ok) {
            response.rBody = request.body;
            response.rUrl = request.url;
            response.rMethod = request.method;
            response.rHeaders = request.headers;
            response.getApiErrorData = function () {
                return (getApiErrorDataFromResponse(response));
            };
        }
        return (response);
    });
});

/**
 * main app component
 */
const app = new Vue({
    router,
    data: function () {
        return ({
            loading: false,
            pollTimeout: null
        });
    },
    mixins: [
        mixinRoutes, mixinInitialState
    ],
    created: function () {
        let self = this;
        self.setInitialState(initialState);
        self.enablePollTimeout(initialState.session.timeout);
        bus.$on("signOut", function () {
            sumideroAPI.user.signOut(function (response) {
                if (response.ok) {
                    self.disablePollTimeout();
                    // enable fixed top navbar
                    document.getElementsByTagName('html')[0].setAttribute('class', '')
                    self.navigateTo('signIn');
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        });
        if (!initialState.upgradeAvailable) {
            if (initialState.isPublic) {
                // enable fixed top navbar
                document.getElementsByTagName('html')[0].setAttribute('class', 'has-navbar-fixed-top');
                this.navigateTo('timeline');
            } else {
                if (!initialState.session.logged) {
                    this.navigateTo('signIn');
                } else {
                    // enable fixed top navbar
                    document.getElementsByTagName('html')[0].setAttribute('class', 'has-navbar-fixed-top');
                    if (!this.$route.name) {
                        this.navigateTo('timeline');
                    } else {
                        this.navigateTo(this.$route.name);
                    }
                }
            }
        } else {
            this.navigateTo('upgrade');
        }
    },
    methods: {
        enablePollTimeout: function (seconds) {
            this.pollTimeout = setInterval(
                function () {
                    sumideroAPI.user.poll(initialState.nsfw, function () { });
                },
                (seconds - 30) * 1000
            );
        },
        disablePollTimeout: function () {
            clearInterval(this.pollTimeout);
        }
    }
}).$mount('#app');
