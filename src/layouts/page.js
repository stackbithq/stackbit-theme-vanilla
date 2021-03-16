import React from 'react';
import _ from 'lodash';

import { Layout } from '../components/index';
import { htmlToReact, markdownify } from '../utils';

export default class Page extends React.Component {
    render() {
        const data = _.get(this.props, 'data');
        const config = _.get(data, 'config');
        const page = _.get(this.props, 'page');
        const title = _.get(page, 'title');
        const subtitle = _.get(page, 'subtitle');
        const markdownContent = _.get(page, 'markdown_content');

        return (
            <Layout page={page} config={config}>
                <section className="page">
                    <header className="hero">
                        <div className="copy">
                            <h1>{title}</h1>
                            {subtitle && <h3>{htmlToReact(subtitle)}</h3>}
                        </div>
                    </header>
                    {markdownContent && <div className="content">{markdownify(markdownContent)}</div>}
                </section>
            </Layout>
        );
    }
}
