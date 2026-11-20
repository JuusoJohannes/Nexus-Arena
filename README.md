# NEXUS ARENA

Futuristinen, puhelimelle optimoitu pelikeskus. Projekti toimii staattisena sivustona ja sopii julkaistavaksi GitHub Pagesissa.

## Ominaisuudet

- Responsiivinen tumma neon-käyttöliittymä
- Kolme pelattavaa minipeliä: Neon Reflex, Memory Grid ja Number Rush
- Pelaajatasot, XP, Nexus Coins ja henkilökohtaiset ennätykset
- Päivittäinen bonus, tehtävät ja saavutukset
- Teemakauppa ja neljä ulkoasuteemaa
- Profiilin nimen muokkaus
- Äänimerkit ja värinäasetukset
- Automaattinen tallennus selaimen `localStorage`-tilaan
- Tallennuksen vienti JSON-tiedostoksi ja tuonti takaisin
- PWA-manifesti ja yksinkertainen offline-välimuisti

## Julkaisu GitHub Pagesissa

1. Luo GitHubissa uusi repository, esimerkiksi `nexus-arena`.
2. Pura tämän projektin tiedostot ja lisää ne repositoryn juureen.
3. Avaa repositoryn **Settings → Pages**.
4. Valitse **Deploy from a branch**.
5. Valitse branchiksi `main` ja kansioksi `/ (root)`.
6. Paina **Save**. GitHub Pages julkaisee sivuston hetken kuluttua.
7. Avaa Pages-asetuksissa näkyvä osoite puhelimella.

## Paikallinen käyttö

Avaa `index.html` selaimessa. Service worker ja asennettava PWA toimivat luotettavimmin, kun sivusto avataan HTTPS-yhteydellä (esimerkiksi GitHub Pages).

## Tallennus ja tietosuoja

Pelaajan tiedot tallennetaan vain käytössä olevan selaimen paikalliseen tallennustilaan. Tiedot eivät automaattisesti synkronoidu laitteiden välillä eivätkä muodosta palvelimella olevaa käyttäjätiliä. Selaimen tietojen tyhjennys voi poistaa tallennuksen. Käytä Asetukset-sivun **Vie JSON** -toimintoa varmuuskopiointiin.

## Teknologiat

HTML, CSS ja JavaScript. Ei build-vaihetta, pakettien asennusta, API-avaimia tai maksullisia riippuvuuksia.
