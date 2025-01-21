import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
    const audioRef = useRef(null);
    const seekBg = useRef(null);
    const seekBar = useRef(null);

    const url = 'https://spotify-full-stack-bznu.onrender.com/';

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 },
    });

    // Fetch Songs Data
    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            if (response.data.success) {
                const songs = response.data.songs;
                setSongsData(songs);
                if (!track) setTrack(songs[0]); // Set the first song as the default track without playing
            }
        } catch (error) {
            console.error('Error fetching songs data:', error);
        }
    };

    // Fetch Albums Data
    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            if (response.data.success) {
                setAlbumsData(response.data.album);
            }
        } catch (error) {
            console.error('Error fetching albums data:', error);
        }
    };

    // Play Track
    const play = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setPlayStatus(true))
                .catch((err) => console.error('Error playing audio:', err));
        } else {
            console.error('audioRef is null');
        }
    };

    // Pause Track
    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        } else {
            console.error('audioRef is null');
        }
    };

    // Play Track by ID
    const playWithId = async (id) => {
        const selectedTrack = songsData.find((item) => item._id === id); // Find the track by ID
        if (selectedTrack) {
            setTrack(selectedTrack); // Set the track
            try {
                await audioRef.current.play(); // Play the audio
                setPlayStatus(true); // Update play status
            } catch (error) {
                console.error("Error playing track:", error);
            }
        } else {
            console.error("Track not found with ID:", id);
        }
    };
   

    // Play Next Track
const next = () => {
    const currentIndex = songsData.findIndex((song) => song === track);
    if (currentIndex < songsData.length - 1) {
        const nextTrack = songsData[currentIndex + 1];
        setTrack(nextTrack); // Update the track
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch((err) =>
                    console.error('Error playing audio on next:', err)
                );
            }
        }, 100); // Small delay to ensure `track` is updated before play
    }
};

// Play Previous Track
const previous = () => {
    const currentIndex = songsData.findIndex((song) => song === track);
    if (currentIndex > 0) {
        const prevTrack = songsData[currentIndex - 1];
        setTrack(prevTrack); // Update the track
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch((err) =>
                    console.error('Error playing audio on previous:', err)
                );
            }
        }, 100); // Small delay to ensure `track` is updated before play
    }
};

    // Seek Song
    const seekSong = (event) => {
        if (audioRef.current && seekBg.current) {
            const newTime = (event.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        } else {
            console.error('audioRef or seekBg is null');
        }
    };

    // Setup Time Update Listener for Audio
    useEffect(() => {
        if (audioRef.current) {
            const updateTime = () => {
                const current = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                if (seekBar.current) {
                    seekBar.current.style.width = `${(current / duration) * 100}%`;
                }

                setTime({
                    currentTime: {
                        second: Math.floor(current % 60),
                        minute: Math.floor(current / 60),
                    },
                    totalTime: {
                        second: Math.floor(duration % 60),
                        minute: Math.floor(duration / 60),
                    },
                });
            };

            audioRef.current.ontimeupdate = updateTime;

            return () => {
                if (audioRef.current) {
                    audioRef.current.ontimeupdate = null;
                }
            };
        }
    }, [audioRef, seekBar]);

    // Fetch Data on Component Mount
    useEffect(() => {
        getSongsData();
        getAlbumsData();
    }, []);

    // Context value to be shared
    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track,
        playStatus,
        time,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
        songsData,
        albumsData,
    };

    return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
