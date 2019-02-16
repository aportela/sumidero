import { default as sumideroSectionSignIn } from './section-signin.js';
import { default as sumideroSectionSignUp } from './section-signup.js';
import { default as sectionAPIError } from './section-api-error.js';
import { default as sectionUpgrade } from './section-upgrade.js';
import { default as sectionAppContainer } from './section-app-container.js';
import { default as sectionAdd } from './section-add.js';
import { default as sectionUpdate } from './section-update.js';
import { default as sectionMyProfile } from './section-my-profile.js';
import { default as sectionTimeline } from './section-timeline.js';

export const routes = [
    { path: '/upgrade', name: 'upgrade', component: sectionUpgrade },
    { path: '/signin', name: 'signIn', component: sumideroSectionSignIn },
    { path: '/signup', name: 'signUp', component: sumideroSectionSignUp },
    {
        path: '/app', component: sectionAppContainer,
        children: [
            {
                path: 'timeline',
                name: 'timeline',
                component: sectionTimeline,
                children: [
                    {
                        path: 'sub/:sub',
                        name: 'timelineFilteredBySub',
                        component: sectionTimeline
                    },
                    {
                        path: 'tag/:tag',
                        name: 'timelineFilteredBTag',
                        component: sectionTimeline
                    }
                ]
            },
            { path: 'add-link', name: 'addLink', component: sectionAdd },
            { path: 'add-shout', name: 'addShout', component: sectionAdd },
            { path: 'update-post/:id', name: 'updatePost', component: sectionUpdate },
            { path: 'update-link/:id', name: 'updateLink', component: sectionUpdate },
            { path: 'my-profile', name: 'myProfile', component: sectionMyProfile }
        ]
    },
    { path: '/api-error', name: 'APIError', component: sectionAPIError }
]
