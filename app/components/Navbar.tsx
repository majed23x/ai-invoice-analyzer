import React from 'react';
import {Link} from 'react-router';
const Navbar = () => {
    return (
    <nav className="navbar">
    <Link to="/">
        <p className= "text-2xl font-bold text-gradient">INOVLYZER</p>
    </Link>
        <Link to="/upload" className= "primary-button w-fit">
            Upload Invoice
        </Link>
    </nav>
    );
};

export default Navbar;
