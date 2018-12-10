import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as formActions from '../../actions/formActions'
// import { ON_INPUT } from '../../actions/types'
import PropTypes from "prop-types";



class CustomForm extends Component {
    
    static propTypes = {
        children: PropTypes.node,
        btnSubmit: PropTypes.bool,
        classcss: PropTypes.string,
        title: PropTypes.string,
        enctype: PropTypes.string,
        onsubmit: PropTypes.func,
        model: PropTypes.array,
        ondoubleclick: PropTypes.func,
        form: PropTypes.object,
        handleFile: PropTypes.func,
        onInput: PropTypes.func,
        clearForm:PropTypes.func
    };

    render() {

        return (
            <div className={`${this.props.classcss}`}>
                <h4>{this.props.title}</h4>
                <form
                    encType={(this.props.enctype) && this.props.enctype}
                    onSubmit={(e) => this.props.onsubmit(e)}>
                    {

                        this.props.model.map((field, index) => {
                            return (
                                <div className="input" key={index}>
                                    <CustomInput
                                        required={field.required}
                                        step={(field.step) && field.step}
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        label={field.label}
                                        icon={(field.icon) && field.icon}
                                        ondoubleclick={this.props.ondoubleclick}
                                        currentValue={(this.props.form[field.name]) && this.props.form[field.name]}
                                        onchange={this.props.handleFile}
                                        oninput={this.props.onInput}
                                    ></CustomInput>
                                    {
                                        (field.isValid) &&
                                            ((field.isValid(this.props.form[field.name])) || (!this.props.form[field.name])) ?
                                            undefined :
                                            <p className="error red-text">{field.errMsg}</p>
                                    }
                                </div>
                            )

                        })
                    }

                    <div>{this.props.children}</div>

                    {
                        (this.props.btnSubmit) &&
                        <button
                            type="submit"
                            name="action">Submit
                        <i className="material-icons right">send</i>
                        </button>
                    }
                </form>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        form: state.form
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onInput: (e) => {
            dispatch(formActions.onInput(e))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomForm)

const CustomInput = ({ name, id, step, type, oninput, icon, label, required, currentValue, ondoubleclick, onchange }) => {

    return (
        <div className="input-field row">
            <input
                step={(step) &&step}
                onInput={(e) => (type !== 'file') && oninput(e)}
                required={required}
                defaultValue={currentValue}
                name={name}
                id={id}
                type={type}
                onDoubleClick={(e) => (ondoubleclick) && ondoubleclick(e)}
                onChange={(e) => (onchange && type === 'file') && onchange(e)}
            />
            {icon ?
                <i className="small material-icons">{icon}</i>
                : null}
            <label className="active" htmlFor={id}>{label}</label>

        </div>
    )

}