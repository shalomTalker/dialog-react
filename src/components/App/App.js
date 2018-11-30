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

  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

Dialog.setWrapper('#root')


class App extends React.Component {
  constructor(props) {
    super(props);
    this.propsData = {};
    this.image = React.createRef();
    this.canvas = React.createRef();
    this.closeBtn = React.createRef()
  }

  componentDidMount = (prevProps, prevState) => {
    (this.props.dialogIsOpen)&&
    this.props.clearForm();
  }
  
  
  afterOpenModal = () => {
    console.log("jfghvjhgvuhg")
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { overlay_bc, content_bc, content_width, timer_ms, image, content_text } = this.props.form


    customStyles.overlay = {
      backgroundColor: overlay_bc || 'rgba(0, 0, 0, 0.7)',
      opacity: 0.7
    }
    customStyles.content = {
      ...customStyles.content,
      opacity: 1,
      backgroundColor: content_bc || "white",
      width: content_width + 'rem',
      height: 'auto'
    }

    this.propsData = {
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
    console.log("object")
    return (
      <div >
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
          <img ref="image" hidden alt="image" />
        </CustomForm>
        <Dialog
          appNode={document.querySelector('#root')}
          dialogIsOpen={this.props.dialogIsOpen}
          handleAfterOpen={this.afterOpenModal}
          handleRequestClose={this.props.closeDialog}
          label="content"
          style={{ ...this.propsData.style }}
          timeoutMS={this.propsData.timeoutMS}
        >

          {this.propsData.children}
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

    /**
     * @class AppComponent
     * @summary root Component that include the main structure
     * and handles the modal toggle within toggleModalHandler function
     * @returns A header web with logo , main title and sub title
     * and also contains form to Subscribe that required typing name and email,
     * and includes the Modal tag Component
    
     */
// class App extends Component {
//   constructor(props) {
//     super(props);
    // this.modalBtn = React.createRef();
    // this.appBtn = React.createRef();
    // this.mainNode = React.createRef();
  // }
  // state = {
  //   isOpen: false,
  //   ariaHide: false,
  //   name: null,
  //   email: null
  // }
  // toggleModalHandler = (e) => {
  //   if (!this.state.isOpen) {
  //     e.preventDefault()
  //     this.getDetails(e)
  //   } 
  //   this.setState({
  //     isOpen: !this.state.isOpen,
  //     ariaHide: !this.state.ariaHide
  //   })
  //   this.appBtn.current.focus()
  // }
  // getDetails = (e) => {
  //   let nameDetail = e.target.querySelector('[name=name]').value
  //   let emailDetail = e.target.querySelector('[name=email]').value
  //   this.setState({
  //     name: nameDetail,
  //     email: emailDetail 
  //   })
  // }
  // componentDidMount = () => {
  //   this.inputArr = Array.from(document.querySelectorAll('input'))
  // }
//   componentWillUpdate = () => {
//     if (!this.state.isOpen) {
//       this.inputArr.map(node => node.setAttribute("tabIndex", "-1"))
//     } else {
//       this.inputArr.map(node => node.removeAttribute("tabIndex"))
//     }
//   }
//   componentDidUpdate = () => {
//     if (this.state.isOpen) {
//       this.appBtn.current.blur()
//       this.modalBtn.current.focus()
//     }
//   }

//   render = () => 
//       {
//         const ModalEl = this.state.isOpen ? (
//         <Modal 
//         onClose={this.toggleModalHandler}
//         btnNode={this.modalBtn}>
//           <div id="dialog-overlay" >
//           <dialog
//             id="dialog">
//             <button
//               aria-label="Close"
//               onClick={this.toggleModalHandler}
//               ref={this.modalBtn}>
//               ✗
//             </button>
//             <div role="document">
//               <div>
//                 <h4>
//                   Hi {this.state.name}
//                   <br />
//                   You have signed up for updates by email: {this.state.email}
//                 </h4>
//               </div>
//               <footer>
//                 <p>
//                   Haaretz.com, the online edition of Haaretz Newspaper in Israel,
//                   and analysis from Israel and the Middle East. 
//                   <br/>
//                   <strong>© Haaretz Daily Newspaper Ltd. All Rights Reserved</strong>
//                 </p>
//               </footer>
//             </div>
//           </dialog>
//           </div>
//         </Modal>
//         ) : null;

//       return (
//     <div id="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <h1 className="App-title">Welcome to Dialog example</h1>
//         <h3 className="App-title"> Haaretz Daily Newspaper Ltd</h3>
//       </header>
//       <main 
//       id="sectionContent"
//       ref={this.mainNode}
//       aria-hidden={this.state.ariaHide || null} >
//         <form onSubmit={this.toggleModalHandler}>
//           <h2>Subscribe to us for notifications</h2>
//           <label htmlFor="name">Enter your name
//             <input 
//             required 
//             name="name" 
//             type="text" />
//           </label>
//           <label htmlFor="email">Enter your email
//             <input 
//             required 
//             placeholder="user@email.com" 
//             name="email" 
//             type="email" />
//           </label>
//           <input
//             type="submit"
//             value="Open the modal"
//             className="btn btn-primary"
//             ref={this.appBtn} />
//         </form>
//       </main>
//       { ModalEl }
//     </div>
//       )
//     }
// }

// Modal.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   onClick: PropTypes.func,
//   children: PropTypes.node,
// };

// export default App;

