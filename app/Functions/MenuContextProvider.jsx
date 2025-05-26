import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext("Home");
const MenuIsHidden = createContext(false);

export {ThemeContext, MenuIsHidden};