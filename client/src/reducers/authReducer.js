import {FETCH_USER} from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      //If user does not login, return false
      return action.payload || false;
    default:
      return state;
  }
}
