// Funktsioon kogu lehekülje genereerimiseks
function createDashboard() {
    // Elementide loomine
    const dashboardContainer = document.createElement('div');
    dashboardContainer.classList.add('dashboard-container');

    const heading = document.createElement('h1');
    heading.innerText = 'Web Crawler Dashboard';

    const searchBar = document.createElement('div');
    searchBar.classList.add('search-bar');

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.placeholder = 'Sisestage saidi URL';

    const searchButton = document.createElement('button');
    searchButton.id = 'searchButton';
    searchButton.innerText = 'Otsi';

    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results';
    resultsContainer.classList.add('results-container');

    // Elementide lisamine lehele
    searchBar.appendChild(searchInput);
    searchBar.appendChild(searchButton);

    dashboardContainer.appendChild(heading);
    dashboardContainer.appendChild(searchBar);
    dashboardContainer.appendChild(resultsContainer);

    document.body.appendChild(dashboardContainer);

    // Funktsionaalsuse lisamine nupule
    searchButton.addEventListener('click', () => {
        const searchInputValue = searchInput.value;

        if (searchInputValue.trim() === '') {
            alert('Sisestage URL otsimiseks.');
            return;
        }

        displayResults(`Otsing URL-i järgi: ${searchInputValue}`);

        fetchAPI(searchInputValue, null, true);
    });
}

let toodeteKogus = [];

// Päringu saatmine PHP API-le
function fetchAPI(url, category = null, boolean) {
    let apiUrl = url;

    // Kui kategooria on lisatud, lisame see URL-ile (asendades tühikud sidekriipsudega).
    if (category) {
        const formattedCategory = category.replace(/\s+/g, '-');
        apiUrl += '/' + formattedCategory;
    }

    fetch('crawler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: apiUrl }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && boolean) {
                displayResults(data.categories, data.products, data.productsPrice);
            } else if (data.status === 'success' && !boolean) {
                if (data.productsQuantity[0]) {
                    toodeteKogus.push(data.productsQuantity[0]);
                    displayResults(data.categories, data.products);
                }
            } else {
                displayResults(data.message);
            }
        })
        .catch(error => {
            console.error('Viga:', error);
            displayResults('Veebisaidi analüüsimisel tekkis viga.');
        });
}

// Tulemuste kuvamise funktsioon
function displayResults(categories = [], products = [], productsPrice = []) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Vanade tulemuste kustutamine

    // Kategooriate kuvamine
    if (Array.isArray(categories) && categories.length > 0) {
        const categoryTable = document.createElement('table');
        categoryTable.classList.add('categories-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const orderHeader = document.createElement('th');
        orderHeader.innerText = 'Järjestus';
        const categoryHeader = document.createElement('th');
        categoryHeader.innerText = 'Kategooriad';

        headerRow.appendChild(orderHeader);
        headerRow.appendChild(categoryHeader);
        thead.appendChild(headerRow);

        const tbody = document.createElement('tbody');

        categories.forEach((item, index) => {
            const row = document.createElement('tr');

            const orderCell = document.createElement('td');
            orderCell.innerText = index + 1;

            const categoryCell = document.createElement('td');
            categoryCell.innerText = item;
            categoryCell.classList.add('category-item');

            // Kategooria klõpsu sündmuse lisamine
            categoryCell.addEventListener('click', () => {
                const searchInputValue = document.getElementById('searchInput').value;
                if (searchInputValue.trim() !== '') {
                    fetchAPI(searchInputValue, item, true);
                } else {
                    alert('Sisestage URL saidi analüüsimiseks.');
                }
            });

            row.appendChild(orderCell);
            row.appendChild(categoryCell);
            tbody.appendChild(row);
        });

        categoryTable.appendChild(thead);
        categoryTable.appendChild(tbody);
        resultsContainer.appendChild(categoryTable);

        // Nupu lisamine valitud kategooriate API taotlemiseks
        const button = document.createElement('button');
        button.innerText = 'Kuva ring diagramm';
        button.classList.add('api-button');
        button.addEventListener('click', () => {
            // Ringdiagramm näidis. Pole jõudnud teha päris andmete kuvamisega
            /* categories.forEach((item, index) => {
                const searchInputValue = document.getElementById('searchInput').value;
                if (searchInputValue.trim() !== '') {
                    fetchAPI(searchInputValue, item, false);
                } else {
                    alert('Sisestage URL saidi analüüsimiseks.');
                }
            }); */

            const canvas = document.createElement('canvas');
            canvas.id = 'pieChart';
            canvas.width = 300;
            canvas.height = 300;

            resultsContainer.appendChild(canvas);

            function drawPieChart(data, colors) {
                const canvas = document.getElementById('pieChart');
                const ctx = canvas.getContext('2d');
                const total = data.reduce((acc, value) => acc + value, 0);
                let startAngle = 0;

                data.forEach((value, index) => {
                    const sliceAngle = (value / total) * 2 * Math.PI;
                    ctx.fillStyle = colors[index];
                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2, canvas.height / 2);
                    ctx.arc(
                        canvas.width / 2,
                        canvas.height / 2,
                        Math.min(canvas.width / 2, canvas.height / 2),
                        startAngle,
                        startAngle + sliceAngle
                    );
                    ctx.closePath();
                    ctx.fill();
                    startAngle += sliceAngle;
                });
            }

            /*let data = toodeteKogus.map(item => item.replace(/[()]/g, ''));
            let colors = [];

            function getRandomColor() {
                let letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            data.forEach(() => {
                colors.push(getRandomColor());
            });*/

            const data = [281, 3489, 2229, 1345, 1406, 1079, 1606, 1497, 1056, 660];
            const colors = ['#EE07AE', '#E2784D', '#16DEA7', '#44CA94', '#C34804', '#5AED12', '#4D7843', '#EC8094', '#812B1D', '#DCAAA8'];
            let labels = categories;

            drawPieChart(data, colors);

            function createLegend(labels, colors) {
                const legendContainer = document.createElement('div');
                legendContainer.classList.add('legend-container');

                labels.forEach((label, index) => {
                    const legendItem = document.createElement('div');
                    legendItem.classList.add('legend-item');

                    const colorBox = document.createElement('span');
                    colorBox.classList.add('color-box');
                    colorBox.style.backgroundColor = colors[index];

                    const labelText = document.createElement('span');
                    labelText.innerText = `${label}: ${data[index]} tk`;

                    legendItem.appendChild(colorBox);
                    legendItem.appendChild(labelText);

                    legendContainer.appendChild(legendItem);
                });

                resultsContainer.appendChild(legendContainer);
            }

            createLegend(labels, colors);
        });

        resultsContainer.appendChild(button);
    }

    // Toodete kuvamine
    if (Array.isArray(products) && products.length > 0) {
        const productTable = document.createElement('table');
        productTable.classList.add('products-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const orderHeader = document.createElement('th');
        orderHeader.innerText = 'Järjestus';
        const productHeader = document.createElement('th');
        productHeader.innerText = 'Tooted';
        const priceHeader = document.createElement('th');
        priceHeader.innerText = 'Hind';

        headerRow.appendChild(orderHeader);
        headerRow.appendChild(productHeader);
        headerRow.appendChild(priceHeader);
        thead.appendChild(headerRow);

        const tbody = document.createElement('tbody');

        products.forEach((item, index) => {
            const row = document.createElement('tr');

            const orderCell = document.createElement('td');
            orderCell.innerText = index + 1;

            const productCell = document.createElement('td');
            productCell.innerText = item;

            const priceCell = document.createElement('td');
            priceCell.innerText = productsPrice[index];

            row.appendChild(orderCell);
            row.appendChild(productCell);
            row.appendChild(priceCell);
            tbody.appendChild(row);
        });

        productTable.appendChild(thead);
        productTable.appendChild(tbody);
        resultsContainer.appendChild(productTable);
    }

}

// Dashboard'i initsialiseerimine
createDashboard();

