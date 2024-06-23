document.addEventListener('DOMContentLoaded', () => {
    const downloadTestBtn = document.getElementById('downloadTestBtn');
    const downloadSpeed = document.getElementById('downloadSpeed');
    const downloadChartCtx = document.getElementById('downloadChart').getContext('2d');
    const uploadTestBtn = document.getElementById('uploadTestBtn');
    const uploadSpeed = document.getElementById('uploadSpeed');
    const uploadChartCtx = document.getElementById('uploadChart').getContext('2d');
    const pingTestBtn = document.getElementById('pingTestBtn');
    const pingResult = document.getElementById('pingResult');

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
        const numRequests = 50;
        const fileSizeMB = 10;

        for (let i = 0; i < numRequests; i++) {
            const startTime = Date.now();
            await fetch('/large-file');
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            const speed = fileSizeMB / duration;
            const speedMbps = speed * 8;
            downloadSpeed.innerHTML = `Download speed: <b>${speed.toFixed(2)} MB/s, ${parseInt(speedMbps.toFixed(2)).toLocaleString()} Mbps</b> (${i + 1}/${numRequests})`;

            downloadChart.data.labels.push(i + 1);
            downloadChart.data.datasets[0].data.push(speed);
            downloadChart.update();

            if (speedMbps < 15) numRequests = 15;
            else if (speedMbps < 50) numRequests = 25;
        }
    }

    async function measureUploadSpeed() {
        const uploadUrl = '/upload';
        const numRequests = 25;
        const dataSizeMB = 1;
        const largeData = new Uint8Array(dataSizeMB * 1024 * 1024);

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
            uploadSpeed.innerHTML = `Upload speed: <b>${speed.toFixed(2)} MB/s, ${parseInt(speedMbps.toFixed(2)).toLocaleString()} Mbps</b> (${i + 1}/${numRequests})`;

            uploadChart.data.labels.push(i + 1);
            uploadChart.data.datasets[0].data.push(speed);
            uploadChart.update();

            if (speedMbps < 15) numRequests = 5;
            else if (speedMbps < 50) numRequests = 15;
        }
    }

    async function measurePing() {
        const pingUrl = '/ping';
        const numPings = 5;
        let totalPing = 0;

        pingResult.innerText = `--`;

        for (let i = 0; i < numPings; i++) {
            const startTime = Date.now();
            await fetch(pingUrl);
            const endTime = Date.now();
            const duration = endTime - startTime;
            totalPing += duration;
        }

        const averagePing = totalPing / numPings;
        pingResult.innerText = `Ping: ${averagePing.toFixed(2)} ms`;
    }

    downloadTestBtn.addEventListener('click', () => {
        downloadSpeed.textContent = '';
        downloadChart.data.labels = [];
        downloadChart.data.datasets[0].data = [];
        measureDownloadSpeed();
    });

    uploadTestBtn.addEventListener('click', () => {
        uploadSpeed.textContent = '';
        uploadChart.data.labels = [];
        uploadChart.data.datasets[0].data = [];
        measureUploadSpeed();
    });

    pingTestBtn.addEventListener('click', () => {
        pingResult.textContent = '';
        measurePing();
    });
});
