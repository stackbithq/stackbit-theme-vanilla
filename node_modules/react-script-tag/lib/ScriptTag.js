'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEST_ENV = 'production' === 'test';
var noop = function noop() {};

var ScriptTag = function (_Component) {
    (0, _inherits3.default)(ScriptTag, _Component);

    ScriptTag.removeNode = function removeNode(node) {
        if (node) {
            node.parentNode.removeChild(node);
        }
    };

    function ScriptTag(props, context) {
        (0, _classCallCheck3.default)(this, ScriptTag);

        var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, context));

        _this.domRef = null;
        _this.state = {
            isHydrated: props.isHydrating,
            additionalNode: null,
            removeAdditionalNode: null
        };
        return _this;
    }

    ScriptTag.prototype.appendAdditionalElement = function appendAdditionalElement() {
        var _props = this.props,
            onError = _props.onError,
            onLoad = _props.onLoad,
            nonce = _props.nonce;

        // Create a new HTML script element

        var newElement = document.createElement("script");

        // Copy all attribute values
        for (var i = 0, len = this.domRef.attributes.length; i < len; i++) {
            var attr = this.domRef.attributes[i];
            if (attr.nodeName === 'nonce') {
                // The browser clears the nonce value - grab from props
                newElement.setAttribute(attr.nodeName, nonce);
            } else {
                newElement.setAttribute(attr.nodeName, attr.nodeValue);
            }
        }

        // Copy the inner script
        if (this.domRef.src === '' && this.domRef.innerHTML && this.domRef.innerHTML !== '') {
            newElement.innerHTML = this.domRef.innerHTML;
        }

        // Bind event listeners
        newElement.addEventListener('load', onLoad);
        newElement.addEventListener('error', onError);

        // Append the new script tag
        this.domRef.parentNode.appendChild(newElement);
        return newElement;
    };

    ScriptTag.prototype.componentDidMount = function componentDidMount() {
        var isHydrated = this.state.isHydrated;

        if (isHydrated) {
            // was rendered on server, don't replace elements when hydrating
            return;
        }

        this.setState({
            additionalNode: this.appendAdditionalElement(),
            removeAdditionalNode: null
        });
    };

    ScriptTag.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // This logic assumes that the <script> only need to be updated if the 'src' or 'innerHTML' has changed
        //  - this prevents the <script> from updating unnecessarily, which prevents additional 'onload' events

        // This isn't perfect - but it keeps the component very simple, and should cover most use-cases
        // Other props SHOULD be assigned at the same time as either the 'src' or 'innerHTML' property
        // -> If this is to change and support updating on ANY prop change, the 'appendAdditionalElement()' method
        //    and state management will need to be modified to manipulate the DOM script tag based on each prop change.
        //    This really complicates the component - for now we'll leave it as is.
        var _props2 = this.props,
            src = _props2.src,
            dangerouslySetInnerHTML = _props2.dangerouslySetInnerHTML;

        if (src && src === nextProps.src) {
            // The 'src' attribute has not changed
            return;
        }

        if (dangerouslySetInnerHTML && dangerouslySetInnerHTML.__html === nextProps.dangerouslySetInnerHTML.__html) {
            // The 'dangerouslySetInnerHTML' attribute has not changed
            return;
        }

        this.setState({
            removeAdditionalNode: this.state.additionalNode,
            additionalNode: null
        });
    };

    ScriptTag.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
        ScriptTag.removeNode(nextState.removeAdditionalNode);
    };

    ScriptTag.prototype.componentDidUpdate = function componentDidUpdate() {
        var _state = this.state,
            additionalNode = _state.additionalNode,
            removeAdditionalNode = _state.removeAdditionalNode;

        if (additionalNode === null) {
            this.setState({
                additionalNode: this.appendAdditionalElement()
            });
        }

        if (removeAdditionalNode !== null) {
            // Was removed in 'componentWillUpdate', but can not update state there
            this.setState({
                removeAdditionalNode: null
            });
        }
    };

    ScriptTag.prototype.componentWillUnmount = function componentWillUnmount() {
        ScriptTag.removeNode(this.state.removeAdditionalNode);
        ScriptTag.removeNode(this.state.additionalNode);
    };

    ScriptTag.prototype.render = function render() {
        var _this2 = this;

        var additionalNode = this.state.additionalNode;

        if (additionalNode !== null) {
            return null;
        }

        // The 'isHydrating' prop must NOT be passed to the script tag
        // eslint-disable-next-line no-unused-vars
        var _props3 = this.props,
            isHydrating = _props3.isHydrating,
            tagProps = (0, _objectWithoutProperties3.default)(_props3, ['isHydrating']);

        return _react2.default.createElement('script', (0, _extends3.default)({}, tagProps, { ref: function ref(tag) {
                return _this2.domRef = tag;
            } }));
    };

    return ScriptTag;
}(_react.Component);

ScriptTag.propTypes = {
    /**
     * True if the <ScriptTag> is being hydrated on the client, otherwise false.
     */
    isHydrating: _propTypes2.default.bool,

    // Standard <script> tag props
    async: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
    crossOrigin: _propTypes2.default.string,
    defer: _propTypes2.default.bool,
    integrity: _propTypes2.default.string,
    nonce: _propTypes2.default.string,
    src: _propTypes2.default.string,
    text: _propTypes2.default.string,
    type: _propTypes2.default.string,
    dangerouslySetInnerHTML: _propTypes2.default.object,

    // globals
    onError: _propTypes2.default.func,
    onLoad: _propTypes2.default.func
};
ScriptTag.defaultProps = {
    isHydrating: false,
    onError: noop,
    onLoad: noop
};
exports.default = ScriptTag;