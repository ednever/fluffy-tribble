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

        fetchAPI(searchInputValue);
    });
}

// Päringu saatmine PHP API-le
function fetchAPI(url, category = null) {
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
            if (data.status === 'success') {
                displayResults(data.categories, data.products);
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
function displayResults(categories = [], products = []) {
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
                    fetchAPI(searchInputValue, item);
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

        headerRow.appendChild(orderHeader);
        headerRow.appendChild(productHeader);
        thead.appendChild(headerRow);

        const tbody = document.createElement('tbody');

        products.forEach((item, index) => {
            const row = document.createElement('tr');

            const orderCell = document.createElement('td');
            orderCell.innerText = index + 1;

            const productCell = document.createElement('td');
            productCell.innerText = item;

            row.appendChild(orderCell);
            row.appendChild(productCell);
            tbody.appendChild(row);
        });

        productTable.appendChild(thead);
        productTable.appendChild(tbody);
        resultsContainer.appendChild(productTable);
    }
}

// Dashboard'i initsialiseerimine
createDashboard();

