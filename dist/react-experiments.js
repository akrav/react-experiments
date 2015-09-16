(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactExperiments"] = factory(require("react"));
	else
		root["ReactExperiments"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var Experiment = _interopRequire(__webpack_require__(1));

	var Variations = _interopRequireWildcard(__webpack_require__(4));

	var experimentClass = _interopRequire(__webpack_require__(5));

	var Parametrize = _interopRequire(__webpack_require__(3));

	module.exports = {
	  Experiment: Experiment,
	  Variation: Variations.Variation,
	  Default: Variations.Default,
	  experimentClass: experimentClass,
	  Parametrize: Parametrize
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(2));

	var Parametrize = _interopRequire(__webpack_require__(3));

	var Experiment = React.createClass({
	  displayName: "Experiment",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      shouldEnroll: true,
	      param: null,
	      experimentName: null
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      hasRendered: false
	    };
	  },

	  enrolledInVariation: function enrolledInVariation() {
	    if (!this.state.hasRendered) {
	      this.setState({
	        hasRendered: true
	      });
	    }
	  },

	  renderExposedVariation: function renderExposedVariation() {
	    var _props = this.props;
	    var param = _props.param;
	    var shouldEnroll = _props.shouldEnroll;
	    var experiment = _props.experiment;
	    var experimentName = _props.experimentName;

	    if (!shouldEnroll) {
	      return null;
	    } else if (!experiment) {
	      console.error("You must pass in an experiment instance as a prop");
	      return null;
	    } else if (!param && !experimentName) {
	      console.error("You must pass in either a param name or experiment name as a prop");
	      return null;
	    }

	    return React.createElement(
	      Parametrize,
	      {
	        experiment: experiment,
	        experimentName: experimentName,
	        param: param,
	        enrolledInVariation: this.enrolledInVariation,
	        hasRendered: this.state.hasRendered },
	      this.props.children
	    );
	  },

	  render: function render() {
	    return this.renderExposedVariation();
	  }
	});

	module.exports = Experiment;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(2));

	var Parametrize = React.createClass({
	  displayName: "Parametrize",

	  getInitialState: function getInitialState() {
	    return {
	      experimentParameters: null
	    };
	  },

	  childContextTypes: {
	    experimentParameters: React.PropTypes.object,
	    experimentProps: React.PropTypes.object.isRequired
	  },

	  getChildContext: function getChildContext() {
	    return {
	      experimentParameters: this.state.experimentParameters,
	      experimentProps: this.props
	    };
	  },

	  componentWillMount: function componentWillMount() {
	    this.selectVariation();
	  },

	  selectVariation: function selectVariation() {
	    var _props = this.props;
	    var experiment = _props.experiment;
	    var param = _props.param;
	    var experimentName = _props.experimentName;

	    var params = {};

	    if (!experiment || !experiment.getParams) {
	      console.error("You must pass in an experiment instance as a prop");
	      return;
	    }

	    if (param) {
	      params[param] = experiment.get(param);

	      this.setState({
	        experimentParameters: params
	      });
	    } else {
	      params = experiment.getParams(experimentName) || {};

	      this.setState({
	        experimentParameters: params
	      });
	    }

	    if (!experiment.previouslyLogged()) {
	      experiment.logExposure({
	        params: params,
	        name: experiment.name
	      });
	    }
	  },

	  renderExperiment: function renderExperiment() {
	    var _this = this;

	    if (!this.state.experimentParameters) {
	      return null;
	    }

	    var renderedChildren = React.Children.map(this.props.children, function (child) {
	      return React.addons.cloneWithProps(child, { experimentParameters: _this.state.experimentParameters, experimentProps: _this.props });
	    });

	    return React.createElement(
	      "div",
	      null,
	      renderedChildren
	    );
	  },

	  render: function render() {
	    return this.renderExperiment();
	  }
	});

	module.exports = Parametrize;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var React = _interopRequire(__webpack_require__(2));

	var Variation = React.createClass({
	  displayName: "Variation",

	  getInitialState: function getInitialState() {
	    return {
	      shouldRender: false
	    };
	  },

	  contextTypes: {
	    experimentParameters: React.PropTypes.object.isRequired,
	    experimentProps: React.PropTypes.object.isRequired
	  },

	  componentWillUpdate: function componentWillUpdate(props, state) {
	    if (state.shouldRender) {
	      this.context.experimentProps.enrolledInVariation();
	    }
	  },

	  componentDidMount: function componentDidMount() {
	    this.shouldRenderVariation();
	  },

	  shouldRenderVariation: function shouldRenderVariation() {
	    var name = this.props.name;
	    var paramName = this.props.param || this.context.experimentProps.param;
	    if (this.context.experimentParameters && this.context.experimentParameters[paramName] === name) {
	      this.setState({
	        shouldRender: true
	      });
	    }
	  },

	  renderChildren: function renderChildren() {
	    return React.Children.map(this.props.children, function (child) {
	      if (React.isValidElement(child)) {
	        return React.addons.cloneWithProps(child, {});
	      }
	      return child;
	    });
	  },

	  render: function render() {
	    if (!this.state.shouldRender) {
	      return null;
	    }

	    return React.createElement(
	      "span",
	      { className: "experiment-variation-component" },
	      this.renderChildren()
	    );
	  }
	});

	exports.Variation = Variation;
	var Default = React.createClass({
	  displayName: "Default",

	  contextTypes: {
	    experimentProps: React.PropTypes.object.isRequired
	  },

	  render: function render() {
	    if (this.context.experimentProps.hasRendered) {
	      return null;
	    }

	    return React.createElement(
	      "span",
	      null,
	      this.props.children
	    );
	  }
	});
	exports.Default = Default;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var experimentClass = (function () {
	  function experimentClass() {
	    _classCallCheck(this, experimentClass);
	  }

	  _createClass(experimentClass, {
	    getParams: {
	      value: function getParams(experimentName) {
	        throw "IMPLEMENT getParams";
	      }
	    },
	    logExposure: {
	      value: function logExposure(opts) {
	        throw "IMPLEMENT logExposure";
	      }
	    },
	    getName: {
	      value: function getName() {
	        throw "IMPLEMENT getName";
	      }
	    },
	    previouslyLogged: {
	      value: function previouslyLogged() {
	        throw "IMPLEMENT previouslyLogged";
	      }
	    }
	  });

	  return experimentClass;
	})();

	;

	module.exports = experimentClass;

/***/ }
/******/ ])
});
;