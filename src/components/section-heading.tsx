type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, id, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="text-sm font-semibold tracking-wide text-terracotta-700">{eyebrow}</p>}
      <h2 id={id} className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-navy-700">{description}</p>}
    </div>
  );
}
