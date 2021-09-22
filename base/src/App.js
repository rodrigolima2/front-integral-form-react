import React, { useState } from "react";
import "./index.css";

import getSpotifyToken from "./utils/getSpotifyToken";
import Card from "./components/Card";

const baseURL = (pesquisa) =>
  `https://api.spotify.com/v1/search?q=${pesquisa}&type=track&limit=10`;

function App() {
  const [pesquisa, setPesquisa] = useState("");
  const [tracks, setTracks] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!pesquisa) return;

    setErros('');
    setCarregando(true);

    try {
      const token = await getSpotifyToken();

      const response = await fetch(baseURL(pesquisa), {
        headers: {
          Authorization: token
        }
      });

      const { tracks } = await response.json();

      setTracks(tracks.items);
    } catch (error) {
      setErros(error.message);
      setTracks([]);
    }

    setCarregando(false);
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </form>
      {carregando && <span className="loading">Carregando...</span>}
      {erros && <span className="error">{erros}</span>}
      {tracks.length === 0 && <span className="not-found">Nada encontrado</span>}
      {tracks.map((track) => (
        <Card track={track} />
      ))}
    </div>
  );
}

export default App;