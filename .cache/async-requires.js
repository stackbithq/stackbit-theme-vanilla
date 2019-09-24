// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---src-templates-page-js": () => import("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/src/templates/page.js" /* webpackChunkName: "component---src-templates-page-js" */),
  "component---src-templates-home-js": () => import("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/src/templates/home.js" /* webpackChunkName: "component---src-templates-home-js" */),
  "component---src-templates-post-js": () => import("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/src/templates/post.js" /* webpackChunkName: "component---src-templates-post-js" */),
  "component---cache-dev-404-page-js": () => import("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/.cache/dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */)
}

exports.data = () => import(/* webpackChunkName: "pages-manifest" */ "/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/.cache/data.json")

