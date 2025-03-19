import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Auth0Roles } from 'src/app/shared/enums/auth0-roles.enum';
import { environment } from 'src/environments/environment';
import { filter, forkJoin, startWith, take } from 'rxjs';
import { AnalyticsService, USER } from '@meltwater/ngx-helios-analytic';
import { MatIconModule } from '@angular/material/icon';

type NavigationItem = {
    routerLink: string;
    svgIcon: string;
    title: string;
    requiredRoles: Auth0Roles[];
    children?: Omit<NavigationItem, 'svgIcon' | 'children' | 'viewExpanded'>[];
    viewExpanded?: boolean;
};

type AssetIcon = {
    name: string;
    path: string;
};

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    isNavigationMenuOpen = false;
    navigationMenuWidth = 56;
    sidenavContentLeftMargin = 60;

    userName: string = '';
    fullName: string = '';
    emailId: string = '';
    currentYear = new Date().getFullYear();
    currentRoute: string = '';

    currentUserRoles: Auth0Roles[] = [];

    allNavigationItems: NavigationItem[] = [
        {
            routerLink: '/home-page',
            svgIcon: 'home',
            title: 'MyReadingList',
            requiredRoles: [],
        },
        {
            routerLink: '/add-book',
            svgIcon: 'add',
            title: 'add books',
            requiredRoles: [],
        },
        {
            routerLink: '/view-books',
            svgIcon: '',
            title: 'view books',
            requiredRoles: [],
        },
        {
            routerLink: '/stats',
            svgIcon: '',
            title: 'stats',
            requiredRoles: [],
        },
        {
            routerLink: '/settings',
            svgIcon: 'settings',
            title: 'Settings',
            requiredRoles: [Auth0Roles.ADMIN],
            viewExpanded: false,
            children: [
                {
                    routerLink: '/settings/users',
                    title: 'User Management',
                    requiredRoles: [Auth0Roles.ADMIN],
                },
            ],
        },
    ];
    filteredNavigationItems: NavigationItem[] = [];

    icons: AssetIcon[] = [
        { name: 'avatar', path: 'assets/images/icons/avatar.svg' },
        { name: 'close', path: 'assets/images/icons/close.svg' },
        { name: 'dashboard', path: 'assets/images/icons/dashboard.svg' },
        { name: 'home', path: 'assets/images/icons/home.svg' },
        { name: 'meltwater', path: 'assets/images/icons/meltwater.svg' },
        { name: 'menu', path: 'assets/images/icons/menu.svg' },
        { name: 'settings', path: 'assets/images/icons/settings.svg' },
    ];

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router,
        private auth: AuthService,
        private analytics: AnalyticsService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.icons.forEach((icon) => this.setupIcon(icon));
    }

    ngOnInit() {
        this.closeNavigationMenu();

        /** Auth0 Setup & Page Title */
        forkJoin({
            user: this.auth.user$.pipe(take(1)),
            routeEvent: this.router.events.pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                ),
                startWith(this.router),
                take(1)
            ),
        })
            .pipe(take(1))
            .subscribe(({ user, routeEvent }) => {
                this.currentUserRoles =
                    user![environment.auth0RolesNamespace]
                        ?.authorizationRoles || [];
                this.filterNavigationItemsForUser();

                this.emailId = user!.email ? user!.email : '';
                if (user!.nickname) {
                    const [firstName, secondName] = user!.nickname.split('.');
                    this.userName = `${
                        firstName?.charAt(0) ? firstName.charAt(0) : ''
                    }${secondName?.charAt(0) ? '' + secondName.charAt(0) : ''}`;
                    this.fullName = `${firstName} ${secondName}`;
                } else {
                    this.userName = '';
                    this.fullName = '';
                }

                const url =
                    (routeEvent as NavigationEnd)?.url || this.router.url;
                this.currentRoute =
                    this.allNavigationItems.find((navigationItem) =>
                        url.includes(navigationItem.routerLink)
                    )?.title || 'Meltwater';
            });
    }

    private setupIcon(icon: AssetIcon) {
        this.iconRegistry.addSvgIcon(
            icon.name,
            this.sanitizer.bypassSecurityTrustResourceUrl(icon.path)
        );
    }

    private filterNavigationItemsForUser() {
        this.filteredNavigationItems = this.allNavigationItems.filter(
            (navigationItem) => {
                if (navigationItem.requiredRoles.length > 0)
                    return navigationItem.requiredRoles.some((role) =>
                        this.currentUserRoles.includes(role)
                    );
                return true;
            }
        );
    }

    openNavigationMenu() {
        this.isNavigationMenuOpen = true;
        this.navigationMenuWidth = 265;
    }

    closeNavigationMenu() {
        this.isNavigationMenuOpen = false;
        this.navigationMenuWidth = 56;
    }

    logout() {
        this.analytics.trackEvent(USER.LOGGED_OUT);
        this.auth.logout({
            logoutParams: {
                returnTo: this.document.location.origin,
            },
        });
    }
}
