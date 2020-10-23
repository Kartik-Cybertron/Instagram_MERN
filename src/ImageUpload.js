import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from "firebase";
import { storage, db } from './firebase';
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    
    const handleChange = (e) => {           //to fetch the data from device
        if(e.target.files[0]){              //get the 1st file selected
            setImage(e.target.files[0]);    //sets the image

        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);  //download link created
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function.....
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100      //for progress bar
                );
                setProgress(progress);
            },
            (error) => {
                //Error function.....
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete funtion.....
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()                           //upload the image inside the storage 
                .then( url =>  {
                    //post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,                       //download string url in to the database 
                        username: username
                    });
                    
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    };
     
    return (
   <div className="imageUpload">
        {/* //caption input 
        //file picker 
        //post button  */}
        <progress className="imageUpload_progress" value={progress} max="100" />
        <input type="text" placeholder='Enter caption.....' onChange={event => setCaption(event.target.value)} value={caption} /> 
        <input type="file" onChange={ handleChange } />
        <Button onClick={ handleUpload }>
            Upload
        </Button>
    </div>
  )
}

export default ImageUpload