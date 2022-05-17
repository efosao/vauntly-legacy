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
HASURA_GRAPHQL_JWT_SECRET: "{ \"type\": \"HS256\", \"key\": \"cbbe419b7f66fbe846e5584cb5ea3629\" }"

dokku proxy:ports-set gql.vauntly http:80:8080

sudo docker pull hasura/graphql-engine:v2.6.0

sudo docker tag hasura/graphql-engine:v2.6.0 dokku/gql.vauntly
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
NEXT_PUBLIC_GQL_HOST="https://gql.frontposts.com" \
PG_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
NEXTAUTH_URL="https://stage.vauntly.com" \
NEXTAUTH_SECRET="cbbe419b7f66fbe846e5584cb5ea3629" \
ADMIN_EMAILS="efosao@gmail.com,efosao+33@gmail.com" \
EMAIL_SERVER="smtp://efosao@gmail.com:frbxbjaompqgrwuv@smtp.gmail.com:587" \
EMAIL_FROM="efosao@gmail.com"

dokku letsencrypt vauntly
```
