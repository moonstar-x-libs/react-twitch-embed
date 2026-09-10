# react-twitch-embed

A collection of components to embed Twitch.

For more information, visit the [Embedding Twitch](https://dev.twitch.tv/docs/embed) documentation page.

Make sure to check out the [Demo and Documentation](https://docs.moonstar-x.dev/react-twitch-embed) page for more information on the usage of the components,
alongside a description on all the supported props for each component.

## Installation

```text
npm install react-twitch-embed
```

This package ships both an ESM and a CommonJS build alongside its own type declarations, and it supports
React 18 and React 19. `react` and `react-dom` are peer dependencies, so they are not installed for you.

## A Note on Typings

This package includes some typings for the `Embed` and `Player` constructors that are downloaded automatically
into the browser's `window` object. These are unofficial typings that I made empirically, some of them might not be accurate.

The documentation on Twitch's official page is incomplete in various aspects, and a lot of the functionality included
in this package was found by arbitrarily and through trial and error.

If you find any inconsistency with the typings provided by this package, feel free to open a
[Pull Request](https://github.com/moonstar-x/react-twitch-embed).

## A Note on the `parent` Prop

Twitch requires that any embeds include the URL of the parent site that embeds their content. These components will get this
parent URL through `window.location.hostname` for non-interactive components (those components that are essentially just an `iframe`),
while the interactive ones get the parent automatically (possible through the same property) by their respective constructor.

As such, you shouldn't need to specify this prop for any of the components, unless you run a particular setup with multiple domains.

## FAQ

* **Between `TwitchEmbed`, `TwitchPlayer` and `TwitchPlayerNonInteractive`, which component should I choose?**
> Out of these components, `TwitchEmbed` and `TwitchPlayer` are both interactive components, meaning that they expose the internal
> instance through their respective events. Both of these components support streams, VODs and collections, and they both react
> efficiently when their `channel`, `video`, or `collection` props change by using the internal API instead of recreating the embed
> when they change. The key difference is that `TwitchEmbed` can include the live chat on streams. At the end of the day, it depends
> on which one you prefer.
>
> As for `TwitchPlayerNonInteractive`, this component can embed streams, VODs and collections too, but it does not include an internal
> API. This means that channel, video or collection switching is not "smooth" and will recreate the embed. However, this component does
> not download anything extra, it does not create any additional nodes on the body document, so it is probably less resource heavy.

* **Why are there `TwitchClip` and `TwitchPlayer`?**
> `TwitchClip` will only work for clips whereas`TwitchPlayer` will work for VODs, collections and streams.

* **I'm using multiple embeds simultaneously, why are they sticking next to each other?**
> In the case of `TwichEmbed` and `TwitchPlayer`, these components need an `id` prop to work because the internal API
> mounts its respective `iframe` inside a `div` queried by its `id`. These components will use a default `id` if it's not
> provided in their props. If you're displaying multiple embeds simultaneously then you should provide a static `id`. Try
> not to use the name of the channel as an `id` because in the case that this prop changes, the embed will be recreated and
> the internal API won't be used for the channel switching.

* **What does smooth switching mean?**
> For the `TwitchEmbed` and `TwitchPlayer` components, when updating their `channel`, `video` and/or `collection` props,
> the player will not be recreated and instead the internal API will be used to update this data.

* **When is the embed recreated?**
> Only when the `id` or one of the options that the Twitch constructor owns changes: `allowFullscreen`, `autoplay`,
> `muted`, `parent`, `time`, `hideControls`, plus `withChat` and `darkMode` for `TwitchEmbed` and `playsInline` for
> `TwitchPlayer`. Media props are switched through the internal API, and everything else (event handlers, `height`,
> `width`, `className`, `style`, and any other prop forwarded to the `div`) never recreates it. This means inline
> arrow functions as event handlers are safe: the latest one is always the one that gets called.

## Testing

You can run the tests for this package by running:

```text
npm test
```

Or leave the watcher running with:

```text
npm run test:watch
```

## Developing

When developing, you can use Storybook as a way to check the components and test them. You can run the Storybook server with:

```text
npm run storybook:serve
```

Also, make sure that your code lints and type checks properly with:

```text
npm run lint
npm run typecheck
```
