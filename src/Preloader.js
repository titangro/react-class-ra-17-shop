import React from 'react';

const Peloader = ({hidden}) => 
    <div className={`preloader_wrapper ${hidden ? 'hidden' : ''}`}>
        <div className="preloader">
            <hr /><hr /><hr /><hr />
        </div>
    </div>

export default Peloader;