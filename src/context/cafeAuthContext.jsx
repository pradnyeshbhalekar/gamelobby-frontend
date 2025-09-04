import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const CafeAuthContext = createContext();

export const CafeAuthProvider = ({ children }) => {
  const [cafe, setCafe] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/parlour/login", { email, password });
    setCafe(res.data.cafe);
    localStorage.setItem("cafeToken", res.data.token);
  };

  const logout = () => {
    setCafe(null);
    localStorage.removeItem("cafeToken");
  };

  return (
    <CafeAuthContext.Provider value={{ cafe, login, logout }}>
      {children}
    </CafeAuthContext.Provider>
  );
};

export const useCafeAuth = () => useContext(CafeAuthContext);
