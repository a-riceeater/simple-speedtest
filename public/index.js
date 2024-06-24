const downloadTestBtn = document.getElementById('downloadTestBtn');
const downloadSpeed = document.getElementById('downloadSpeed');
const downloadChartCtx = document.getElementById('downloadChart').getContext('2d');
const uploadTestBtn = document.getElementById('uploadTestBtn');
const uploadSpeed = document.getElementById('uploadSpeed');
const uploadChartCtx = document.getElementById('uploadChart').getContext('2d');
const pingTestBtn = document.getElementById('pingTestBtn');
const pingResult = document.getElementById('pingResult');
const downloadContainer = document.getElementById('download');
const uploadContainer = document.getElementById('upload');

document.querySelector("#start").addEventListener("click", (e) => {
    e.target.style.transform = 'translate(-50%, -50%) scale(0)'
    setTimeout(() => {

        pingResult.style.transform = 'translate(-50%, -50%) scale(1)'
        setTimeout(measurePing, 1200)
    }, 550)
})

document.querySelector('#test-again').addEventListener('click', (e) => {
    document.querySelector("#results").style.transform = 'translate(-50%, -50%) scale(0)'

    resetCharts()
    setTimeout(() => {
        pingResult.style.transform = 'translate(-50%, -50%) scale(1)'
        setTimeout(measurePing, 1200)
    }, 550)
})

const downloadChart = new Chart(downloadChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: 'blue',
            fill: true,
            backgroundColor: 'blue'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                title: {
                    display: false,
                }
            },
            y: {
                title: {
                    display: false,
                }
            }
        }
    }
});

const uploadChart = new Chart(uploadChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: 'red',
            fill: true,
            backgroundColor: 'red'
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                title: {
                    display: false,
                }
            },
            y: {
                title: {
                    display: false,
                }
            }
        }
    }
});

async function measureDownloadSpeed() {
    var numRequests = 50;
    const fileSizeMB = 1
    var avgSpeed = 0;

    for (let i = 0; i < numRequests; i++) {
        const startTime = Date.now();
        await fetch('/large-file', { cache: "no-store" });
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const speed = fileSizeMB / duration;
        const speedMbps = speed * 8;

        avgSpeed += speed;

        downloadChart.data.labels.push(i + 1);
        downloadChart.data.datasets[0].data.push(speed);
        downloadChart.update();

        if (speedMbps < 15) numRequests = 5;
        else if (speedMbps < 50) numRequests = 25;

        const av = avgSpeed / i;
        const avMbps = av * 8;


        downloadSpeed.innerHTML = `Download speed: <br><b>${av.toFixed(2)} MB/s, ${parseInt(avMbps.toFixed(2)).toLocaleString()} Mbps</b> (${i + 1}/${numRequests})`;
        document.querySelector("#dr-mbps").innerText = `${parseInt(avMbps.toFixed(2)).toLocaleString()} Mbps`
        document.querySelector("#dr-mbs").innerText = `${av.toFixed(2)} MB/s`
    }

    setTimeout(() => {
        downloadContainer.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            uploadContainer.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(measureUploadSpeed, 1050)
        }, 1050)
    }, 2500)
}

async function measureUploadSpeed() {
    const uploadUrl = '/upload';
    var numRequests = 25;
    const dataSizeMB = 1;
    const largeData = new Uint8Array(dataSizeMB * 1024 * 1024);

    var avgSpeed = 0;

    for (let i = 0; i < numRequests; i++) {
        const startTime = Date.now();
        await fetch(uploadUrl, {
            method: 'POST',
            body: largeData
        });
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const speed = dataSizeMB / duration;
        const speedMbps = speed * 8;

        avgSpeed += speed;

        uploadChart.data.labels.push(i + 1);
        uploadChart.data.datasets[0].data.push(speed);
        uploadChart.update();

        if (speedMbps < 15) numRequests = 5;
        else if (speedMbps < 50) numRequests = 15;

        const av = avgSpeed / i;
        const avMbps = av * 8;

        uploadSpeed.innerHTML = `Upload speed: <br><b>${av.toFixed(2)} MB/s, ${parseInt(avMbps.toFixed(2)).toLocaleString()} Mbps</b> (${i + 1}/${numRequests})`;
        document.querySelector("#ur-mbps").innerText = `${parseInt(avMbps.toFixed(2)).toLocaleString()} Mbps`
        document.querySelector("#ur-mbs").innerText = `${av.toFixed(2)} MB/s`
    }

    setTimeout(() => {
        uploadContainer.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            document.querySelector("#results").style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => { }, 1050)
        }, 1050)
    }, 2500)
}

async function measurePing() {
    const pingUrl = '/ping';
    const numPings = 5;
    let totalPing = 0;

    for (let i = 0; i < numPings; i++) {
        const startTime = Date.now();
        await fetch(pingUrl);
        const endTime = Date.now();
        const duration = endTime - startTime;
        totalPing += duration;
    }

    const averagePing = totalPing / numPings;
    pingResult.innerHTML = `Ping: <b>${averagePing.toFixed(2)} ms</b>`;
    document.querySelector("#pingFinal").innerHTML = `<b>Ping:</b><br>${averagePing.toFixed(2)} ms`;

    setTimeout(() => {
        pingResult.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            downloadContainer.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(measureDownloadSpeed, 1050)
        }, 1050)
    }, 2500)
}

function resetCharts() {
    downloadChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    downloadChart.update();
    uploadChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    uploadChart.update();
}
