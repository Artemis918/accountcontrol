"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var mcss = require("./monthselect.css");
var CState = /** @class */ (function () {
    function CState() {
    }
    return CState;
}());
var MonthSelect = /** @class */ (function (_super) {
    __extends(MonthSelect, _super);
    function MonthSelect(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = _this.handleChange.bind(_this);
        _this.state = { month: _this.props.month, year: _this.props.year };
        return _this;
    }
    MonthSelect.prototype.handleChange = function (m, y) {
        this.setState({ month: m, year: y });
        this.props.onChange(m, y);
    };
    MonthSelect.prototype.render = function () {
        var _this = this;
        return (<div>
                {this.props.label}
                <input className={mcss.yearnumber} type='number' value={this.state.month} min='1' max='12' onChange={function (e) { return _this.handleChange(Number(e.target.value), _this.state.year); }}/>
                <input className={mcss.monthnumber} type='number' value={this.state.year} min='2000' max='3000' onChange={function (e) { return _this.handleChange(_this.state.month, Number(e.target.value)); }}/>
               </div>);
    };
    return MonthSelect;
}(React.Component));
exports["default"] = MonthSelect;
