import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';

import { getPageUrl, Link, withPrefix } from '../utils';

export default class SectionPosts extends React.Component {
    renderRecentPost(post, index, section) {
        const title = _.get(post, 'title');
        const postUrl = getPageUrl(post, { withPrefix: true });
        const thumbImage = _.get(post, 'thumb_img_path');
        const thumbImageAlt = _.get(post, 'thumb_img_alt', '');
        const date = _.get(post, 'date');
        const dateTimeAttr = moment(date).strftime('%Y-%m-%d %H:%M');
        const formattedDate = moment(date).strftime('%B %d, %Y');
        const excerpt = _.get(post, 'excerpt');
        const hasMoreLink = _.get(section, 'has_more_link');
        const moreLinkText = _.get(section, 'more_link_text');

        return (
            <Link key={index} href={postUrl} className="article-teaser">
                {thumbImage && <img src={withPrefix(thumbImage)} alt={thumbImageAlt} className="thumbnail" />}
                <div className="copy">
                    <h2>{title}</h2>
                    <h3 className="publish-date">Published on <time className="published" dateTime={dateTimeAttr}>{formattedDate}</time></h3>
                    {excerpt && <p className="summary">{excerpt}</p>}
                    {hasMoreLink && moreLinkText && <div className="text-link">{moreLinkText}</div>}
                </div>
            </Link>
        );
    }
    render() {
        const section = _.get(this.props, 'section');
        const sectionId = _.get(section, 'section_id');
        const posts = _.orderBy(_.get(this.props, 'posts', []), 'date', 'desc');

        return (
            <section id={sectionId} className="posts">
                <div className="grid post-feed">
                    {_.map(posts, (post, index) => this.renderRecentPost(post, index, section))}
                </div>
            </section>
        );
    }
}
