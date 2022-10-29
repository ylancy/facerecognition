import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
    return (
        <div className='center' style={{ position: 'relative', width: '800px' }}>
            <img id='inputimage' alt='' src={imageUrl} width='800px' height='auto' />
            {boxes.map((box) => <div className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>)}

        </div>
    )
}

export default FaceRecognition;