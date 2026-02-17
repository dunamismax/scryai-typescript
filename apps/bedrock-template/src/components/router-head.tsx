import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  const canonicalUrl = `${loc.url.origin}${loc.url.pathname}`;

  return (
    <>
      <title>{head.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="color-scheme" content="dark light" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#060a13" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f3f7ff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((meta) => (
        <meta key={meta.key} {...meta} />
      ))}

      {head.links.map((link) => (
        <link key={link.key} {...link} />
      ))}

      {head.styles.map((style) => (
        <style
          key={style.key}
          {...style.props}
          {...(style.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: style.style })}
        />
      ))}
    </>
  );
});
