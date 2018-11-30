import { ON_INPUT, CLEAR_FORM } from '../actions/types';

const initialState = {

}

export default (state = initialState, action) => {
    switch (action.type) {
        case ON_INPUT:
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case CLEAR_FORM:
            console.log(action.payload)
            return {}
        default:
            return state
    }
}