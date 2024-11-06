# Family Night Movie Roulette 🎬

A fun and interactive way to discover classic and modern cult films for family movie nights. This application helps parents introduce their teenagers to a curated selection of memorable cinema spanning from 1980 to present day.

## Overview

Family Night Movie Roulette is a web application that randomly selects movies from different decades, ensuring a balanced exploration of cinema history. The app keeps track of which movies have been watched, preventing repetition until all movies from a particular era have been viewed.

### Features

- 🎲 Random movie selection with entertaining slot machine animation
- 📅 Movies organized by half-decades from 1980 to 2023
- 🔄 Smart rotation system that ensures equal representation from all eras
- 🌙 Dark mode interface for that home theater feeling
- ↻ Reset option to start fresh when you've watched them all

## Movie Selection Philosophy

The curated movie list includes:
- Cultural landmarks that influenced modern cinema
- Genre-defining classics
- Creative and unique storytelling
- Films that spark discussion and appreciation for the art of cinema
- A mix of different genres and styles
- Age-appropriate content for teenage viewers

## Technical Details

### Prerequisites

- [Deno](https://deno.land/) version 1.37 or higher
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/family-night-movie-roulette.git
cd family-night-movie-roulette
```

2. Run the application:
```bash
deno run --allow-read --allow-write --allow-net src/server.ts
```

3. Open your browser and visit:
```
http://localhost:8000
```

### Project Structure
```
project/
├── src/
│   ├── movie-rotation.ts    # Core movie selection logic
│   └── server.ts           # Web server and API endpoints
├── decade_counts.json      # Tracks decade selection frequency
└── movie_counts.json      # Tracks individual movie selections
```

## How to Use

1. **Start the App**: Launch the application using the installation instructions above
2. **Select a Movie**: Click the "Spin" button to randomly select a movie
3. **Watch Together**: Enjoy the selected film with your family
4. **Track Progress**: The app automatically keeps track of watched movies
5. **Reset Anytime**: Use the reset button to start fresh if desired

## Movie List Highlights

The collection includes diverse selections from each era:

### 1980s
- The creative horror of "The Thing"
- The groundbreaking sci-fi of "Blade Runner"
- The satirical humor of "This Is Spinal Tap"

### 1990s
- The quirky charm of "The Big Lebowski"
- The mind-bending narrative of "Fight Club"
- The workplace satire of "Office Space"

### 2000s
- The psychological thriller "Donnie Darko"
- The zombie comedy "Shaun of the Dead"
- The sci-fi masterpiece "Moon"

### 2010s
- The innovative "Scott Pilgrim vs. the World"
- The artistic horror of "The Witch"
- The surreal "Sorry to Bother You"

### 2020s
- The genre-defying "Everything Everywhere All at Once"
- The medieval fantasy "The Green Knight"
- The time-loop romance "Palm Springs"

## Tips for Family Movie Night

1. **Pre-screen Movies**: While all selections are generally appropriate for teens, you may want to pre-screen certain films based on your family's preferences
2. **Discussion Time**: Set aside time after the movie for discussion and sharing thoughts
3. **Context Matters**: Consider providing historical or cultural context before watching older films
4. **Snacks are Essential**: Prepare some movie snacks to enhance the experience
5. **No Phones**: Encourage a phone-free viewing experience for better engagement

## Contributing

Feel free to suggest movies to add to the rotation or improvements to the application by opening an issue or pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Remember: The best movie experiences are shared experiences. Happy watching! 🍿

## Compilation

You can compile the application to a standalone binary for easier distribution and execution.

### Quick Compilation (Current Platform)

```bash
# Make the compilation script executable
chmod +x compile.sh

# Compile for your current platform
./compile.sh
```

### Cross-Platform Compilation

Compile for a specific platform:
```bash
./compile.sh linux    # For Linux
./compile.sh macos    # For macOS
./compile.sh windows  # For Windows
./compile.sh all      # For all platforms
```

The compiled binaries will be placed in the `build` directory with platform-specific names:
- `build/family-movie-roulette-linux`
- `build/family-movie-roulette-macos`
- `build/family-movie-roulette-windows.exe`

### Running the Compiled Binary

Linux/macOS:
```bash
./build/family-movie-roulette-linux  # For Linux
./build/family-movie-roulette-macos  # For macOS
```

Windows:
```cmd
build\family-movie-roulette-windows.exe
```

The application will start and be accessible at `http://localhost:8000`

### Notes

- The compiled binary includes all necessary dependencies
- No need to install Deno on the target machine
- Data files (`decade_counts.json` and `movie_counts.json`) will be created in the same directory as the binary