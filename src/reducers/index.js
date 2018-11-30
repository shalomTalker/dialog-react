import { combineReducers } from 'redux';
import dialogReducer from './dialogReducer'
import formReducer from './formReducer'

export default combineReducers({
    dialog: dialogReducer,
    form: formReducer
})