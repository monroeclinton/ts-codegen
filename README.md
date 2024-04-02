# ts-codegen

## Input

```ts
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

## Output

```js
function example(id, slug) {
    return fetch("https://example.com/api/" + new URLSearchParams({ id, slug }));
}
```
