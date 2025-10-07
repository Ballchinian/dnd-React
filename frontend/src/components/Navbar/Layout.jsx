import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <div style={{ padding: "20px" }}>
                {children}
            </div>
        </>
    );
}

export default Layout;
