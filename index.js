const API_KEY = "33Y95X6X9ORPYSHV";

const getApiData = async (STOCK_SYMBOL) => {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${STOCK_SYMBOL}&interval=5min&apikey=${API_KEY}`)
        const data = await response.json()
        console.log(data)

        const stockInfo = document.querySelector('.info_stock');
        const metaData = data["Meta Data"]
        const time = data["Time Series (5min)"]

        if (metaData && time) {
            const timeStamp = Object.keys(time)[0]

            if (time[timeStamp]) {
                const changeStock = time[timeStamp]["2. high"] - time[timeStamp]["4. close"];
                const totalChange = Number(changeStock.toFixed(2))

                stockInfo.innerHTML = `
                    <h2>${metaData["2. Symbol"]}</h2>
                    <span class="stock_text">Price: $${time[timeStamp]["2. high"]}</span>
                    <span class="stock_text">Change: $${totalChange}</span>
                    <span class="stock_text">Volume: ${time[timeStamp]["5. volume"]}</span>
                `

                const tbody = document.querySelector('.tbody');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="row_text">${metaData["2. Symbol"]}</td>
                    <td class="row_text">$${time[timeStamp]["2. high"]}</td>
                    <td class="row_text">${totalChange}</td>
                    <td class="row_text">${time[timeStamp]["5. volume"]}</td>
                `;
                tbody.appendChild(row)

                const labels = Object.keys(time).map(date => date).slice(0, 30)
                const prices = Object.keys(time).map(data => time[data]["4. close"])

                const ctx = document.getElementById('stockChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Stock Price',
                            data: prices,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            fill: false            
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date and Time'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Price'
                                }
                            }
                        },
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                            }
                        }
                    }
                });
            } else {
                stockInfo.innerHTML = `<p>Stock data not available for ${STOCK_SYMBOL}.</p>`;                
            }
        } else {
            stockInfo.innerHTML = `<p>No stock data available for ${STOCK_SYMBOL}.</p>`;
            console.log("No stock data available");
        }
    } catch (e) {
        console.error(e)
        stockInfo.innerHTML = `<p>Error fetching stock data.</p>`
    }
}

const selectStock = document.querySelector('#selectStock')

const stock = [
    "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "FB", "NFLX", "NVDA", "BABA", "INTC"
]

stock.forEach((symbol) => {

    const option = document.createElement('option') 

    option.classList.add('option')
    option.textContent = symbol

    selectStock.appendChild(option) 
})

const loadStock = document.querySelector('.list-btn')

loadStock.addEventListener('click', () => {

    const selectedOption = selectStock.options[selectStock.selectedIndex];
    const STOCK_SYMBOL = selectedOption.innerText;
    getApiData(STOCK_SYMBOL)

})

const search = document.querySelector('#listBtn');
search.addEventListener('click', () => {
    const getSearch = document.querySelector('#searchInput');
    const value = getSearch.value
    if (value) {
        getApiData(value);
    } else {
        alert("Please enter a stock symbol.");
    }
})