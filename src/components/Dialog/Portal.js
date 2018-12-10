import React, { Component } from "react";
import PropTypes from "prop-types";
import safeElement from './helpers/safeHTML';
// import * as focusHelper from "./helpers/focusHelper";
import * as ariaHideHelper from "./helpers/ariaHideHelper";



// const TAB = 9;
const ESC = 27;
const matches = 'input, button , select, a, textarea, area, iframe, [contentEditable=true] '

let amountDialogues = 0;

export default class Portal extends Component {

    static propTypes = {
        dialogIsOpen: PropTypes.bool.isRequired,
        defaultStyles: PropTypes.shape({
            content: PropTypes.object,
            overlay: PropTypes.object
        }),
        style: PropTypes.shape({
            content: PropTypes.object,
            overlay: PropTypes.object
        }),
        ariaHide: PropTypes.bool,
        appNode: PropTypes.instanceOf(safeElement),
        handleRequestClose: PropTypes.func,
        timeoutMS: PropTypes.number,
        handleAfterOpen: PropTypes.func,
        shouldFocus: PropTypes.bool,
        shouldCloseOutsideClick: PropTypes.bool,
        role: PropTypes.string,
        label: PropTypes.string,
        aria: PropTypes.object,
        data: PropTypes.object,
        wrapNode: PropTypes.func,
        children: PropTypes.node,
        shouldCloseEsc: PropTypes.bool,
        overlayRef: PropTypes.func,
        contentRef: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            afterOpening: false,
            beforeClosing: false
        };
        this.shouldClose = null;
    }
    componentDidMount() {
        if (this.props.dialogIsOpen) {
            this.open();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.dialogIsOpen && !prevProps.dialogIsOpen) {
            this.open();
        } else if (!this.props.dialogIsOpen && prevProps.dialogIsOpen) {
            this.close();
        }
    }

    componentWillUnmount() {
        this.afterClose();
        clearTimeout(this.closeTimer);
    }
    beforeOpening() {
        const {
            appNode,
            ariaHide
        } = this.props;

        if (ariaHide) {
            amountDialogues += 1;
            ariaHideHelper.hide(appNode);
        }
        if (this.props.shouldFocus) {
            this.nodesArr = Array.from(this.props.appNode.querySelectorAll(matches))
            this.nodesArr.map(node => {
                return node.setAttribute("tabIndex", "-1")
            })
        }
    }
    open = () => {
        this.beforeOpening();

        if (this.state.afterOpening && this.state.beforeClosing) {
            clearTimeout(this.closeTimer);
            this.setState({ beforeClosing: false });
        } else {
            this.setState({ dialogIsOpen: true }, () => {
                this.setState({ afterOpening: true });
                if (this.props.dialogIsOpen && this.props.handleAfterOpen) {
                    this.content.querySelector('#closeBtn').focus()
                    this.props.handleAfterOpen();
                }
            });
        }
    };

    close = () => {
        if (this.props.timeoutMS > 0) {
            this.closeWithTimer();
        } else {
            this.closeWithoutTimer();
        }
    };

    closeWithTimer = () => {
        const closingTime = Date.now() + this.props.timeoutMS;
        this.setState({ beforeClosing: true, closingTime }, () => {
            this.closeTimer = setTimeout(
                this.closeWithoutTimer,
                this.state.closingTime - Date.now()
            );
        });
    };

    closeWithoutTimer = () => {
        this.setState(
            {
                beforeClosing: false,
                dialogIsOpen: false,
                afterOpen: false,
                closingTime: null
            },
            this.afterClose
        );
    };

    contentHasFocus = () => {
        return document.activeElement === this.content || this.content.contains(document.activeElement);
    }

    afterClose = () => {
        const {
            appNode,
            ariaHide
        } = this.props;
        // Reset aria-hidden attribute if all dialogs have been removed
        if (ariaHide && amountDialogues > 0) {
            amountDialogues -= 1;
            if (amountDialogues === 0) {
                if (this.state.afterOpening && !this.state.beforeClosing) {
                    this.nodesArr = Array.from(this.props.appNode.querySelectorAll(matches))
                    this.nodesArr.map((node, index) => {
                        return node.setAttribute("tabIndex", index + 1)
                    })
                    this.nodesArr[this.nodesArr.length - 1].focus()
                }
                ariaHideHelper.show(appNode);
            }
        }
    };
    setOverlayRef = overlay => {
        this.overlay = overlay;
        this.props.overlayRef && this.props.overlayRef(overlay);
    };

    setContentRef = content => {
        this.content = content;
        this.props.contentRef && this.props.contentRef(content);
    };

    // handles
    handleKeyDown = event => {
        if (this.props.shouldCloseEsc && event.keyCode === ESC) {
            event.stopPropagation();
            this.requestClose(event);
        }
    };

    handleOverlayOnClick = event => {
        if (this.shouldClose === null) {
            this.shouldClose = true;
        }

        if (this.shouldClose && this.props.shouldCloseOutsideClick && !this.content.contains(event.target)) {
            this.requestClose(event);
        }
        this.shouldClose = null;
    };

    requestClose = event => this.ownerHandlesClose() && this.props.handleRequestClose(event);

    ownerHandlesClose = () => this.props.handleRequestClose;

    shouldBeClosed = () => !this.state.dialogIsOpen && !this.state.beforeClosing;

    attributesFromObject = (prefix, items) => Object.keys(items).reduce((acc, name) => {
        acc[`${prefix}-${name}`] = items[name];
        return acc;
        }, {}
    );

    render() {
        console.log(this.props.defaultStyles, this.props.customStyle)
        const { defaultStyles } = this.props;
        const contentDefStyles = defaultStyles.content;
        const overlayDefStyles = defaultStyles.overlay;

        return !this.shouldBeClosed() && (
            <div
                ref={this.setOverlayRef}
                className="overlay"
                style={{ ...overlayDefStyles, ...this.props.customStyle.overlay }}
                onClick={this.handleOverlayOnClick}>
                <div
                    ref={this.setContentRef}
                    style={{ ...contentDefStyles, ...this.props.customStyle.content }}
                    className="dialog"
                    onKeyDown={this.handleKeyDown}
                    role={this.props.role}
                    aria-label={this.props.label}
                    {...this.attributesFromObject("aria", this.props.aria || {})}
                    {...this.attributesFromObject("data", this.props.data || {})}>
                    <button className="closeBtn" onClick={(e) => this.requestClose(e)}>X</button>
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}
