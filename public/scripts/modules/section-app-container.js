const template = `
    <div>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand is-unselectable">
                <a class="navbar-item is-uppercase has-text-weight-bold" href="https://github.com/aportela/sumidero" target="_blank">
                    <span class="icon">
                        <i class="fab fa-github"></i>
                    </span>
                    <span>SUMIDERO</span>
                </a>
            </div>
        </nav>
        <transition name="fade">
            <!-- component matched by the route will render here -->
            <router-view></router-view>
        </transition>
    </div>
`;

export default {
    name: 'sumidero-section-app-container',
    template: template
}
