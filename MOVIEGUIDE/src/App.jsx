import { useState, useEffect, useRef } from "react";
import "./App.css";
import { AiFillStar } from "react-icons/ai";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const key = "8fc5ca8b";
  const dropdownRef = useRef(null); // Ajouter cette ligne

  useEffect(() => {
    if (search) {
      fetch(`http://www.omdbapi.com/?s=${search}&apikey=${key}`)
        .then((response) => response.json())
        .then((data) => setMovies(data.Search || []));
    } else {
      setMovies([]);
    }
  }, [search]);

  useEffect(() => {
    // Ajouter ce hook useEffect
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMovies([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setMovies([]);
  };

  return (
    <div>
      <div class="text-base w-full max-w-[37.5em] p-12 bg-[#1e293b] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md shadow-lg">
        <div className="relative">
          <input
            className="w-full text-sm outline-none rounded-sm bg-transparent border border-gray-400 text-white px-2 py-2 focus:border-white"
            type="text"
            placeholder="Enter movie name here..."
            value={search}
            onChange={handleChange}
          />
          {movies.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 w-full bg-white text-black rounded-md shadow-lg z-10"
            >
              {movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  onClick={() => handleSelectMovie(movie)}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {movie.Title}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="">
          {selectedMovie && (
            <div>
              <div className="relative flex gap-4 mt-4">
                <img src={selectedMovie.Poster} className="w-72" />

                <div>
                  <h2 className="text-center text-xl font-semibold tracking-wide">
                    {selectedMovie.Title}
                  </h2>

                  <div className="flex items-center justify-center gap-1.5 mx-auto mt-2 mb-3">
                    <AiFillStar className="text-yellow-500 w-3" />
                    <h4 className="inline-block text-lg font-medium">
                      {selectedMovie.imdbRating}
                    </h4>
                  </div>

                  <div className="flex justify-center gap-4 text-customGray mt-2 mb-2 font-light">
                    <span>{selectedMovie.Rated}</span>
                    <span>{selectedMovie.Year}</span>
                    <span>{selectedMovie.Runtime}</span>
                  </div>

                  <div className="flex justify-around">
                    {selectedMovie && selectedMovie.Genre && (
                      <div className="flex justify-around">
                        {selectedMovie.Genre.split(",").map((genre, index) => (
                          <div
                            key={index}
                            className="border border-gray-400 text-xs px-6 py-1 rounded font-light"
                          >
                            {genre.trim()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium mt-3">Plot :</h3>
                  <p className="text-sm font-light leading-relaxed text-justify text-gray-400">
                  {selectedMovie.Plot}
                  </p>
                  <h3 className="font-medium mt-3">Cast :</h3>
                  <p className="text-sm font-light leading-relaxed text-justify text-gray-400">
                  {selectedMovie.Actors}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
