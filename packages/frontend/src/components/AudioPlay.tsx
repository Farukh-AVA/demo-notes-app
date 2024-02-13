import  { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './AudioPlayer.css';



export default function AudioPlayers({ base64Audio} : { base64Audio: string | null }){
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to convert base64 to audio URL
  useEffect(() => {
    if (base64Audio) {
      // Convert base64 to binary data
      const binaryData = atob(base64Audio);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      // Create Blob from binary data
      const blob = new Blob([byteArray.buffer], { type: 'audio/mpeg' });

      // Create URL object representing the Blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  }, [base64Audio]);
   
    const togglePlay = () => {
      setIsPlaying(!isPlaying);
    };

  return (
    <div className='audioPlayer'>
      {base64Audio && (
      <ReactPlayer
        url={audioUrl}
        controls
        playing={isPlaying}
        width="100%"
        height="50px"
        config={{ file: { forceAudio: true } }}
        onPlay={togglePlay}
        onPause={togglePlay}
      />
      )}
    </div>
  )
}


