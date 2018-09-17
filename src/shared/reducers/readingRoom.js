import {
  ADD_CASE_TO_BASKET,
  GET_RRCUBE_SUCCESS,
  REMOVE_CASE_FROM_BASKET
} from '../actions/actionTypes';

const initialState = {
  funds: {},
  inventories: {},
  cases: {},
  basket: []
};

export default function readingRoom(state=initialState, action) {
  switch (action.type) {
    case GET_RRCUBE_SUCCESS:
      return {
        ...state,
        [action.name]: action.cube
      };
    case ADD_CASE_TO_BASKET:
      return {
        ...state,
        basket: [...state.basket, action.selectedCase]
      };
    case REMOVE_CASE_FROM_BASKET:
      return {
        ...state,
        basket: state.basket.filter(elem => elem.key !== action.selectedCase.key)
      };
    default: return state;
  }
}
