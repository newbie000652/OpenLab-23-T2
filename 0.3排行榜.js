// Fetch data from API
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

// Calculate total score for each user
function calculateTotalScore(data) {
    data.forEach(user => {
        user.totalScore = user.score.reduce((total, current) => total + current.score, 0);
    });
}

// Sort users by total score
function sortUsersByScore(data) {
    data.sort((a, b) => b.totalScore - a.totalScore);
}

// Generate leaderboard table
function generateLeaderboard(data) {
    data.forEach((user, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${user.name}</td><td>${user.id}</td><td>${user.totalScore}</td>`;
        user.score.forEach(score => {
            let scoreTd = document.createElement('td');
            scoreTd.textContent = score.score;
            if (score.score === 10) {
                scoreTd.classList.add('score-passed');
            } else if (score.score === 0) {
                scoreTd.classList.add('score-failed');
            }
            row.appendChild(scoreTd);
        });
        document.getElementById('leaderboard').appendChild(row);
    });
}

// Generate pie charts for each level
function generatePieCharts(data) {
    let levelScores = [0, 0, 0, 0];
    data.forEach(user => {
        user.score.forEach((score, index) => {
            levelScores[index] += score.score;
        });
    });

    let levelRates = levelScores.map(score => score / (10 * data.length));

    ['Level 0 Passed', 'Level 1 Passed', 'Level 2 Passed', 'Level 3 Passed'].forEach((level, index) => {
        createPieChart(level, levelRates[index]);
    });
}

// Create pie chart
function createPieChart(level, rate) {
    let canvas = document.createElement('canvas');
    canvas.width = "800";
    canvas.height = "800";
    canvas.style = "box-sizing: border-box * 0.5; border: 1px solid black"
    document.body.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [level, 'Not Passed'],
            datasets: [{
                data: [rate, 1 - rate],
                backgroundColor: ['rgba(0, 255, 0, 0.2)', 'rgba(255, 0, 0, 0.2)'],
                borderColor: ['rgba(0,255,0,1)', 'rgba(255,0,0,1)'],
                borderWidth: 0.5,
                radius: '50%',
                series: [
                    {
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0)'
                            },
                            normal: {
                                borderWidth: 2.5,
                                borderColor: '#000',
                            }
                        }
                    }]
            }]
        },
        options: {
            legend: {
                labels: {
                    padding: 10
                }
            }
        }
    });
}

// Main function
async function main() {
    try {
        let data = await fetchData('https://puzzle.qieee.top/api/rank');
        calculateTotalScore(data);
        sortUsersByScore(data);
        generateLeaderboard(data);
        generatePieCharts(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
