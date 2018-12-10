import React, { Component } from 'react';
import Dialog from '../Dialog/Dialog';
import CustomForm from '../Form/CustomForm';
import { connect } from 'react-redux'
import * as formActions from '../../actions/formActions'
import * as dialogActions from '../../actions/dialogActions'

import { dialogFormModel } from '../Form/inputsModel'

import * as handleImageHelper from '../Form/helpers/handleImageHelper'
import './App.css';

const customStyles = {
//   content: {
//     
//   }
};

Dialog.setWrapper('#root')


class App extends React.Component {
  constructor(props) {
    super(props);
    this.customProps = {};
    this.image = React.createRef();
    this.canvas = React.createRef();
    this.closeBtn = React.createRef()
  }

  componentDidMount = (prevProps, prevState) => {
    (this.props.dialogIsOpen)&&
    this.props.clearForm();
  }
  
  handleFormSubmit = (e) => {
    e.preventDefault();
    let { overlay_bc, content_bc, content_width, timer_ms, image, content_text } = this.props.form
    let customStyles = {}
    customStyles.overlay = {
      backgroundColor: overlay_bc || 'rgba(0, 0, 0, 0.7)',
      opacity: 0.7
    }
    customStyles.content = {
      backgroundColor: content_bc || "white",
      width: content_width + 'rem',
      height: 'auto'
    }

    this.customProps = {
      style: customStyles,
      timeoutMS: Number(timer_ms),
      children: this.setContent(image, content_text)
    }
    this.props.clearForm()
    this.props.openDialog()
  }
  setContent = (imageName, text) => {
    const image =JSON.parse(localStorage.getItem("IMAGE"))
    return (
      <figure>
        <img src={image} alt={imageName} style={{ width: "70%" }} />
        <figcaption>{text}</figcaption>
      </figure>
    )
  }
  handleFile = (event) => {
    const e = {
      target: {
        name: "image",
        value: handleImageHelper.handleFile(event)
      }
    }
    this.props.onInput(e)
  }


  render() {
    return (
      <div id="App">
        <CustomForm
          enctype="multipart/form-data"
          classcss="col-12 card-panel"
          title="form"
          onsubmit={this.handleFormSubmit}
          model={dialogFormModel}
          btnSubmit={true}
          handleFile={this.handleFile}
        >
          <canvas ref="canvas" />
          <img ref="image" hidden alt="" />
        </CustomForm>
        <Dialog
          appNode={document.querySelector('#root')}
          dialogIsOpen={this.props.dialogIsOpen}
          handleAfterOpen={this.afterOpenModal}
          handleRequestClose={this.props.closeDialog}
          label="content"
          customStyle={{ ...this.customProps.style }}
          timeoutMS={this.customProps.timeoutMS}
          >
          {this.customProps.children}
        </Dialog>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    form: state.form,
    dialogIsOpen: state.dialog.dialogIsOpen
  }
}
const mapDispatchToProps = dispatch => {
  return {
    closeDialog: () =>{
      dispatch(dialogActions.closeDialog())
    },
    openDialog: () =>{
      dispatch(dialogActions.openDialog())
    },
    onInput: (e) => {
      dispatch(formActions.onInput(e))
    },
    clearForm: () => {
      dispatch(formActions.clearForm())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
