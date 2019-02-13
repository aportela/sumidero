import { bus } from './modules/bus.js';
import { default as sumideroAPI } from './modules/api.js';
import { router as router } from './modules/router.js';
import { mixinRoutes } from './mixins.js';
import { default as sumideroModalError } from './modules/modal-error.js';

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
        mixinRoutes
    ],
    components: {
        'sumidero-modal-error': sumideroModalError
    },
    created: function () {
        let self = this;
        bus.$on("setPollTimeout", function (milliSeconds) {
            self.pollTimeout = setInterval(
                function () {
                    sumideroAPI.user.poll(function () { });
                },
                milliSeconds
            );
        });
        bus.$on("deletePollTimeout", function () {
            clearInterval(self.pollTimeout);
        });
        this.navigateTo('signIn');
        /*
        if (!initialState.upgradeAvailable) {
            if (initialState.isPublic) {
                this.navigateTo('timeline');
            } else {
                if (!initialState.session.logged) {
                    this.navigateTo('signIn');
                } else {
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
        */
    }
}).$mount('#app');
