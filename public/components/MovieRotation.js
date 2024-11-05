const SPIN_DURATION = 3000;
const SPIN_ITEMS = 20;

const Button = ({ children, onClick, disabled, className }) => {
  return React.createElement(
    'button',
    {
      onClick,
      disabled,
      className: `px-4 py-2 rounded-md ${className}`,
    },
    children
  );
};

const Card = ({ children, className }) => {
  return React.createElement(
    'div',
    {
      className: `bg-gray-800 rounded-lg shadow-xl ${className}`,
    },
    children
  );
};

export const MovieRotation = () => {
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [selectedDecade, setSelectedDecade] = React.useState(null);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [spinningMovies, setSpinningMovies] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [movieData, setMovieData] = React.useState({});

  React.useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => setMovieData(data))
      .catch(() => setError('Failed to load movie data'));
  }, []);

  const generateSpinningMovies = () => {
    const decades = Object.keys(movieData);
    if (decades.length === 0) return [];

    const movies = [];
    for (let i = 0; i < SPIN_ITEMS; i++) {
      const randomDecade = decades[Math.floor(Math.random() * decades.length)];
      const moviesInDecade = movieData[randomDecade];
      const randomMovie = moviesInDecade[Math.floor(Math.random() * moviesInDecade.length)];
      movies.push({ movie: randomMovie, decade: randomDecade });
    }
    return movies;
  };

  const handleSpin = async () => {
    try {
      setError(null);
      setIsSpinning(true);
      
      const spinInterval = setInterval(() => {
        setSpinningMovies(generateSpinningMovies());
      }, 100);

      const response = await fetch('/api/getNextMovie', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to get next movie');
      }

      const result = await response.json();

      setTimeout(() => {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setSelectedMovie(result.movie);
        setSelectedDecade(result.decade);
      }, SPIN_DURATION);

    } catch (err) {
      setError(err.message);
      setIsSpinning(false);
    }
  };

  const handleReset = async () => {
    try {
      setError(null);
      const response = await fetch('/api/reset', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset movies');
      }

      setSelectedMovie(null);
      setSelectedDecade(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (Object.keys(movieData).length === 0) {
    return React.createElement(
      'div',
      { className: 'min-h-screen bg-gray-900 flex items-center justify-center' },
      React.createElement(
        Card,
        { className: 'p-6' },
        React.createElement('div', { className: 'text-gray-100' }, 'Loading movie data...')
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-900 py-12 px-4' },
    React.createElement(
      'div',
      { className: 'max-w-md mx-auto' },
      React.createElement(
        Card,
        { className: 'border border-gray-700' },
        React.createElement(
          'div',
          { className: 'p-6' },
          React.createElement(
            'h1',
            { className: 'text-2xl font-bold text-center text-gray-100 mb-6' },
            'Tedesco Family Movie Roulette'
          ),
          React.createElement(
            'div',
            { className: 'bg-gray-900 rounded-lg p-6 min-h-[200px] flex items-center justify-center border border-gray-700 mb-6' },
            isSpinning
              ? React.createElement(
                  'div',
                  { className: 'space-y-2 animate-bounce text-center' },
                  React.createElement('div', { className: 'text-gray-100' }, spinningMovies[spinningMovies.length - 1]?.movie),
                  React.createElement('div', { className: 'text-sm text-gray-400' }, spinningMovies[spinningMovies.length - 1]?.decade)
                )
              : selectedMovie
                ? React.createElement(
                    'div',
                    { className: 'text-center' },
                    React.createElement('div', { className: 'text-xl font-semibold mb-2 text-gray-100' }, selectedMovie),
                    React.createElement('div', { className: 'text-gray-400' }, selectedDecade)
                  )
                : React.createElement('div', { className: 'text-gray-500 italic' }, 'Press spin to select a movie')
          ),
          error && React.createElement('div', { className: 'text-red-400 text-center text-sm mb-6' }, error),
          React.createElement(
            'div',
            { className: 'flex justify-center space-x-4' },
            React.createElement(
              Button,
              {
                onClick: handleSpin,
                disabled: isSpinning,
                className: 'bg-blue-600 hover:bg-blue-700 text-white',
              },
              'Spin'
            ),
            React.createElement(
              Button,
              {
                onClick: handleReset,
                disabled: isSpinning,
                className: 'border border-gray-600 text-gray-300 hover:bg-gray-700',
              },
              'Reset'
            )
          )
        )
      )
    )
  );
};