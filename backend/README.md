# Backendtjeneste

Dette er et API styrt av Express.js.

# Database

## Kjøre databasen lokalt

Hvis du helst vil kjøre databasen lokalt, må du først installere postgres her: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Når postgres er ferdig installert kan du lage en tom database der du vil lagre data, enten via pgAdmin (GUI) eller psql (kommandolinje).

Etter det må du lage en `.env`-fil i backend mappa som bør se slik ut:

```
DB_DATABASE="din_database"
DB_USERNAME="postgres"
DB_PASSWORD="ditt_passord"
DB_HOST="localhost"
POSTGRES_PORT=5432
```

(bytt din_database med navnet på databasen du opprettet, og ditt_password med passordet du valgte for postgres)

Til slutt må du "migrate" de nyeste endringene til databasen din lokalt (se nedenfor).

## Migrations

Les om hvordan migrations fungerer her: https://jaygould.co.uk/2018-06-11-sequelize-setup-sync-migrations-postgres

Kort forklart: migrations er version-control for databasen

### For å gjøre migrations må man installere sequelize-cli globalt:

```
npm i sequelize-cli -g
```

### For å gjøre en ny migration:

Lokalt:

```
sequelize db:migrate
```

I docker:

```
yarn db:migrate
```

### For å gå tilbake til en tidligere migration:

Lokalt:

```
sequelize db:migrate:undo
```

I docker:

```
yarn db:migrate:undo
```

### For å reversere alle migrations:

Lokalt:

```
sequelize db:migrate:undo:all
```

I docker:

```
yarn db:migrate:undo:all
```
