import { Container } from "@/components/container";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-beige-200 bg-beige-100">
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-navy-700">{description}</p>}
      </Container>
    </div>
  );
}
