import React from 'react';

export default () => (
    <svg className="upload-icon" width="86px" height="86px" viewBox="0 0 86 86" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="arrowPath">
            <path d="M41,59.1715729 L41,22 C41,20.8954305 41.8954305,20 43,20 C44.1045695,20 45,20.8954305 45,22 L45,59.1715729 L56.5857864,47.5857864 C57.366835,46.8047379 58.633165,46.8047379 59.4142136,47.5857864 C60.1952621,48.366835 60.1952621,49.633165 59.4142136,50.4142136 L44.4142136,65.4142136 C44.0522847,65.7761424 43.5522847,66 43,66 C42.4477153,66 41.9477153,65.7761424 41.5857864,65.4142136 L26.5857864,50.4142136 C25.8047379,49.633165 25.8047379,48.366835 26.5857864,47.5857864 C27.366835,46.8047379 28.633165,46.8047379 29.4142136,47.5857864 L41,59.1715729 Z" />
        </clipPath>
        <circle stroke="#DDDDDD" strokeWidth="4" fill="none" cx="43" cy="43" r="40" />
        <circle className="load-ring"
            stroke="#1E88E5"
            strokeWidth="4"
            fill="none"
            cx="43" cy="43" r="40"
            strokeDasharray="251 251"
            strokeDashoffset="-251" />
        <g clipPath="url(#arrowPath)">
            <rect x="23" y="19" width="40" height="48" fill="#9B9B9B" />
            <rect className="load-colour" x="23" y="-29" width="40" height="48" fill="#1E88E5" />
        </g>
    </svg>
);
