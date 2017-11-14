"use strict";

const imageLazyLoadObserver = lozad(); // lazy loads elements with default selector as '.lozad'
if (imageLazyLoadObserver) {
    imageLazyLoadObserver.observe();
}

/**
 * global object for events between vuejs components
 */
const bus = new Vue();

/**
 * vue-router route definitions
 */
const routes = [
    {
        path: '/s',
        name: 'allSubs',
        component: sumideroPosts,
        children: [
            {
                path: ':sub',
                name: 'customSub',
                component: sumideroPosts
            }
        ]
    },
    {
        path: '/t',
        name: 'allTags',
        component: sumideroPosts,
        children: [
            {
                path: ':tag',
                name: 'customTab',
                component: sumideroPosts
            }
        ]
    },
    {
        path: '/add-post/',
        name: 'addPost',
        component: sumideroAddPost
    }
];

/**
 * main vue-router component inicialization
 */
const router = new VueRouter({
    routes
});

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
        //this.$router.push({ name: 'allSubs' });
        NProgress.configure({ showSpinner: false });
        bus.$on("startProgress", function () {
            NProgress.start();
        });
        bus.$on("incProgress", function () {
            NProgress.inc();
        });
        bus.$on("endProgress", function () {
            NProgress.done();
        });
    }
}).$mount('#app');

