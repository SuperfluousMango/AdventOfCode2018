const initialRecipeScores = '37';

console.log(`Puzzle A solution: ${puzzleA()}`);
console.log(`Puzzle B solution: ${puzzleB()}`);

function puzzleA() {
    const recipeImprovementBreakpoint = 909441;

    let recipeScores = initialRecipeScores.split('')
        .map(x => parseInt(x)),
        recipeLength = recipeScores.length,
        posA = 0,
        posB = 1;

    while (recipeLength < recipeImprovementBreakpoint + 10) {
        const newScore = recipeScores[posA] + recipeScores[posB];
        newScore.toString()
            .split('')
            .forEach(x => recipeScores[recipeScores.length] = parseInt(x));
        recipeLength += newScore < 10 ? 1 : 2;

        posA = (posA + recipeScores[posA] + 1) % recipeScores.length;
        posB = (posB + recipeScores[posB] + 1) % recipeScores.length;
    }

    return recipeScores.slice(recipeImprovementBreakpoint, recipeImprovementBreakpoint + 10).join('');
}

function puzzleB() {
    const newAcceptanceCriteriaCourtesyOfTheElves = '909441';

    let recipeScores = initialRecipeScores.split('')
        .map(x => parseInt(x)),
        posA = 0,
        posB = 1,
        recentScores = initialRecipeScores;

    while (true) {
        const newScore = recipeScores[posA] + recipeScores[posB];
        newScore.toString()
            .split('')
            .forEach(x => recipeScores[recipeScores.length] = parseInt(x));

        recentScores += newScore.toString();
        if (recentScores.includes(newAcceptanceCriteriaCourtesyOfTheElves)) break;
        if (recentScores.length > newAcceptanceCriteriaCourtesyOfTheElves.length) {
            recentScores = recentScores.substr(-newAcceptanceCriteriaCourtesyOfTheElves.length);
        }

        posA = (posA + recipeScores[posA] + 1) % recipeScores.length;
        posB = (posB + recipeScores[posB] + 1) % recipeScores.length;
    }

    return recipeScores.length - recentScores.length + recentScores.indexOf(newAcceptanceCriteriaCourtesyOfTheElves);
}
