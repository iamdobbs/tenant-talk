import React, { useEffect, createContext, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

const login = ({ user, token }) => {
  window.localStorage.setItem("token", token);
  return { user, token };
};

const refresh = ({ user }, { token }) => {
  window.localStorage.setItem("token", token);
  return { user, token };
};

const logout = () => {
  window.localStorage.removeItem("token");
  return { user: null, token: null };
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return login(action.payload);
    case "refresh":
      return refresh(state, action.payload);
    case "logout":
      return logout();
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: window.localStorage.getItem("token"),
  });

  const getUser = async (token) => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URI + "/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: "login",
        payload: data,
      });
    } catch {
      dispatch({ type: "logout" });
      toast.error("Please login again");
    }
  };

  // get user and new token with stored token on every refresh or new window
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      getUser(token);
    }
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
