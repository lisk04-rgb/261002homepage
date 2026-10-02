/** Firebase 오류 코드를 사용자(관리자)가 원인을 알 수 있는 한국어 안내로 바꾼다. */
export function describeFirebaseError(error: unknown, fallback: string): string {
  const code = (error as { code?: string } | null)?.code ?? "";
  switch (code) {
    case "permission-denied":
      return "권한이 없어 저장하지 못했어요. (관리자: Firestore 규칙을 최신 firestore.rules로 게시했는지 확인해 주세요.)";
    case "unauthenticated":
      return "로그인이 만료됐어요. 로그인한 뒤 다시 시도해 주세요.";
    case "unavailable":
    case "deadline-exceeded":
      return "네트워크 연결이 불안정해요. 잠시 후 다시 시도해 주세요.";
    case "not-found":
    case "failed-precondition":
      return "데이터베이스가 준비되지 않았어요. (관리자: Firebase 콘솔에서 Firestore Database를 만들었는지 확인해 주세요.)";
    default:
      return fallback;
  }
}
