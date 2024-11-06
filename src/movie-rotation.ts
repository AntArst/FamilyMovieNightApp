export type MovieBlock = {
  [key: string]: string[];
};

type CountRecord = {
  [key: string]: number;
};

type MovieSelection = {
  movie: string;
  decade: string;
};

export const moviesByBlock: MovieBlock = {
  "Pre-1980": [
    "Paper Moon (1973)",
    "The Deer Hunter (1978)",
    "The Gods Must Be Crazy (1980)"
  ],
  "1980-1984": [
    "The Shining (1980)",
    "Blade Runner (1982)",
    "The Thing (1982)",
    "Videodrome (1983)",
    "This Is Spinal Tap (1984)",
    "The NeverEnding Story (1984)"
  ],
  "1985-1989": [
    "Brazil (1985)",
    "St. Elmo's Fire (1985)",
    "Mr. Holland's Opus (1985)",
    "The Color Purple (1985)",
    "Big Trouble in Little China (1986)",
    "Evil Dead II (1987)",
    "Withnail & I (1987)",
    "Heathers (1988)"
  ],
  "1990-1994": [
    "Twin Peaks: Fire Walk with Me (1992)",
    "Army of Darkness (1992)",
    "The Nightmare Before Christmas (1993)",
    "Dazed and Confused (1993)",
    "Clerks (1994)"
  ],
  "1995-1999": [
    "12 Monkeys (1995)",
    "Powder (1995)",
    "Red Rock West (1996)",
    "The Big Lebowski (1998)",
    "Fight Club (1999)",
    "Office Space (1999)",
    "Pi (1998)",
    "The Boondock Saints (1999)"
  ],
  "2000-2004": [
    "Donnie Darko (2001)",
    "Oldboy (2003)",
    "Battle Royale (2000)",
    "Shaun of the Dead (2004)",
    "Napoleon Dynamite (2004)"
  ],
  "2005-2009": [
    "Pan's Labyrinth (2006)",
    "Hot Fuzz (2007)",
    "The Fountain (2006)",
    "The Men Who Stare at Goats (2009)",
    "Moon (2009)",
    "District 9 (2009)"
  ],
  "2010-2014": [
    "Scott Pilgrim vs. the World (2010)",
    "Drive (2011)",
    "Attack the Block (2011)",
    "The Raid: Redemption (2011)",
    "Under the Skin (2013)"
  ],
  "2015-2019": [
    "The Witch (2015)",
    "Mad Max: Fury Road (2015)",
    "Annihilation (2018)",
    "Sorry to Bother You (2018)",
    "Midsommar (2019)"
  ],
  "2020-2023": [
    "Everything Everywhere All at Once (2022)",
    "The Green Knight (2021)",
    "Palm Springs (2020)",
    "Possessor (2020)",
    "Barbarian (2022)"
  ]
};

export class MovieRotation {
  private decadeCountsFile = "decade_counts.json";
  private movieCountsFile = "movie_counts.json";
  private decadeCounts: CountRecord = {};
  private movieCounts: CountRecord = {};

  constructor() {
    this.initializeCounts();
  }

  public async initializeCounts() {
    try {
      const decadeCountsText = await Deno.readTextFile(this.decadeCountsFile);
      this.decadeCounts = JSON.parse(decadeCountsText);
    } catch {
      // Initialize decade counts if file doesn't exist
      this.decadeCounts = Object.keys(moviesByBlock).reduce((acc, decade) => {
        acc[decade] = 0;
        return acc;
      }, {} as CountRecord);
      await this.saveDecadeCounts();
    }

    try {
      const movieCountsText = await Deno.readTextFile(this.movieCountsFile);
      this.movieCounts = JSON.parse(movieCountsText);
    } catch {
      // Initialize movie counts if file doesn't exist
      this.movieCounts = Object.entries(moviesByBlock).reduce((acc, [_, movies]) => {
        movies.forEach(movie => {
          acc[movie] = 0;
        });
        return acc;
      }, {} as CountRecord);
      await this.saveMovieCounts();
    }
  }

  private async saveDecadeCounts() {
    await Deno.writeTextFile(this.decadeCountsFile, JSON.stringify(this.decadeCounts, null, 2));
  }

  private async saveMovieCounts() {
    await Deno.writeTextFile(this.movieCountsFile, JSON.stringify(this.movieCounts, null, 2));
  }

  private getLeastUsedDecades(): string[] {
    const minCount = Math.min(...Object.values(this.decadeCounts));
    return Object.entries(this.decadeCounts)
      .filter(([_, count]) => count === minCount)
      .map(([decade]) => decade);
  }

  private getLeastUsedMovies(decade: string): string[] {
    if (!(decade in moviesByBlock)) {
      throw new Error(`Invalid decade: ${decade}`);
    }

    const moviesInDecade = moviesByBlock[decade];
    if (!Array.isArray(moviesInDecade) || moviesInDecade.length === 0) {
      throw new Error(`No movies found for decade: ${decade}`);
    }

    const movieCounts = moviesInDecade.map(movie => ({
      movie,
      count: this.movieCounts[movie] || 0
    }));

    const minCount = Math.min(...movieCounts.map(m => m.count));

    return movieCounts
      .filter(m => m.count === minCount)
      .map(m => m.movie);
  }

  private getRandomItem<T>(array: T[]): T {
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error("Cannot select from empty or invalid array");
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  public async getNextMovie(): Promise<MovieSelection> {
    if (Object.keys(this.decadeCounts).length === 0 || Object.keys(this.movieCounts).length === 0) {
      await this.initializeCounts();
    }

    const leastUsedDecades = this.getLeastUsedDecades();
    if (leastUsedDecades.length === 0) {
      throw new Error("No decades available");
    }

    const selectedDecade = this.getRandomItem(leastUsedDecades);
    const leastUsedMovies = this.getLeastUsedMovies(selectedDecade);
    const selectedMovie = this.getRandomItem(leastUsedMovies);

    // Update counts
    this.decadeCounts[selectedDecade]++;
    this.movieCounts[selectedMovie]++;

    // Save updated counts
    await this.saveDecadeCounts();
    await this.saveMovieCounts();

    return {
      movie: selectedMovie,
      decade: selectedDecade
    };
  }

  public getMovieCounts(): CountRecord {
    return { ...this.movieCounts };
  }

  public getDecadeCounts(): CountRecord {
    return { ...this.decadeCounts };
  }
}