import React from 'react';
import { signOutUser } from '../../utili/firebase';

const Navigation = ({ onRouteChange, signedIn, resetState }) => {

    const signOutHandler = () => {
        onRouteChange('signin');
        resetState();
        signOutUser();
    }

    if (signedIn) {
        return (<nav style={{ display: 'flex', justifyContent: 'flex-end', }}>
            <p onClick={signOutHandler} className='f3 link dim black underline pa3 pointer'>Sign  Out</p>
        </nav>)
    } else {
        return (<nav style={{ display: 'flex', justifyContent: 'flex-end', }}>
            <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign  In</p>
            <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
        </nav>)
    }

}

export default Navigation;