import React, { useContext } from 'react';
import Navbar from './Navbar';
import AlbumItem from './AlbumItem';
import SongItem from './SongItem';
import { PlayerContext } from '../context/PlayerContext'; // Ensure correct import

const DisplayHome = () => {
  const { songsData, albumsData, playWithId } = useContext(PlayerContext);

  // Safeguard: Ensure data exists before mapping
  if (!songsData || !albumsData) {
    console.error('PlayerContext data is not available.');
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl text-white">Featured Charts</h1>
        <div className="flex overflow-auto">
          {albumsData.length > 0 ? (
            albumsData.map((item, index) => (
              <AlbumItem
                key={item._id || index}
                name={item.name}
                desc={item.desc}
                id={item._id}
                image={item.image}
              />
            ))
          ) : (
            <p className="text-white">No albums available.</p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl text-white">Today's Biggest Hits</h1>
        <div className="flex overflow-auto">
          {songsData.length > 0 ? (
            songsData.map((item, index) => (
              <SongItem
                onClick={() => playWithId(song._id)} // Play song automatically on click
                key={item._id || index}
                name={item.name}
                desc={item.desc}
                id={item._id}
                image={item.image}
              />
            ))
          ) : (
            <p className="text-white">No songs available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;