import { bus } from './modules/bus.js';
import { default as sumideroAPI } from './modules/api.js';
import { router as router } from './modules/router.js';

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
            compact: false
        });
    },
    created: function () {
        var self = this;
        if (!initialState.upgradeAvailable) {
            if (!initialState.logged) {
                //self.$router.push({ name: 'signin' });
                self.$router.push({ name: 'allSubs' });
            } else {
                if (!self.$route.name) {
                    self.$router.push({ name: 'allSubs' });
                }
            }
        } else {
            self.$router.push({ name: 'upgrade' });
        }
        /*
        NProgress.configure({ showSpinner: false });
        bus.$on("startProgress", function () {
            //NProgress.start();
        });
        bus.$on("incProgress", function () {
            //NProgress.inc();
        });
        bus.$on("endProgress", function () {
            //NProgress.done();
        });
        */
    }
}).$mount('#app');


// prevent php session lost (TODO: better management, only poll if we are logged)
setInterval(function () {
    sumideroAPI.poll(function () { });
    }, 300000 // 5 mins * 60 * 1000
);