import { GET_USERINFO } from '../Actions/actions-types';

const initialState = {
  userData: null,
  // Otros campos de user si los hay
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERINFO:
      return {
        ...state,
        userData: action.payload.userData,
      };
    default:
      return state;
  }
};

export default userReducer;
