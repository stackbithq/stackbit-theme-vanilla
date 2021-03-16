import React from 'react';
import _ from 'lodash';

import { withPrefix, markdownify } from '../utils';

export default class SectionHero extends React.Component {
    render() {
        const data = _.get(this.props, 'data');
        const author = _.get(data, 'author');
        const avatar = _.get(author, 'avatar');
        const avatarAlt = _.get(author, 'avatar_alt', '');
        const section = _.get(this.props, 'section');
        const sectionId = _.get(section, 'section_id');
        const image = _.get(section, 'image');
        const imageAlt = _.get(section, 'image_alt', '');
        const title = _.get(section, 'title');
        const subtitle = _.get(section, 'subtitle');
        return (
            <section id={sectionId} className="hero">
                {(image || avatar) && <img src={image ? withPrefix(image) : withPrefix(avatar)} alt={image ? imageAlt : avatarAlt} />}
                <div className="copy">
                    {title && <h1>{title}</h1>}
                    {subtitle && <div>{markdownify(subtitle)}</div>}
                </div>
            </section>
        );
    }
}
