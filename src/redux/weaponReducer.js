const initialState = {
    loading: false,
    weapons: [],
    error: null,
  };
  
  const weaponReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_WEAPONS_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_WEAPONS_SUCCESS':
        return { ...state, loading: false, weapons: action.payload };
      case 'FETCH_WEAPONS_FAILURE':
        return { ...state, loading: false, error: action.error };
      default:
        return state;
    }
  };
  
  export default weaponReducer;