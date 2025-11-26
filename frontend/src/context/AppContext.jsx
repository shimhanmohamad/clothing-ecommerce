import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // UI state
  sidebarOpen: false,
  mobileMenuOpen: false,
  loading: false,
  
  // App preferences
  theme: 'light',
  currency: 'USD',
  language: 'en',
  
  // Notifications
  notifications: [],
  
  // Search state
  searchQuery: '',
  searchResults: [],
  
  // Modal states
  activeModal: null,
  modalProps: {}
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  SET_THEME: 'SET_THEME',
  SET_CURRENCY: 'SET_CURRENCY',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case ACTION_TYPES.TOGGLE_MOBILE_MENU:
      return {
        ...state,
        mobileMenuOpen: !state.mobileMenuOpen
      };
      
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case ACTION_TYPES.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload
      };
      
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
      
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case ACTION_TYPES.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case ACTION_TYPES.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };
      
    case ACTION_TYPES.OPEN_MODAL:
      return {
        ...state,
        activeModal: action.payload.modalType,
        modalProps: action.payload.modalProps || {}
      };
      
    case ACTION_TYPES.CLOSE_MODAL:
      return {
        ...state,
        activeModal: null,
        modalProps: {}
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => 
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    
    toggleSidebar: () => 
      dispatch({ type: ACTION_TYPES.TOGGLE_SIDEBAR }),
    
    toggleMobileMenu: () => 
      dispatch({ type: ACTION_TYPES.TOGGLE_MOBILE_MENU }),
    
    setTheme: (theme) => 
      dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),
    
    setCurrency: (currency) => 
      dispatch({ type: ACTION_TYPES.SET_CURRENCY, payload: currency }),
    
    addNotification: (notification) => 
      dispatch({ 
        type: ACTION_TYPES.ADD_NOTIFICATION, 
        payload: { ...notification, id: Date.now() }
      }),
    
    removeNotification: (id) => 
      dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id }),
    
    setSearchQuery: (query) => 
      dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query }),
    
    setSearchResults: (results) => 
      dispatch({ type: ACTION_TYPES.SET_SEARCH_RESULTS, payload: results }),
    
    openModal: (modalType, modalProps = {}) => 
      dispatch({ type: ACTION_TYPES.OPEN_MODAL, payload: { modalType, modalProps } }),
    
    closeModal: () => 
      dispatch({ type: ACTION_TYPES.CLOSE_MODAL })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;