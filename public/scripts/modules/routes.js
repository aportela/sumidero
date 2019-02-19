import { default as sumideroSectionSignIn } from './section-signin.js';
import { default as sumideroSectionSignUp } from './section-signup.js';
import { default as sectionAPIError } from './section-api-error.js';
import { default as sectionUpgrade } from './section-upgrade.js';
import { default as sectionAppContainer } from './section-app-container.js';
import { default as sectionSave } from './section-save.js';
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
                        path: 'page/:pageIndex',
                        name: 'timelinePaged',
                        component: sectionTimeline
                    },
                    {
                        path: 'user/:userId',
                        name: 'timelineFilteredByUserId',
                        component: sectionTimeline,
                        children: [
                            {
                                path: 'page/:pageIndex',
                                name: 'timelineFilteredByUserIdPaged',
                                component: sectionTimeline,
                            }
                        ]
                    },
                    {
                        path: 'domain/:domain',
                        name: 'timelineFilteredByDomain',
                        component: sectionTimeline,
                        children: [
                            {
                                path: 'page/:pageIndex',
                                name: 'timelineFilteredByDomainPaged',
                                component: sectionTimeline,
                            }
                        ]
                    },
                    {
                        path: 'sub/:sub',
                        name: 'timelineFilteredBySub',
                        component: sectionTimeline,
                        children: [
                            {
                                path: 'page/:pageIndex',
                                name: 'timelineFilteredBySubPaged',
                                component: sectionTimeline,
                            }
                        ]
                    },
                    {
                        path: 'tag/:tag',
                        name: 'timelineFilteredBTag',
                        component: sectionTimeline,
                        children: [
                            {
                                path: 'page/:pageIndex',
                                name: 'timelineFilteredBTagPaged',
                                component: sectionTimeline,
                            }
                        ]
                    }
                ]
            },
            { path: 'add-link', name: 'addLink', component: sectionSave },
            { path: 'add-shout', name: 'addShout', component: sectionSave },
            { path: 'update-shout/:id', name: 'updateShout', component: sectionSave },
            { path: 'update-link/:id', name: 'updateLink', component: sectionSave },
            { path: 'my-profile', name: 'myProfile', component: sectionMyProfile }
        ]
    },
    { path: '/api-error', name: 'APIError', component: sectionAPIError }
]
