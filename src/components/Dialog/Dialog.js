import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Portal from "./Portal";
import * as ariaHideHelper from "./helpers/ariaHideHelper";
import safeElement, { safeUsingDom } from "./helpers/safeHTML";

function getWrapNode(wrapNode) {
    return wrapNode();
}

class Dialog extends Component {
    static setWrapper(element) {
        ariaHideHelper.initHideWrapper(element);
    }

    static propTypes = {
        dialogIsOpen: PropTypes.bool.isRequired,
        style: PropTypes.shape({
            content: PropTypes.object,
            overlay: PropTypes.object
        }),
        appNode: PropTypes.instanceOf(safeElement),
        handleAfterOpen: PropTypes.func,
        handleRequestClose: PropTypes.func,
        timeoutMS: PropTypes.number,
        ariaHide: PropTypes.bool,
        shouldFocus: PropTypes.bool,
        shouldCloseOutsideClick: PropTypes.bool,
        wrapNode: PropTypes.func,
        aria: PropTypes.object,
        data: PropTypes.object,
        role: PropTypes.string,
        label: PropTypes.string,
        shouldCloseEsc: PropTypes.bool,
        overlayRef: PropTypes.func,
        contentRef: PropTypes.func
    };

    static defaultProps = {
        dialogIsOpen: false,
        role: "dialog",
        ariaHide: true,
        timeoutMS: 0,
        shouldFocus: true,
        shouldCloseEsc: true,
        shouldCloseOutsideClick: true,
        wrapNode: () => document.body
    };

    static defaultStyles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)"
        },
        content: {
            position: "absolute",
            top: "40px",
            left: "40px",
            right: "40px",
            bottom: "40px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px"
        }
    };

    componentDidMount = () => {
        if (!safeUsingDom) return;
        const parent = getWrapNode(this.props.wrapNode);
        parent.appendChild(this.node);
    }
    
    getSnapshotBeforeUpdate = (prevProps, nextProps) => {
        const prevWrapNode = getWrapNode(prevProps.wrapNode);
        const nextWrapNode = getWrapNode(this.props.wrapNode);
        
        return { prevWrapNode, nextWrapNode };
    }
    
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { dialogIsOpen } = this.props;
        const { prevWrapNode, nextWrapNode } = snapshot;
        if (!safeUsingDom) return;
        if (nextWrapNode !== prevWrapNode) {
            prevWrapNode.removeChild(this.node);
            nextWrapNode.appendChild(this.node);
        }

        if (!prevProps.dialogIsOpen && !dialogIsOpen) return;

    }

    componentWillUnmount = () => {
        console.log('object')
        if (!safeUsingDom || !this.node || !this.portalNode) return;

        const portalState = this.portalNode.state;
        const now = Date.now();
        const closingTime = portalState.dialogIsOpen && this.props.timeoutMS &&
            (portalState.closingTime || now + this.props.timeoutMS);

        if (closingTime) {
            if (!portalState.beforeClosing) {
                this.portalNode.closeWithTimer();
            }

            setTimeout(this.removePortalNode, closingTime - now);
        } else {
            this.removePortalNode();
        }
    }

    removePortalNode = () => {
        const parent = getWrapNode(this.props.wrapNode);
        parent.removeChild(this.node);
    };

    portalRef = ref => {
        this.portalNode = React.createRef(ref);
       
    };


    render() {
        if (!safeUsingDom) {
            return null;
        }
        if (!this.node) {
            this.node = document.createElement("div");
        }

        return ReactDOM.createPortal(
            <Portal
                ref={this.portalRef}
                defaultStyles={Dialog.defaultStyles}
                {...this.props}
            />,
            this.node
        );
    }
}


export default Dialog;
