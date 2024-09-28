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

        // Tulemuste simuleerimine testimiseks
        setTimeout(() => {
            displayResults([
                { name: 'Toode 1', price: '$50' },
                { name: 'Toode 2', price: '$30' },
                { name: 'Toode 3', price: '$20' }
            ]);
        }, 2000);
    });
}

// Tulemuste kuvamise funktsioon
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Vanade tulemuste kustutamine

    if (typeof results === 'string') {
        resultsContainer.innerHTML = `<p>${results}</p>`;
    } else if (Array.isArray(results)) {
        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `<h3>${item.name}</h3><p>${item.price}</p>`;
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Dashboard'i initsialiseerimine
createDashboard();
