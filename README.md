# websocket-chat

> A tiny live chat app using Svelte & socket.io

## Development

This app assumes a few things:

-   port 3001 is available
-   redis is available and running on the default port (6379)
-   you don't have high expectations

Assuming all of the above requirements are met, you can set this project app with the following commands:

```bash
# if you dont have pnpm already, install it
npm install -g pnpm@6

# clone the repo
git clone git@github.com:rayzr522/websocket-chat.git
cd websocket-chat

# install dependencies
pnpm install

# run the dev server
pnpm dev

# alternatively, make a production build
pnpm build
pnpm start
```

You can now access the chat app at http://localhost:3001
