var container = (function () {
    "use strict";

    var template = function () {
        return `
            <div id="app" class="container">
                <sumidero-navigation-menu-component></sumidero-navigation-menu-component>
                <section class="hero">
                    <div class="hero-body">
                        <p class="title is-1 has-text-centered">Sumidero</i></p>
                        <p class="subtitle is-7 has-text-centered">I ASSURE YOU; WE'RE OPEN</i></p>
                    </div>
                </section>
                <transition name="fade">
                    <!-- component matched by the route will render here -->
                    <router-view v-bind:compact="compact"></router-view>
                </transition>
            </div>
        `;
    };

    /* app (logged) menu component */
    var module = Vue.component('sumidero-container-component', {
        template: template(),
        data: function () {
            return ({
                compact: false
            });
        }
    });

    return (module);
})();
