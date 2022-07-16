# Dokku Setup Scripts

## GQL Vauntly API

```sh
dokku apps:create gql.vauntly

dokku domains:add gql.vauntly gql.vauntly.com

dokku config:set gql.vauntly \
HASURA_GRAPHQL_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
HASURA_GRAPHQL_ENABLE_CONSOLE="false" \
HASURA_GRAPHQL_METADATA_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
HASURA_GRAPHQL_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
PG_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
HASURA_GRAPHQL_DEV_MODE="true" \
HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log" \
HASURA_GRAPHQL_ADMIN_SECRET="aaa" \
HASURA_GRAPHQL_UNAUTHORIZED_ROLE="public" \
HASURA_GRAPHQL_JWT_SECRET="{ \"type\": \"HS256\", \"key\": \"cbbe419b7f66fbe846e5584cb5ea3629\" }"


dokku proxy:ports-set gql.vauntly http:80:8080

sudo docker pull hasura/graphql-engine:v2.6.2

sudo docker tag hasura/graphql-engine:v2.6.2 dokku/gql.vauntly
```

~~dokku tags:deploy gql.vauntly~~

```sh
dokku git:from-image gql.vauntly dokku/gql.vauntly

dokku letsencrypt gql.vauntly
```

## Vauntly Website

```sh
dokku apps:create vauntly

dokku domains:add vauntly stage.vauntly.com

dokku config:set vauntly \
DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
PG_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
NEXT_PUBLIC_GQL_HOST="https://gql.vauntly.com" \
NEXTAUTH_URL="https://stage.vauntly.com" \
NEXTAUTH_SECRET="cbbe419b7f66fbe846e5584cb5ea3629" \
ADMIN_EMAILS="efosao@gmail.com,efosao+33@gmail.com" \
EMAIL_SERVER="smtp://efosao@gmail.com:frbxbjaompqgrwuv@smtp.gmail.com:587" \
EMAIL_FROM="efosao@gmail.com"
GITHUB_ID="20848f635f0dfe62060a"
GITHUB_SECRET="7ba000545cf73a034df6823f8bb64f7c67e4a1cc"

dokku config:set vauntly \
DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db?connection_limit=2&pgbouncer=true" \
PG_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
NEXT_PUBLIC_GQL_HOST="https://gql.vauntly.com" \
ADMIN_EMAILS="efosao@gmail.com,efosao+33@gmail.com" \
EMAIL_SERVER="smtp://efosao@gmail.com:frbxbjaompqgrwuv@smtp.gmail.com:587" \
EMAIL_FROM="efosao@gmail.com" \
GITHUB_ID="20848f635f0dfe62060a" \
GITHUB_SECRET="7ba000545cf73a034df6823f8bb64f7c67e4a1cc" \
VERCEL_URL="stage.vauntly.com" \
GOOGLE_CLIENT_ID="579525507015-iikf8cgm7s7oussn7pgrk46v7nc8h12e.apps.googleusercontent.com" \
GOOGLE_CLIENT_SECRET="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" \
NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG="apiKey=AIzaSyCYjCX-m3_ERqSoEUdrJprlQuL8Nj2NO6A&appId=1%3A969593951834%3Aweb%3A1452aa710d9ea8543eea63&authDomain=vauntly-9ddae.firebaseapp.com&databaseURL=https%3A%2F%2Fvauntly-9ddae-default-rtdb.firebaseio.com&measurementId=G-XQN49V89YT&messagingSenderId=969593951834&projectId=vauntly-9ddae&storageBucket=vauntly-9ddae.appspot.com"


dokku letsencrypt vauntly
```
