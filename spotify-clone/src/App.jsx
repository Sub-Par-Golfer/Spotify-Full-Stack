import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      {songsData.length > 0 ? (
        <>
          {/* Main Content */}
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>

          {/* Player Component */}
          <Player />
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          <p>Loading songs...</p>
        </div>
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={track?.file || ""}
        preload="auto"
      />
    </div>
  );
};

export default App;