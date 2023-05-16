import { useState, useEffect, useRef } from "react";
import "./App.css";
import { AiFillStar } from "react-icons/ai";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const key = "8fc5ca8b";
  const dropdownRef = useRef(null);

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
    if (search === "") {
      setSelectedMovie(null);
    }
  }, [search]);

  useEffect(() => {
    fetch(`http://www.omdbapi.com/?t=A Clockwork Orange&apikey=${key}`)
      .then((response) => response.json())
      .then((data) => setSelectedMovie(data));
  }, []);

  useEffect(() => {
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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex >= movies.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex === null || prevIndex <= 0 ? movies.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter" && highlightedIndex !== null) {
      e.preventDefault();
      setSelectedMovie(movies[highlightedIndex]);
      setMovies([]);
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    setHighlightedIndex(null);
  };

  const handleSelectMovie = (movie) => {
    fetch(`http://www.omdbapi.com/?t=${movie.Title}&apikey=${key}`)
      .then((response) => response.json())
      .then((data) => setSelectedMovie(data));
    setMovies([]);
  };

  return (
    <>
      <div className="mt-12 md:mt-32 flex justify-center items-center flex-col">
        <h1 className="text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl text-center text-white ">
          Movie Guide
        </h1>
        <p className="text-xs md:text-sm w-64 md:w-80 sm:text-xl sm:w-[31.25rem] lg:text-2xl lg:w-[56.25rem] 2xl:text-3xl 2xl:w-[62.5rem] mt-1.5 text-center text-white">
          Search for your favorite movies and get detailed information about
          them.
        </p>
      </div>
      <div class="mt-12 text-base w-full sm:w-3/4 lg:w-1/2 xl:w-1/3 p-12 bg-[#1e293b] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md shadow-lg">
        <div className="relative">
          <input
            className="w-full text-sm outline-none rounded-sm bg-transparent border border-gray-400 text-white px-2 py-2 focus:border-white"
            type="text"
            placeholder="Enter movie name here..."
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          {movies.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 w-full bg-white text-black rounded-md shadow-lg z-10"
            >
              {movies.map((movie, index) => (
                <div
                  key={movie.imdbID}
                  onClick={() => handleSelectMovie(movie)}
                  className={`px-3 py-2 cursor-pointer ${
                    highlightedIndex === index ? "bg-blue-200" : ""
                  }`}
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
              <div className="relative flex flex-col md:flex-row gap-4 mt-4">
                <img src={selectedMovie.Poster} className="w-48 md:w-60" />
                <div>
                  <h2 className="text-center text-xl md:text-2xl font-semibold tracking-wide text-white">
                    {selectedMovie.Title}
                  </h2>

                  <div className="flex items-center justify-center gap-1.5 mx-auto mt-2 mb-3">
                    <AiFillStar className="text-yellow-500 w-8 h-8" />
                    <h4 className="inline-block text-xl font-medium text-white">
                      {selectedMovie.imdbRating}
                    </h4>
                  </div>

                  <div className="flex justify-center gap-4 text-customGray mt-2 mb-2 font-light text-lg">
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
                            className="border border-gray-400 text-xs m-2 px-6 py-1 rounded font-light text-white"
                          >
                            {genre.trim()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="font-medium mt-3 text-white">Plot :</h3>
                  <p className="text-base	font-light leading-relaxed text-justify text-gray-400">
                    {selectedMovie.Plot}
                  </p>
                  <h3 className="font-medium mt-3 text-white">Cast :</h3>
                  <p className="text-base	font-light leading-relaxed text-justify text-gray-400">
                    {selectedMovie.Actors}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
