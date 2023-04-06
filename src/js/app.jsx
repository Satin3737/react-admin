import React from 'react';
import { createRoot } from 'react-dom/client';
import Editor from "./components/editor.jsx";
import '../scss/style.scss';

const root = createRoot(document.getElementById('root'));
root.render(<Editor/>);