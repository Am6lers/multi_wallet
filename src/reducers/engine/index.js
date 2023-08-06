import Engine from '@core/engine';

const initialState = {
  backgroundState: {},
};

// Engine의 컨트롤러들의 state 업데이트한다.

const engineReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_BG_STATE':
      return { backgroundState: Engine.state };
    case 'UPDATE_BG_STATE': {
      const newState = { ...state };
      newState.backgroundState[action.key] = Engine.state[action.key];
      return newState;
    }
    default:
      return state;
  }
};

export default engineReducer;
