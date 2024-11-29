export const fetchWeapons = () => async dispatch => {
    dispatch({ type: 'FETCH_WEAPONS_REQUEST' });
    try {
      const response = await fetch('https://mhw-db.com/weapons');
      const data = await response.json();
      dispatch({ type: 'FETCH_WEAPONS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_WEAPONS_FAILURE', error });
    }
  };