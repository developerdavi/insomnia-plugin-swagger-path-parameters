module.exports.requestHooks = [
  (context) => {
    const url = new URL(context.request.getUrl());

    const params = context.request.getParameters();

    for (const { name, value } of params) {
      if (!name) continue;

      const toReplace = `(?<!{){${name}}(?!})`;
      let path = decodeURIComponent(url.pathname);

      const regex = RegExp(toReplace);

      if (!regex.test(path)) {
        // Not found in URL, treat as regular parameter
        continue;
      }

      while (regex.test(path)) {
        path = path.replace(regex, value);
      }

      url.pathname = path;
      context.request.removeParameter(name);
    }

    context.request.setUrl(url.toString());
  },
];
