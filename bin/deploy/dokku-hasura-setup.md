# Dokku Setup Scripts

## GQL Frontposts API

```sh
dokku apps:create gql.frontposts

dokku domains:add gql.frontposts gql.frontposts.com

dokku config:set gql.frontposts \
HASURA_GRAPHQL_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
HASURA_GRAPHQL_ENABLE_CONSOLE="false" \
HASURA_GRAPHQL_METADATA_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
HASURA_GRAPHQL_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
PG_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
HASURA_GRAPHQL_DEV_MODE="true" \
HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log" \
HASURA_GRAPHQL_ADMIN_SECRET="aaa" \
HASURA_GRAPHQL_UNAUTHORIZED_ROLE="public" \
HASURA_GRAPHQL_JWT_SECRET="{ \"type\":\"RS256\", \"jwk_url\": \"https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com\", \"audience\": \"joblinkers\", \"issuer\": \"https://securetoken.google.com/joblinkers\" }"

dokku proxy:ports-set gql.frontposts http:80:8080

sudo docker pull hasura/graphql-engine:v2.6.0

sudo docker tag hasura/graphql-engine:v2.6.0 dokku/gql.frontposts
```

~~dokku tags:deploy gql.frontposts~~

```sh
dokku git:from-image gql.frontposts dokku/gql.frontpo
sts

dokku letsencrypt gql.frontposts
```

## Frontposts Website

```sh
dokku apps:create frontposts

dokku domains:add frontposts dev.frontposts.com

dokku config:set frontposts \
NEXT_PUBLIC_GQL_HOST="https://gql.frontposts.com" \
PG_DATABASE_URL="postgres://postgres:5005227a52c02361b7e95a1f5acfc7f0@efosa.me:44553/jobs_db" \
NEXTAUTH_URL="https://dev.frontposts.com" \
NEXTAUTH_SECRET="LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=" \
EMAIL_SERVER="smtp://efosao@gmail.com:frbxbjaompqgrwuv@smtp.gmail.com:587" \
EMAIL_FROM="efosao@gmail.com"

dokku letsencrypt frontposts
```
