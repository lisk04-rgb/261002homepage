"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import { LoginPrompt } from "@/components/login-prompt";
import {
  ASSIGNMENT_CONTENT_MAX,
  ASSIGNMENT_TITLE_MAX,
  WEEK_OPTIONS,
  assignmentInputSchema,
} from "@/lib/assignment";
import { describeFirebaseError } from "@/lib/firebase/errors";
import type { Submission } from "@/lib/firebase/submissions";
import { formatDate } from "@/lib/format";

type Program = { slug: string; title: string };
type Tab = "submit" | "history";

const loadSubmissions = () => import("@/lib/firebase/submissions");

export function AssignmentPage({ programs }: { programs: Program[] }) {
  const { enabled, user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("submit");
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const { fetchMySubmissions } = await loadSubmissions();
      setSubmissions(await fetchMySubmissions(user.uid));
      setLoadError(false);
    } catch (error) {
      console.error(error);
      setLoadError(true);
      setSubmissions([]);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!enabled) return <p className="text-navy-700">과제 제출 기능이 아직 준비 중이에요.</p>;
  if (loading) return <p role="status" className="text-navy-700">불러오는 중…</p>;
  if (!user) return <LoginPrompt message="과제 제출은 로그인한 뒤 할 수 있어요. 제출 내용은 본인과 운영자만 볼 수 있어요." />;

  const programTitle = (slug: string) => programs.find((program) => program.slug === slug)?.title ?? slug;
  const weekLabel = (week: number) => WEEK_OPTIONS.find((option) => option.value === week)?.label ?? "";

  const tabClass = (value: Tab) =>
    `min-h-11 rounded-full px-5 font-semibold ${
      tab === value ? "bg-navy-900 text-white" : "border border-beige-300 bg-white text-navy-700 hover:border-navy-500"
    }`;

  return (
    <div>
      <div role="group" aria-label="과제 메뉴" className="flex gap-2">
        <button type="button" aria-pressed={tab === "submit"} onClick={() => setTab("submit")} className={tabClass("submit")}>
          과제 제출
        </button>
        <button type="button" aria-pressed={tab === "history"} onClick={() => setTab("history")} className={tabClass("history")}>
          제출 내역 {submissions ? <span aria-label={`${submissions.length}건`}>({submissions.length})</span> : null}
        </button>
      </div>

      <div className="mt-8">
        {tab === "submit" ? (
          <SubmitForm
            programs={programs}
            user={{ uid: user.uid, displayName: user.displayName }}
            onSubmitted={async () => {
              await refresh();
              setTab("history");
            }}
          />
        ) : (
          <section aria-labelledby="history-title">
            <h2 id="history-title" className="sr-only">
              제출 내역
            </h2>
            {submissions === null ? (
              <p role="status" className="text-navy-700">불러오는 중…</p>
            ) : loadError ? (
              <p role="alert" className="rounded-xl bg-beige-100 p-6 text-navy-700">
                제출 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
              </p>
            ) : submissions.length === 0 ? (
              <p className="rounded-xl bg-beige-100 p-8 text-center text-navy-700">아직 제출한 과제가 없어요.</p>
            ) : (
              <ul className="space-y-4">
                {submissions.map((submission) => (
                  <li key={submission.id} className="rounded-2xl bg-white p-5 ring-1 ring-beige-200">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-navy-900">{submission.title}</p>
                      <span className="rounded-full bg-beige-100 px-3 py-1 text-sm text-navy-700">
                        {submission.feedback ? "피드백 완료" : "검토 대기"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-navy-500">
                      {programTitle(submission.program)}
                      {weekLabel(submission.week) && ` · ${weekLabel(submission.week)}`} ·{" "}
                      <time dateTime={submission.date}>{formatDate(submission.date)}</time>
                    </p>
                    <p className="mt-3 break-words whitespace-pre-wrap text-navy-700">{submission.content}</p>
                    {submission.link && (
                      <p className="mt-2 text-sm">
                        <a
                          href={submission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-terracotta-700 underline"
                        >
                          첨부 링크 열기
                        </a>
                      </p>
                    )}
                    {submission.feedback && (
                      <div className="mt-4 rounded-xl bg-beige-100 p-4">
                        <p className="text-sm font-semibold text-navy-900">코치 피드백</p>
                        <p className="mt-1 break-words whitespace-pre-wrap text-navy-700">{submission.feedback}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function SubmitForm({
  programs,
  user,
  onSubmitted,
}: {
  programs: Program[];
  user: { uid: string; displayName: string | null };
  onSubmitted: () => Promise<void>;
}) {
  const [program, setProgram] = useState(programs.find((item) => item.slug.includes("coaching"))?.slug ?? programs[0]?.slug ?? "");
  const [week, setWeek] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = assignmentInputSchema.safeParse({ program, week, title, content, link });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { createSubmission } = await loadSubmissions();
      await createSubmission(user, parsed.data);
      setTitle("");
      setContent("");
      setLink("");
      await onSubmitted();
    } catch (submitError) {
      console.error(submitError);
      setError(describeFirebaseError(submitError, "제출하지 못했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      setSubmitting(false);
    }
  };

  const field = "mt-1 block w-full rounded-lg border border-beige-300 bg-white px-3 text-navy-900";

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="a-program" className="text-sm font-medium text-navy-900">
            프로그램
          </label>
          <select id="a-program" value={program} onChange={(event) => setProgram(event.target.value)} className={`${field} min-h-11`}>
            {programs.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="a-week" className="text-sm font-medium text-navy-900">
            주차
          </label>
          <select id="a-week" value={week} onChange={(event) => setWeek(Number(event.target.value))} className={`${field} min-h-11`}>
            {WEEK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="a-title" className="text-sm font-medium text-navy-900">
          제목
        </label>
        <input id="a-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={ASSIGNMENT_TITLE_MAX} className={`${field} min-h-11`} />
      </div>
      <div>
        <label htmlFor="a-content" className="text-sm font-medium text-navy-900">
          과제 내용
        </label>
        <textarea
          id="a-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={ASSIGNMENT_CONTENT_MAX}
          rows={10}
          aria-describedby="a-content-help"
          className={`${field} p-3`}
        />
        <p id="a-content-help" className="mt-1 text-sm text-navy-500">
          {content.length}/{ASSIGNMENT_CONTENT_MAX}자 · 계좌번호·주민번호 등 민감한 정보는 적지 마세요.
        </p>
      </div>
      <div>
        <label htmlFor="a-link" className="text-sm font-medium text-navy-900">
          첨부 링크 (선택)
        </label>
        <input
          id="a-link"
          type="url"
          inputMode="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://docs.google.com/…"
          aria-describedby="a-link-help"
          className={`${field} min-h-11`}
        />
        <p id="a-link-help" className="mt-1 text-sm text-navy-500">
          파일은 구글 드라이브·노션 등에 올리고 &lsquo;링크가 있는 사용자 보기&rsquo; 권한으로 공유한 주소를 붙여 주세요.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-terracotta-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 rounded-full bg-terracotta-600 px-8 font-semibold text-white hover:bg-terracotta-700 disabled:opacity-60"
      >
        {submitting ? "제출 중…" : "제출하기"}
      </button>
    </form>
  );
}
