# Dockerizing RethinkDB/GraphQL

I threw this repo together to work through some things I wanted to familiarize myself with and I'm only keeping it for reference and future experimentation, **I would not recommend you use this for anything**.

## The Goal

I set out to get RethinkDB running in a container and consume it through an apollo-express graphQL server which is then consumed by a web application, which is also running in a container.

All of this was in an effort to work through using docker-compose to get 3 dockerized tiers working together.

## Issues

There are several issues and additions I'm going to work through when I have time.

1. Moving the webpack build into the container for the client, right now I run it externally for dev purposes. I'd like to continue to have that option, but also get a build running in the container (current setup has some path related issues & can probably be fixed with some `path.join(__dirname, ...)` in place of relative paths containing directory names which don't map to what's in the container)
2. Separate the projects. Right now, there is a single, shared set of dependencies but that doesn't really make sense for these. Making the deps project specific would lead to additional images, but they would have only what they need... `React` on the GraphQL server is pointless.
3. There is currently an issue where changing dependencies requires images to be deleted and rebuilt or the package.json is cached and updates aren't respected in the install step. This makes this setup quite tedious for a dev setup
4. Seeding the database is currently just a specific endpoint that I post to... thsi is very much a quick hack and it would be nicer to do this as part of the container startup... I can think of a few ways to do this, I just skipped it in the interest of time.

## Notes

Just some thoughts and lessons learned going through this process:

- RethinkDB is still awesome
- [ ] - I need to add some mutations to this
- [ ] - I need to add a subscription to this
- Apollo makes getting a GraphQL server up and running nice and simple
