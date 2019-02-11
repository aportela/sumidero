export const routes = [
    { path: '/upgrade', name: 'upgrade', component: upgrade },
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
];
