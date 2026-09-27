const NBSP = ' ';

/** French typography: a no-break space before : ; ? ! so they never start a line. */
export function frenchSpacing(text: string): string {
  return text.replace(/[  ]*([:;?!])(?=\s|$)/g, (match, mark: string, offset: number) =>
    offset === 0 ? match : `${NBSP}${mark}`,
  );
}

interface TextNode {
  type: string;
  value?: string;
  children?: TextNode[];
}

/** Remark plugin: applies frenchSpacing to every text node of a Markdown file. */
export function remarkFrenchSpacing() {
  const visit = (node: TextNode) => {
    if (node.type === 'text' && typeof node.value === 'string') node.value = frenchSpacing(node.value);
    node.children?.forEach(visit);
  };
  return (tree: TextNode) => visit(tree);
}
