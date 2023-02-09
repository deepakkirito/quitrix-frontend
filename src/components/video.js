import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from '../styles/video.module.scss'

const baseUrl = 'https://quitrix-plot.onrender.com/video';

function Video() {

    const[url, setUrl] = useState('');

    useEffect(()=>{
        axios.get(baseUrl).then(response=>{
            if(response.data) {
                setUrl(response.data);
            }
        });
    },[]);

    return (
        <div className={classes.Video}>
            {url === '' ? <h1>No Video Available</h1> : <video width="500" autoPlay muted controls>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>}
        </div>

    );
}



export default Video;
