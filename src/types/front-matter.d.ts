declare module "front-matter" {
  interface FrontMatterResult<T> {
    attributes: T;
    body: string;
  }

  function parse<T = Record<string, any>>(
    content: string
  ): FrontMatterResult<T>;
  export = parse;
}
