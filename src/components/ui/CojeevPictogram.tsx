import { createElement, type ReactNode } from "react";
import { cojeevGlyphs } from "./cojeev-glyphs";

type GlyphNode = {
  tag: "path" | "circle" | "line" | "rect" | "ellipse" | "polyline" | "polygon";
  attrs: Readonly<Record<string, string>>;
  children: readonly GlyphNode[];
};

export type CojeevPictogramName = keyof typeof cojeevGlyphs;

function renderNode(node: GlyphNode, key: string): ReactNode {
  return createElement(
    node.tag,
    { ...node.attrs, key },
    ...node.children.map((child, index) =>
      renderNode(child, `${key}-${index}`),
    ),
  );
}

/** Selected, locally bundled geometry from the MIT licensed 000h icon library. */
export function CojeevPictogram({
  name,
  size = 24,
  tone = "forest",
  className = "",
}: {
  name: CojeevPictogramName;
  size?: number;
  tone?: "forest" | "sage" | "orange" | "ivory";
  className?: string;
}) {
  const nodes: readonly GlyphNode[] = cojeevGlyphs[name];
  return (
    <span
      className={`cojeev-pictogram cojeev-pictogram-${tone} ${className}`}
      data-cojeev-icon={name}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {nodes.map((node, index) => renderNode(node, `${name}-${index}`))}
      </svg>
    </span>
  );
}
