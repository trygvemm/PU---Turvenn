[![pipeline status](https://gitlab.stud.idi.ntnu.no/tdt4140-2022/landsby-4/gruppe_57/turvenn/badges/main/pipeline.svg)](https://gitlab.stud.idi.ntnu.no/tdt4140-2022/landsby-4/gruppe_57/turvenn/-/commits/main) 


[![coverage report](https://gitlab.stud.idi.ntnu.no/tdt4140-2022/landsby-4/gruppe_57/turvenn/badges/main/coverage.svg)](https://gitlab.stud.idi.ntnu.no/tdt4140-2022/landsby-4/gruppe_57/turvenn/main)


# Gruppe 57

## Frontend

I mappen frontend finnes det et React.js-prosjekt. Dette er initialisert med `yarn create react-app`. Appen kjører på port 3000. For å åpne appen i nettleseren din, besøk http://localhost:3000. Koden oppdaterer seg automatisk når du lagrer. Refresh nettsiden hvis du får problemer med dette.

## Backend

I mappen backend finnes det et Express.js-API. APIet tar i mot forespørsler fra andre applikasjoner på port 4000. Denne koden oppdaterer seg også automatisk når du lagrer.

## Database

Databasen har bare en fil, `Postgres.Dockerfile`. Databasen kjører på port 4001. For å komme inn i databasen på din pc kan du skrive `docker exec -it -u postgres database psql`. Dette åpner et postgres-shell hvor du kan skrive SQL-kommandoer.

## Om Docker

Docker er et verktøy som lar deg kjøre applikasjoner i en lukket "container". Containeren er sammenliknbart med en virtuell maskin. I praksis er fordelen med docker at alle som bruker kodebasen kjører applikasjonene i et likt utviklermiljø, slik at forskjeller fra PC til PC minimeres. Det finnes masse ressurser på Youtube og Google om hva Docker er og hvordan det kan brukes.

### Dockerfiler og docker-compose.yml

Det finnes en Dockerfil for hver applikasjon. En i frontend-mappa, en i backend-mappa og en på rotfilnivå til databasen (denne trenger enn så lenge ikke en egen mappe).

I Dockerfilene spesifiseres oppsett/konfigurasjon av miljøet applikasjonen skal kjøre i. Se særlig første linje, `FROM ...` som sier hvilke standardinnstillinger som skal være.

docker-compose.yml er en fil som holder orden på alle applikasjonene. Hver "service" er en applikasjon, og her kan man komme med litt andre konfigurasjoner, som regel relatert til hvordan applikasjonene skal snakke sammen, hvilke porter de skal kjøre på og annet.

## Troubleshooting

Hvis du har problemer med `import ...` er det sannsynligvis fordi modulene som er installert bare er installert i docker containeren, og ikke på din lokale PC.
For å få installert disse modulene lokalt må du først installere node.js, npm og yarn.

For å installere node og npm, se nodejs.org.
Etter disse er installert, kan du installere yarn med å skrive `npm i -g yarn` i terminalen/powershell.

Til slutt kan du da installere modulene med å skrive `yarn` også i terminal/powershell.

## Formattering og kodekvalitet

Til formattering og kodekvalitet brukes henholdsvis Prettier og ESLint.

### Formatter kode

`
yarn format:write
`

### Sjekk kodekvalitet

`
yarn lint
`

Anbefaler også å installere eslint og prettier extensions i VSCode, og sette formatOnSave instillingen til true i VSCode.

- https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

### I settings.json

```javascript
"editor.formatOnSave": true
```


