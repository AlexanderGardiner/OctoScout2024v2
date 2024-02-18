fetch("../output.csv")
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    displayData(csvJSON(data));
  });

function displayData(data) {
  let tempDiv = document.createElement("div");
  tempDiv.style.width = "100%";
  tempDiv.style.height = "40px";
  tempDiv.style.textAlign = "center";
  let sectionTitle = document.createElement("h1");
  sectionTitle.innerHTML = "Overall";
  sectionTitle.style.color = "white";
  tempDiv.appendChild(sectionTitle);
  document.getElementById("graphContainer").appendChild(tempDiv);
  makeEloGraph(calculateElos(data));
  makeCompositeGraph(
    data,
    "Total points",
    "Points",
    [
      "06autoCountSpeaker",
      "07autoCountAmp",
      "13teleopCountSpeaker",
      "14teleopCountAmp",
      "15teleopCountAmpSpeaker",
      "23trapNotes",
    ],
    [5, 2, 1, 2, 5, 5],
    [
      "09autoMobility",
      "19endgamePark",
      "20endgameOnstage",
      "21endgameSpotlit",
      "22endgameHarmony",
    ],
    ["true", "Successful", "Successful", "Successful", "Successful"],
    [2, 1, 3, 1, 2]
  );
  makeCompositeGraph(
    data,
    "Total Pieces",
    "Points",
    [
      "06autoCountSpeaker",
      "07autoCountAmp",
      "13teleopCountSpeaker",
      "14teleopCountAmp",
      "15teleopCountAmpSpeaker",
      "23trapNotes",
    ],
    [1, 1, 1, 1, 1, 1],
    [],
    [],
    []
  );
  tempDiv = document.createElement("div");
  tempDiv.style.width = "100%";
  tempDiv.style.height = "40px";
  tempDiv.style.textAlign = "center";
  sectionTitle = document.createElement("h1");
  sectionTitle.innerHTML = "Auto";
  sectionTitle.style.color = "white";
  tempDiv.appendChild(sectionTitle);
  document.getElementById("graphContainer").appendChild(tempDiv);
  makeGraph("05autoCountCollected", data, "Auto Collected", "Pieces", 1);
  makeGraph("06autoCountSpeaker", data, "Speaker Scores Auto", "Points", 5);
  makeGraph("07autoCountAmp", data, "Amp Scores Auto", "Points", 2);
  makeGraph("08autoCountFailed", data, "Failed Auto", "Pieces", 1);
  makeGraphOneTimePoints(
    "09autoMobility",
    data,
    "Mobility Auto",
    "Mobility",
    2,
    "true"
  );
  tempDiv = document.createElement("div");
  sectionTitle = document.createElement("h1");
  sectionTitle.innerHTML = "Teleop";
  sectionTitle.style.color = "white";
  tempDiv.appendChild(sectionTitle);
  tempDiv.style.width = "100%";
  tempDiv.style.height = "40px";
  tempDiv.style.textAlign = "center";
  document.getElementById("graphContainer").appendChild(tempDiv);
  makeGraph("12teleopCountCollected", data, "Collected Teleop", "Pieces", 1);
  makeGraph("13teleopCountSpeaker", data, "Speaker Scores Teleop", "Points", 2);
  makeGraph("14teleopCountAmp", data, "Amp Scores Teleop", "Points", 1);
  makeGraph(
    "15teleopCountAmpSpeaker",
    data,
    "Amplified Speaker Scores Teleop",
    "Points",
    5
  );
  makeGraph("16teleopCountFailed", data, "Failed Teleop", "Pieces", 1);
  tempDiv = document.createElement("div");
  tempDiv.style.width = "100%";
  tempDiv.style.height = "40px";
  tempDiv.style.textAlign = "center";
  sectionTitle = document.createElement("h1");
  sectionTitle.innerHTML = "Endgame";
  sectionTitle.style.color = "white";
  tempDiv.appendChild(sectionTitle);
  document.getElementById("graphContainer").appendChild(tempDiv);
  makeGraphOneTimePoints(
    "19endgamePark",
    data,
    "Endgame Park",
    "Park",
    1,
    "Successful"
  );

  makeGraphOneTimePoints(
    "20endgameOnstage",
    data,
    "Endgame Onstage",
    "Onstage",
    3,
    "Successful"
  );
  makeGraphOneTimePoints(
    "21endgameSpotlit",
    data,
    "Endgame Spotlit",
    "Spotlit",
    1,
    "Successful"
  );
  makeGraphOneTimePoints(
    "22endgameHarmony",
    data,
    "Endgame Harmony",
    "Harmony",
    2,
    "Successful"
  );

  makeGraph("23trapNotes", data, "Trap Scores Teleop", "Points", 5);
}

function makeEloGraph(eloData) {
  let eloDataPoints = [];
  let eloDataKeys = Object.keys(eloData);
  for (let i = 0; i < eloDataKeys.length; i++) {
    eloDataPoints.push({ label: eloDataKeys[i], y: eloData[eloDataKeys[i]] });
  }
  eloDataPoints.sort((a, b) => parseFloat(b.y) - parseFloat(a.y));

  let chartDiv = document.createElement("div");
  chartDiv.id = "Elo Rank";
  chartDiv.style.height = "200px";
  chartDiv.style.width = "30%";
  chartDiv.style.margin = "10px";
  document.getElementById("graphContainer").appendChild(chartDiv);
  var chart = new CanvasJS.Chart("Elo Rank", {
    title: {
      text: "Elo Rank",
    },
    axisY: {
      title: "Elo",
    },
    dataPointMaxWidth: 5,
    data: [
      {
        color: "black",
        yValueFormatString: "##.## Elo",
        dataPoints: eloDataPoints,
      },
    ],
  });
  chart.render();
}

function makeBoxAndWhiskerGraph(dataPoints, meanPoints, chartName, yLable) {
  let chartDiv = document.createElement("div");
  chartDiv.id = chartName;
  chartDiv.style.height = "200px";
  chartDiv.style.width = "30%";
  chartDiv.style.margin = "10px";
  document.getElementById("graphContainer").appendChild(chartDiv);
  var chart = new CanvasJS.Chart(chartName, {
    title: {
      text: chartName,
    },
    axisY: {
      title: yLable,
    },
    dataPointMaxWidth: 5,
    data: [
      {
        type: "boxAndWhisker",
        upperBoxColor: "#7BCE69",
        lowerBoxColor: "#FF5A4D",
        color: "black",
        yValueFormatString: "##.## " + yLable,
        dataPoints: dataPoints,
      },
      {
        type: "scatter",
        markerColor: "black",
        markerSize: 5,
        toolTipContent: "Mean: {y}",
        dataPoints: meanPoints,
      },
    ],
  });
  chart.render();
}

function makeCompositeGraph(
  data,
  chartName,
  yLable,
  jsonCountKeys,
  countPointAmounts,
  jsonStringKeys,
  correctStrings,
  stringPointAmounts
) {
  let teams = [];
  dataKeys = Object.keys(data);

  for (let i = 0; i < data.length; i++) {
    if (!teams.includes(data[i]["01teamNumber"])) {
      teams.push(data[i]["01teamNumber"]);
    }
  }

  let scored = [];
  let means = [];
  for (let j = 0; j < teams.length; j++) {
    let scoredQ1 = 0;
    let scoredMedian = 0;
    let scoredQ3 = 0;
    let scoredMin = 10000000;
    let scoredMax = 0;
    let scores = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]["01teamNumber"] == teams[j]) {
        let points = 0;
        for (let k = 0; k < jsonCountKeys.length; k++) {
          points += data[i][jsonCountKeys[k]] * countPointAmounts[k];
        }

        for (let k = 0; k < jsonStringKeys.length; k++) {
          if (data[i][jsonStringKeys[k]] == correctStrings[k]) {
            points += stringPointAmounts[k];
          }
        }
        if (scoredMin > points) {
          scoredMin = points;
        }

        if (scoredMax < points) {
          scoredMax = points;
        }

        scores.push(points);
      }
      scoredMedian = quartiles(scores).Q2;
      scoredQ1 = quartiles(scores).Q1;
      scoredQ3 = quartiles(scores).Q3;
    }
    scored.push({
      label: teams[j],
      y: [scoredMin, scoredQ1, scoredQ3, scoredMax, scoredMedian],
    });
    let mean = 0;
    for (let j = 0; j < scores.length; j++) {
      mean += scores[j];
    }

    mean = mean / scores.length;
    means.push({
      label: teams[j],
      y: mean,
    });
  }
  scored.sort((a, b) => parseFloat(b.y[4]) - parseFloat(a.y[4]));
  let sortedMeans = [];
  for (let k = 0; k < scored.length; k++) {
    let meanValue = 0;
    for (let l = 0; l < means.length; l++) {
      if (means[l].label == scored[k].label) {
        meanValue = means[l].y;
      }
    }
    sortedMeans.push({ label: scored.label, y: meanValue });
  }

  makeBoxAndWhiskerGraph(scored, sortedMeans, chartName, yLable);
}

function makeGraph(jsonKey, data, chartName, yLable, pointsPerScore) {
  let teams = [];
  dataKeys = Object.keys(data);

  for (let i = 0; i < data.length; i++) {
    if (!teams.includes(data[i]["01teamNumber"])) {
      teams.push(data[i]["01teamNumber"]);
    }
  }

  let scored = [];
  let means = [];
  for (let j = 0; j < teams.length; j++) {
    let scoredQ1 = 0;
    let scoredMedian = 0;
    let scoredQ3 = 0;
    let scoredMin = 10000000;
    let scoredMax = 0;
    let scores = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]["01teamNumber"] == teams[j]) {
        if (scoredMin > parseFloat(data[i][jsonKey]) * pointsPerScore) {
          scoredMin = parseFloat(data[i][jsonKey]) * pointsPerScore;
        }

        if (scoredMax < parseFloat(data[i][jsonKey]) * pointsPerScore) {
          scoredMax = parseFloat(data[i][jsonKey]) * pointsPerScore;
        }

        scores.push(parseFloat(data[i][jsonKey]) * pointsPerScore);
      }
      scoredMedian = quartiles(scores).Q2;
      scoredQ1 = quartiles(scores).Q1;
      scoredQ3 = quartiles(scores).Q3;
    }
    scored.push({
      label: teams[j],
      y: [scoredMin, scoredQ1, scoredQ3, scoredMax, scoredMedian],
    });
    let mean = 0;
    for (let j = 0; j < scores.length; j++) {
      mean += scores[j];
    }

    mean = mean / scores.length;
    means.push({
      label: teams[j],
      y: mean,
    });
  }
  scored.sort((a, b) => parseFloat(b.y[4]) - parseFloat(a.y[4]));
  let sortedMeans = [];
  for (let k = 0; k < scored.length; k++) {
    let meanValue = 0;
    for (let l = 0; l < means.length; l++) {
      if (means[l].label == scored[k].label) {
        meanValue = means[l].y;
      }
    }
    sortedMeans.push({ label: scored.label, y: meanValue });
  }

  makeBoxAndWhiskerGraph(scored, sortedMeans, chartName, yLable);
}

function makeGraphOneTimePoints(
  jsonKey,
  data,
  chartName,
  yLable,
  pointsPerScore,
  scoreCriteria
) {
  let teams = [];
  dataKeys = Object.keys(data);

  for (let i = 0; i < data.length; i++) {
    if (!teams.includes(data[i]["01teamNumber"])) {
      teams.push(data[i]["01teamNumber"]);
    }
  }
  let scored = [];
  let means = [];
  for (let j = 0; j < teams.length; j++) {
    let scoredQ1 = 0;
    let scoredMedian = 0;
    let scoredQ3 = 0;
    let scoredMin = 10000000;
    let scoredMax = 0;
    let scores = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i]["01teamNumber"] == teams[j]) {
        let value = 0;
        if (data[i][jsonKey] == scoreCriteria) {
          value = pointsPerScore;
        }
        if (scoredMin > value) {
          scoredMin = value;
        }

        if (scoredMax < value) {
          scoredMax = value;
        }

        scores.push(value);
      }
      scoredMedian = quartiles(scores).Q2;
      scoredQ1 = quartiles(scores).Q1;
      scoredQ3 = quartiles(scores).Q3;
    }
    scored.push({
      label: teams[j],
      y: [scoredMin, scoredQ1, scoredQ3, scoredMax, scoredMedian],
    });

    let mean = 0;
    for (let j = 0; j < scores.length; j++) {
      mean += scores[j];
    }

    mean = mean / scores.length;
    means.push({
      label: teams[j],
      y: mean,
    });
  }
  scored.sort((a, b) => parseFloat(b.y[4]) - parseFloat(a.y[4]));
  let sortedMeans = [];
  for (let k = 0; k < scored.length; k++) {
    let meanValue = 0;
    for (let l = 0; l < means.length; l++) {
      if (means[l].label == scored[k].label) {
        meanValue = means[l].y;
      }
    }
    sortedMeans.push({ label: scored.label, y: meanValue });
  }

  makeBoxAndWhiskerGraph(scored, sortedMeans, chartName, yLable);
}

function quartiles(values) {
  // Make a copy of the array to avoid altering the original
  var sortedValues = values.slice().sort((a, b) => a - b);

  var length = sortedValues.length;
  var half = Math.floor(length / 2);

  // Compute Q2 (median)
  var q2;
  if (length % 2 === 0) {
    // If the array has an even number of elements
    q2 = (sortedValues[half - 1] + sortedValues[half]) / 2.0;
  } else {
    // If the array has an odd number of elements
    q2 = sortedValues[half];
  }

  // Compute Q1 (lower quartile)
  var q1;
  if (half % 2 === 0) {
    // If the lower half has an even number of elements
    q1 =
      (sortedValues[Math.floor(half / 2) - 1] +
        sortedValues[Math.floor(half / 2)]) /
      2.0;
  } else {
    // If the lower half has an odd number of elements
    q1 = sortedValues[Math.floor(half / 2)];
  }

  // Compute Q3 (upper quartile)
  var q3;
  if ((length - half) % 2 === 0) {
    // If the upper half has an even number of elements
    q3 =
      (sortedValues[half + Math.floor((length - half) / 2) - 1] +
        sortedValues[half + Math.floor((length - half) / 2)]) /
      2.0;
  } else {
    // If the upper half has an odd number of elements
    q3 = sortedValues[half + Math.floor((length - half) / 2)];
  }

  return {
    Q1: q1,
    Q2: q2,
    Q3: q3,
  };
}

function csvJSON(csv) {
  var lines = csv.split("\n");

  var result = [];

  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}
