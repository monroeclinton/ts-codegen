# ts-codegen

This project generates JavaScript SDK code from a JSDoc. I output JavaScript because it requires the least setup for this demo.

## Structure

- [main.ts](https://github.com/monroeclinton/ts-codegen/blob/main/main.ts): Contains the transformer and reads input from `example.ts` and outputs to `example.js`.
- [codegen.ts](https://github.com/monroeclinton/ts-codegen/blob/main/codegen.ts): Performs codegen by inserting a formatted AST structure that produces a function that does a `fetch` request with the `get` method into TS AST.

## Example

The user sets the structure of the generated code with JSDoc beginning with @sdk.
The transformer takes the JSDoc and transforms it into code.

### Input

```ts
// example.ts

/**
 * @sdkfunction example
 * @sdkurl https://example.com/api/
 * @sdkparams id
 * @sdkparams slug
 */
function route(id: number, slug: string) {
    // Some server code
}
```

### Output

```js
// example.js

function example(id, slug) {
    return fetch("https://example.com/api/" + new URLSearchParams({ id, slug }));
}
```

## Running

First install TypeScript and ts-node
```
npm i
```

Then run the transformer
```
npm run transpile
```
