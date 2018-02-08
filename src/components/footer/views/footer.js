import React from 'react';

const Footer = () => {
    const footerStyle = {
        clear: "both",
        width: "100%",
        borderTop: "1px solid #dddcdc",
        padding: "40px 0 60px"
    };
    const copyStyle = {
        fontSize: "1rem",
        textAlign: "center",
        color: "#a1a1a1"
    };

    return (
        <footer style={footerStyle}>
            <div style={copyStyle}>CopyRight &copy; 2018 xiongwei</div>
        </footer>
    );
};

export default Footer;