import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../pics/unity5.png';

export const Header = ({ user }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen(!open);
    };

    const listClassName = open ? 'active' : '';

    return (
        <nav className="navbar">
            <span className="navbar-toggle" id="js-navbar-toggle">
                <i onClick={toggleOpen} className="fas fa-bars" />
            </span>
            <Link to="/">
                <img src={logo} className="logo" alt="Unity logo small" />
            </Link>
            <ul onClick={toggleOpen} className={`main-nav ${listClassName}`}>
                <li>
                    <Link className="nav-link" to="/">
                        Massage
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/mypage">
                        {user.name}
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/info">
                        Info
                    </Link>
                </li>
                <li>
                    <Link className="nav-link" to="/stretching">
                        Stretching
                    </Link>
                </li>
                {user.admin && (
                    <>
                        <li>
                            <Link className="nav-link" to="/dashboard">
                                Admin dashboard
                            </Link>
                        </li>

                        <li>
                            <Link className="nav-link" to="/stats">
                                Statistics
                            </Link>
                        </li>
                    </>
                )}
                <li>
                    <i
                        onClick={() => (window.location.href = '/auth/logout')}
                        id="logout"
                        className="fas fa-sign-out-alt"
                    />
                </li>
            </ul>
        </nav>
    );
};
