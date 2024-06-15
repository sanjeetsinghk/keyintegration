const initialState = {
    sidebarShow: true,
    theme: 'light',
  }
  
  export default function(state = initialState, { type, ...rest }){
    switch (type) {
      case 'set':
        return { ...state, ...rest }
      default:
        return state
    }
  }