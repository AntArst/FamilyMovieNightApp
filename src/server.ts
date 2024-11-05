import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { MovieRotation } from "./movie-rotation.ts";
import { moviesByBlock } from "./movie-rotation.ts";

const app = new Application();
const router = new Router();
const movieRotation = new MovieRotation();

// CORS middleware
app.use(oakCors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Logging middleware
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

// API Routes
router
  .get("/", async (ctx) => {
    ctx.response.type = "text/html";
    ctx.response.body = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tedesco Family Movie Roulette</title>
          <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
          <style>
            /* Base styles */
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background-color: #111827;
              color: #fff;
            }
            
            /* Utility classes */
            .container { max-width: 28rem; margin: 0 auto; padding: 1rem; }
            .text-center { text-align: center; }
            .mb-4 { margin-bottom: 1rem; }
            .space-x-4 > * + * { margin-left: 1rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .min-h-screen { min-height: 100vh; }
            
            /* Card styles */
            .card {
              background-color: #1F2937;
              border-radius: 0.5rem;
              padding: 1.5rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #374151;
            }
            
            /* Button styles */
            .btn {
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            
            .btn-primary {
              background-color: #2563EB;
              color: white;
              border: none;
            }
            
            .btn-primary:hover {
              background-color: #1D4ED8;
            }
            
            .btn-outline {
              background-color: transparent;
              border: 1px solid #4B5563;
              color: #E5E7EB;
            }
            
            .btn-outline:hover {
              background-color: #374151;
            }
            
            .btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            
            /* Movie display */
            .movie-display {
              background-color: #111827;
              border: 1px solid #374151;
              border-radius: 0.5rem;
              padding: 1.5rem;
              min-height: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            
            .movie-title {
              font-size: 1.25rem;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            
            .decade {
              color: #9CA3AF;
              font-size: 0.875rem;
            }
            
            .placeholder {
              color: #6B7280;
              font-style: italic;
            }
            
            .error {
              color: #EF4444;
              font-size: 0.875rem;
              text-align: center;
              margin-top: 0.5rem;
            }
            
            /* Animation */
            @keyframes bounce {
              0%, 100% { transform: translateY(-10%); }
              50% { transform: translateY(0); }
            }
            
            .animate-bounce {
              animation: bounce 1s infinite;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            const SPIN_DURATION = 3000;
            const SPIN_ITEMS = 20;

            function MovieRotation() {
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
                  { className: 'min-h-screen flex items-center justify-center' },
                  React.createElement(
                    'div',
                    { className: 'card' },
                    'Loading movie data...'
                  )
                );
              }

              return React.createElement(
                'div',
                { className: 'min-h-screen flex items-center justify-center' },
                React.createElement(
                  'div',
                  { className: 'container' },
                  React.createElement(
                    'div',
                    { className: 'card' },
                    React.createElement(
                      'h1',
                      { className: 'text-center mb-4' },
                      'Tedesco Family Movie Roulette'
                    ),
                    React.createElement(
                      'div',
                      { className: 'movie-display mb-4' },
                      isSpinning
                        ? React.createElement(
                            'div',
                            { className: 'animate-bounce' },
                            React.createElement(
                              'div',
                              { className: 'movie-title' },
                              spinningMovies[spinningMovies.length - 1]?.movie
                            ),
                            React.createElement(
                              'div',
                              { className: 'decade' },
                              spinningMovies[spinningMovies.length - 1]?.decade
                            )
                          )
                        : selectedMovie
                          ? React.createElement(
                              'div',
                              null,
                              React.createElement(
                                'div',
                                { className: 'movie-title' },
                                selectedMovie
                              ),
                              React.createElement(
                                'div',
                                { className: 'decade' },
                                selectedDecade
                              )
                            )
                          : React.createElement(
                              'div',
                              { className: 'placeholder' },
                              'Press spin to select a movie'
                            )
                    ),
                    error && React.createElement(
                      'div',
                      { className: 'error mb-4' },
                      error
                    ),
                    React.createElement(
                      'div',
                      { className: 'flex justify-center space-x-4' },
                      React.createElement(
                        'button',
                        {
                          onClick: handleSpin,
                          disabled: isSpinning,
                          className: 'btn btn-primary',
                        },
                        'Spin'
                      ),
                      React.createElement(
                        'button',
                        {
                          onClick: handleReset,
                          disabled: isSpinning,
                          className: 'btn btn-outline',
                        },
                        'Reset'
                      )
                    )
                  )
                )
              );
            }

            ReactDOM.render(
              React.createElement(MovieRotation),
              document.getElementById('root')
            );
          </script>
        </body>
      </html>
    `;
  })
  .post("/api/getNextMovie", async (ctx) => {
    try {
      const result = await movieRotation.getNextMovie();
      ctx.response.body = result;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
    }
  })
  .post("/api/reset", async (ctx) => {
    try {
      try {
        await Deno.remove("decade_counts.json");
        await Deno.remove("movie_counts.json");
      } catch {
        // Ignore errors if files don't exist
      }
      await movieRotation.initializeCounts();
      ctx.response.body = { success: true };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
    }
  })
  .get("/api/movies", (ctx) => {
    ctx.response.body = moviesByBlock;
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });