import React from 'react';
import _ from 'lodash';

import Action from './Action';
import { htmlToReact } from '../utils';

export default class Footer extends React.Component {
    render() {
        const config = _.get(this.props, 'config');
        const footer = _.get(config, 'footer');
        const copyright = _.get(footer, 'content');
        const links = _.get(footer, 'links');
        const hasSocial = _.get(footer, 'has_social');
        const socialLinks = _.get(footer, 'social_links');

        return (
            <footer className="footer container">
                {copyright && <div className="copyright">{htmlToReact(copyright)}</div>}
                {!_.isEmpty(links) && (
                    <nav>
                        {_.map(links, (action, index) => <Action key={index} action={action} actionClass={'subtle-link'} />)}
                    </nav>
                )}
                {hasSocial && !_.isEmpty(socialLinks) && (
                    <div className="social-links">
                        {_.map(socialLinks, (action, index) => <Action key={index} action={action} actionClass={'subtle-link'} />)}
                    </div>
                )}
            </footer>
        );
    }
}
