<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Andmete saamine POST päringust
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['url']) && filter_var($data['url'], FILTER_VALIDATE_URL)) {
        $url = $data['url'];

        // cURL kasutamine lehe sisu kättesaamiseks
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; Web Crawler)');
        $html = curl_exec($ch);
        curl_close($ch);

        // Lehe laadimise kontrollimine
        if ($html) {
            // Kasutame DOMDocument HTML analüüsimiseks
            $dom = new DOMDocument();
            @$dom->loadHTML($html);

            $xpath = new DOMXPath($dom);

            // Otsime kategooriad elementide klassi järgi
            $categories = [];
            foreach ($xpath->query("//span[contains(@class, 'nav-item__label-name')]") as $element) {
                $category = trim($element->nodeValue);
                if (!empty($category) && !in_array($category, $categories)) {
                    $categories[] = $category;
                }
            }

            // Kontrollime, kas oleme leidnud kategooriad
            if (!empty($categories)) {
                echo json_encode([
                    'status' => 'success',
                    'categories' => $categories
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Ei suutnud leida kategooriaid sellel saidil.'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Lehekülje laadimine ebaõnnestus.'
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Vale URL.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Kasutage POST-päringu.'
    ]);
}