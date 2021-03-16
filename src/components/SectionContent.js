import React from 'react';
import _ from 'lodash';

import { withPrefix, markdownify } from '../utils';

export default class SectionContent extends React.Component {
    render() {
        const section = _.get(this.props, 'section');
        const sectionId = _.get(section, 'section_id');
        const image = _.get(section, 'image');
        const imageAlt = _.get(section, 'image_alt', '');
        const content = _.get(section, 'content');

        return (
            <section id={sectionId} className="content">
                {image && (
                    <div className="inline-image">
                        <img src={withPrefix(image)} alt={imageAlt} />
                    </div>
                )}
                {content && <div className="copy">{markdownify(content)}</div>}
            </section>
        );
    }
}
