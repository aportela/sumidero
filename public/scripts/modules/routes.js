import  { default as sumideroSectionSignIn } from './section-signin.js';
import  { default as sumideroSectionSignUp } from './section-signup.js';
import { default as sectionAPIError } from './section-api-error.js';
import { default as sectionUpgrade } from './section-upgrade.js';
import { default as sectionAppContainer } from './section-app-container.js';
import { default as sectionTimeline } from './section-timeline.js';

export const routes = [
    { path: '/upgrade', name: 'upgrade', component: sectionUpgrade },
    { path: '/signin', name: 'signIn', component: sumideroSectionSignIn },
    { path: '/signup', name: 'signUp', component: sumideroSectionSignUp },
    {
        path: '/app', component: sectionAppContainer,
        children: [
            { path: 'timeline', name: 'timeline', component: sectionTimeline }
        ]
    },
    { path: '/api-error', name: 'APIError', component: sectionAPIError }
    /*
    {
        path: '/',
        name: 'root',
        //component: sumideroPosts,
        component: container,
        children: [
            { path: '/profile', name: 'profile', component: profile },
            { path: '/add_post', name: 'addPost', component: sumideroAddPost },
            { path: '/update_post/:permalink', name: 'updatePost', component: sumideroUpdatePost },
            {
                path: '/post',
                name: 'viewPost',
                component: postDetails,
                children: [
                    {
                        path: ':permalink',
                        name: 'customPost',
                        component: postDetails
                    }
                ]
            },
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
                ],
            },
            {
                path: '/t',
                name: 'allTags',
                component: sumideroPosts,
                children: [
                    {
                        path: ':tag',
                        name: 'customTag',
                        component: sumideroPosts
                    }
                ]
            }
    ]
    }
        */
]
