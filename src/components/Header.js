import React from 'react';
import _ from 'lodash';

import { Link, withPrefix, classNames, getPageUrl } from '../utils';
import Action from './Action';

export default class Header extends React.Component {
    renderNavLinks(navLinks, pageUrl) {
        return (
            <nav>
                {_.map(navLinks, (action, index) => {
                    const actionUrl = _.trim(_.get(action, 'url'), '/');
                    const classes = classNames('nav-link', {
                        'active': pageUrl === actionUrl
                    });
                    return <Action key={index} action={action} actionClass={classes} />;
                })}
            </nav>
        );
    }

    render() {
        const page = _.get(this.props, 'page');
        const pageUrl = _.trim(getPageUrl(page), '/');
        const config = _.get(this.props, 'config');
        const header = _.get(config, 'header');
        const title = _.get(header, 'title');
        const hasNav = _.get(header, 'has_nav');
        const navLinks = _.get(header, 'nav_links');

        return (
            <header id="header" className="header container">
                {title && <Link href={withPrefix('/')} className="logo">{title}</Link>}
                {hasNav && !_.isEmpty(navLinks) && this.renderNavLinks(navLinks, pageUrl)}
            </header>
        );
    }
}
