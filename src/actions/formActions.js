import { ON_INPUT, CLEAR_FORM } from './types';


export const onInput = (e) => dispatch => {
    dispatch({
        type: ON_INPUT,
        payload: e.target
    })
}

export const clearForm = () => dispatch => {
    dispatch({
        type: CLEAR_FORM,
        payload:{}
    });
}