import type { Metadata } from "next";
import { AssignmentPage } from "@/components/assignment-page";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "과제 제출",
  description: "코칭 과제를 제출하고 피드백을 확인하세요.",
  robots: { index: false, follow: false },
};

export default function AssignmentsPage() {
  const programs = getServices().map((service) => ({ slug: service.slug, title: service.title }));
  return (
    <>
      <PageHeader title="과제 제출" description="코칭 과제를 제출하고 코치의 피드백을 확인하세요." />
      <Container className="mt-10">
        <AssignmentPage programs={programs} />
      </Container>
    </>
  );
}
