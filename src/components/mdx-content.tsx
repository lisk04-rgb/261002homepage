import { MDXRemote } from "next-mdx-remote/rsc";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} />
    </div>
  );
}
