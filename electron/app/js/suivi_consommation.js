    // Pie chart data
    const data = {
        labels: ['Stock A', 'Stock B', 'Stock C'],
        datasets: [{
            label: 'Consommation',
            data: [150, 300, 450],
            backgroundColor: [
                'rgba(136, 132, 216, 0.7)',  // Light purple (Series 1)
                'rgba(98, 114, 249, 0.7)',   // Blue (Series 2)
                'rgba(234, 84, 85, 0.7)'     // Red (Series 4)
            ],
            borderColor: [
                'rgba(136, 132, 216, 1)',    // Light purple (Series 1)
                'rgba(98, 114, 249, 1)',     // Blue (Series 2)
                'rgba(234, 84, 85, 1)'       // Red (Series 4)
            ],
            borderWidth: 1
        }]
    };
    

    // Configuration
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        },
    };

    // Render the chart
    const pieChart = new Chart(
        document.getElementById('pieChart'),
        config
    );
