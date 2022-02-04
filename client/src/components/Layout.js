import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from "./Header";

const Layout = () => {
    return (
        <Router>
            {}
            <Routes>
                <Route exact path="/" element={<h1>home</h1>} />
                <Route path="/test" element={<h1>test</h1>} />
            </Routes>
        </Router>
    );
};

export default Layout;