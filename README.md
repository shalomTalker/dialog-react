# Project Title

Dynamic Dialog 

### Introduction

The following app is the solution for this [task](https://gist.github.com/TxHawks/5718bec74a593ad686caa1e1fa67589b)

### See live demo:
https://stark-ocean-45348.herokuapp.com/


## Deployment plan

#### initial steps
on init the app, we get initial state that decalred:
 * the status of dialog(bool = false)
 * the status of aria-hidden attribute(bool = false)
 * name and email properties that declared first to null until we'll submit the subscribe form

```javascript

  state = {
      isOpen: false,
    ariaHide: false,
    name: null,
    email: null
  }
```
on init the app, we also construct with some refs :

```javascript

  constructor(props) {
    super(props);
    this.modalBtn = React.createRef();
    this.appBtn = React.createRef();
    this.mainNode = React.createRef();
  }
```
### lifCycle
during lifecycle of app component we declaring and manipulating about the buttons focus and avoid unwanted focus outside of the dialog  
at first, we declared to this.inputArr array that contain all input-node element 
and focus on button form

```javascript
 componentDidMount = () => {
    this.inputArr = Array.from(document.querySelectorAll('input'))
    this.appBtn.current.focus();
    
  }
  ```
  before the component will update we add/remove tabindex attribute with "-1" value to disable the own focus option, depend on if condition 

  ```javascript
 componentWillUpdate = () => {
    if (!this.state.isOpen) {
      this.inputArr.map(node => node.setAttribute("tabIndex", "-1"))
    } else {
      this.inputArr.map(node => node.removeAttribute("tabIndex"))
    }
    
  }
  ```
  Immediately after that component updated the focus turn off from form button element and turn back to dialog button
  ```javascript
  componentDidUpdate = () => {
    if (this.state.isOpen) {
      this.appBtn.current.blur()
      this.modalBtn.current.focus()
    }
  }
  ```
  ### using portal
  at first we create portal call in dialog component whithin render method, and append the children of props that we recieve 
  ``` javascript
    render = () => {
        return ReactDOM.createPortal(
                this.props.children,
                this.el,
            )
    }
  ```
  and later we choose a desirable place to our portal in app component 

### events Handler
we have 3 kind of events that listen to user interactions in special situations:

1. Button event (onClick Event)  
2. tapping ESC key (onKeyup Event) :
```javascript
    keyUpHandler = (e) => {
        e.preventDefault();
        if (e.keyCode === 27) {
            this.props.onClose();
        }
    }
```
2. clicking mouse outside of dialog elementNode (onClick Event) :

```javascript
    outsideClickHandler = (e) => {
        if (!this.modal.contains(e.target)) {
            this.props.onClose();
        }
    }
```
##### all those events call to "toggleModalHandler" that toggle closing/opening dialog  
on this function, we also do more things except changing the state to close/open dialog. for example, about read from current inputs and declare them in the porperties within outer function "getDetails", and after that, focus on button element 

```javascript
 toggleModalHandler = (e) => {
    if (!this.state.isOpen) {
      e.preventDefault()
      this.getDetails(e)
    } 
    this.setState({
      isOpen: !this.state.isOpen,
      ariaHide: !this.state.ariaHide
    })
    this.appBtn.current.focus()
  }

```

this handler, controll on changing the state with opposite boolean of "isOpen" state and "ariaHide" state, and also declare 2 strings (name, email) from user`s inputs. in case that condition if dialog is open within outer util function:

```javascript
  getDetails = (e) => {
    let nameDetail = e.target.querySelector('[name=name]').value
    let emailDetail = e.target.querySelector('[name=email]').value
    this.setState({
      name: nameDetail,
      email: emailDetail 
    })
  }
```
## Modal component
on init the dialog componnet, we construct with some refs. 
this.el is the element that rerendered only if the component mount, and will remove when the component did unmount

```javascript

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }
```

in lifeCycle of this component, the event listener created during the component did mount, 
and removed when the component unmount, also focus/blur on button elemnts and append/remove the content of element from DOM tree:

```javascript
    componentDidMount() {
        this.props.btnNode.current.focus();
        window.addEventListener('keyup', this.keyUpHandler);
        document.addEventListener('click', this.outsideClickHandler);
        modalRoot.appendChild(this.el);
    }
    
    componentWillUnmount() {
        window.removeEventListener('keyup', this.keyUpHandler);
        document.removeEventListener('click', this.outsideClickHandler);
        modalRoot.removeChild(this.el);
    }
```
### dialog content
after submit the form(inputs required) the dialog shown, focus on exit button and contain div tag that includes some dynamic text and informs the user about the details(name, email) That have been inserted. additionaly include footer that contain data footer within props component
```jsx
 <div role="document">
    <div>
        <h4>
            Hi {this.props.name} 
            <br/>
            You have signed up for updates by email: {this.props.email}
        </h4>
    </div>
    <footer>
        {this.props.children}
    </footer> 
</div>
```

## design properties
to set the dialog position I`m use :
```css
.dialogPlaceholder{
    position: fixed;
}
```
to definition of the dialog structure I`m used flexBox properties: 
```css
dialog {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
}
```
to animate the logo i`m used css3 animation:
```css
.App-logo {
  animation: App-logo-spin infinite 5s linear;
}

@keyframes App-logo-spin {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-20deg); }
  100% { transform: rotate(0deg); }
}
```
