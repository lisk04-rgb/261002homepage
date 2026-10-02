import type { Metadata } from "next";
import { CalendarView } from "@/components/calendar-view";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";
import { PageHeader } from "@/components/page-header";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "일정",
  description: "서비스 런칭, 모집, 코칭 시작일 등 주요 일정을 달력으로 확인하세요.",
  alternates: { canonical: "/calendar" },
};

export default function CalendarPage() {
  return (
    <>
      <PageHeader title="일정" description="서비스 런칭, 모집, 코칭 시작일 등 주요 일정을 확인하세요." />
      <Container className="mt-10">
        <CalendarView events={getEvents()} />
      </Container>
      <CtaBanner />
    </>
  );
}
