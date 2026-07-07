function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestion(question, correctAnswer, decoys) {
  const options = shuffle([correctAnswer, ...decoys]);
  return { question, correctAnswer, options };
}

export function generateTrivia(movie) {
  const questions = [];

  if (movie.year) {
    const yearNum = Number(movie.year);
    const decoyYears = shuffle([yearNum - 2, yearNum - 1, yearNum + 1, yearNum + 3])
      .slice(0, 3)
      .map(String);
    questions.push(buildQuestion(`What year was "${movie.title}" released?`, movie.year, decoyYears));
  }

  if (movie.director) {
    const decoyDirectors = shuffle((movie.cast || []).map((c) => c.name))
      .filter((name) => name !== movie.director)
      .slice(0, 3);
    if (decoyDirectors.length === 3) {
      questions.push(buildQuestion(`Who directed "${movie.title}"?`, movie.director, decoyDirectors));
    }
  }

  if (movie.genres && movie.genres.length > 0) {
    const allGenres = [
      'Action', 'Comedy', 'Drama', 'Horror', 'Romance',
      'Thriller', 'Animation', 'Fantasy', 'Documentary', 'Mystery',
    ];
    const correctGenre = movie.genres[0];
    const decoyGenres = shuffle(allGenres.filter((g) => !movie.genres.includes(g))).slice(0, 3);
    questions.push(buildQuestion(`Which genre applies to "${movie.title}"?`, correctGenre, decoyGenres));
  }

  if (movie.cast && movie.cast.length >= 4) {
    const correctActor = movie.cast[0].name;
    const decoyActors = movie.cast.slice(1, 4).map((c) => c.name);
    questions.push(buildQuestion(`Who starred in "${movie.title}"?`, correctActor, decoyActors));
  }

  return questions;
}
