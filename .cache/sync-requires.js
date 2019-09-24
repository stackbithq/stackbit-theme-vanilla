const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-templates-page-js": hot(preferDefault(require("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/src/templates/page.js"))),
  "component---src-templates-home-js": hot(preferDefault(require("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/src/templates/home.js"))),
  "component---src-templates-post-js": hot(preferDefault(require("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/src/templates/post.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/rob/work/stackbit/stackbit-themes/themes/vanilla/.cache/dev-404-page.js")))
}

