
const _ = require('lodash')
const path = require('path')

const normalizeMenus = sourceMenus => {
    let menus = []
    if (_.isString(sourceMenus)) {
        menus.push({ menuId: sourceMenus, data: {} } )
    } else if (_.isArray(sourceMenus)) {
        for (const item of sourceMenus) {
            if (_.isString(item)) {
                menus.push({ menuId: item, data: {} })
            } else if (item) {
                const itemId = Object.keys(item)[0]
                menus.push({ menuId: itemId, data: item[itemId] })
            }
        }
    } else {
        Object.keys(sourceMenus).forEach(item => {
            menus.push({ menuId: item, data: sourceMenus[item] })
        })
    }
    return menus
}

const menuComparator = (pageByMenuIdentifier) => {
    return (menu1, menu2) => {

        if (menu1.weight != undefined && menu2.weight != undefined) {
            if (menu1.weight < menu2.weight) {
                return -1
            } else if (menu1.weight > menu2.weight) {
                return 1
            }
        } else if (menu1.weight == undefined && menu2.weight != undefined) {
            return 1
        } else if (menu1.weight != undefined && menu2.weight == undefined) {
            return -1
        }

        const page1 = pageByMenuIdentifier.get(menu1.identifier)
        const page2 = pageByMenuIdentifier.get(menu2.identifier)

        if (page1.birthTime < page2.birthTime) {
            return -1
        } else if (page1.birthTime > page2.birthTime) {
            return 1
        }

        return 0
    }
}

const getPath = (prefix, suffix) => {
    return _.join(prefix.split(`.`).filter(Boolean).concat(suffix), `.`)
}

exports.loadDynamicMenusFromNodes = (sourceNodeType, sourceDataPath, sourceUrlPath) => {
    return (loaderActions) => {
        const { getNodesByType, getNode } = loaderActions

        let menus = {}
        let pageByMenuIdentifier = new Map()

        const sourceMenusPath = getPath(sourceDataPath, `menus`)

        getNodesByType(sourceNodeType).filter(node => 
            _.get(node, sourceMenusPath)
        ).forEach(node => {
            let page = getNode(node.parent)
            if (!page) {
                page = node
            }
            const sourceMenus = _.get(node, sourceMenusPath)
            normalizeMenus(sourceMenus).forEach(menu => {
                if (!menus.hasOwnProperty(menu.menuId)) {
                    menus[menu.menuId] = []
                }

                const pageRelativeDir = _.isEmpty(page.relativeDirectory) 
                    ? ''
                    : page.relativeDirectory.replace(path.sep, '-') + '-'
                const pageId = `${pageRelativeDir}${page.name || page.id}`
                
                const menuResult = {
                    identifier: menu[`data`][`identifier`] || `${menu.menuId}-${pageId}`,
                    title: menu[`data`][`title`] || _.get(node, getPath(sourceDataPath, `title`)) || page.name,
                    url: menu[`data`][`url`] || _.get(node, sourceUrlPath),
                    weight: menu[`data`][`weight`],
                    data: {
                        page___NODE: node.id
                    }
                }

                menus[menu.menuId].push(menuResult)
                pageByMenuIdentifier.set(menuResult.identifier, page)
            })
        })

        Object.keys(menus).forEach((menuId) => {
            menus[menuId].sort(menuComparator(pageByMenuIdentifier))
        })

        return menus
    }
}