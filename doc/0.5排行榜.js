// 从API获取数据
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('网络响应不正常!');
    }
    let data = await response.json();

    let firstPerfectScores = [false, false, false, false];
    data.forEach(user => {
        user.score.forEach((score, level) => {
            if (score.score === 10 && !firstPerfectScores[level]) {
                score.firstPerfectScore = true;
                firstPerfectScores[level] = true;
            }
        });
    });

    return data;
}

// 计算总分
function calculateTotalScore(data) {
    data.forEach(user => {
        user.totalScore = user.score.reduce((total, current) => total + current.score, 0);
    });
}

// 根据分数对用户进行排序
function sortUsersByScore(data) {
    data.sort((a, b) => b.totalScore - a.totalScore);
}

// 生成排行榜
function generateLeaderboard(data) {
    data.forEach((user, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${user.name}</td><td>${user.id}</td><td>${user.totalScore}</td>`;
        user.score.forEach(score => {
            let scoreTd = document.createElement('td');
            scoreTd.textContent = score.score;
            if (score.firstPerfectScore) {
                scoreTd.classList.add('score-passed-early');
            } else if (score.score === 0) {
                scoreTd.classList.add('score-failed');
            } else if (score.score === 10) {
                scoreTd.classList.add('score-passed');
            }
            row.appendChild(scoreTd);
        });
        document.getElementById('leaderboard').appendChild(row);
    });
}

// 生成饼图
function generatePieCharts(data) {
    let levelScores = [0, 0, 0, 0];
    data.forEach(user => {
        user.score.forEach((score, index) => {
            levelScores[index] += score.score;
        });
    });

    let levelRates = levelScores.map(score => score / (10 * data.length));

    let container = document.createElement('div');
    container.style = 'display: flex; flex-wrap: wrap; width: 1396px; height: 696px; justify-content: space-around; align-items: center;';
    document.body.appendChild(container);

    ['Level 0 Passed', 'Level 1 Passed', 'Level 2 Passed', 'Level 3 Passed'].forEach((level, index) => {
        createPieChart(level, levelRates[index], container);
    });
}

// 创建饼图
function createPieChart(level, rate, container) {
    let canvas = document.createElement('canvas');
    canvas.width = "400";
    canvas.height = "400";
    canvas.style = "box-sizing: border-box; border: 0.5px solid pink"
    container.appendChild(canvas);

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
