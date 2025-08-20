import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 연속 클릭 방지 유틸: 호출 중이거나 쿨다운 동안 추가 호출을 무시합니다.
export function preventRapidClicks<T extends (...args: any[]) => any>(
  fn: T,
  cooldownMs = 600
) {
  let isCooling = false;

  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (isCooling) return undefined as unknown as ReturnType<T>;
    isCooling = true;

    try {
      const result = fn(...args);

      // Promise-like 작업이면 완료 후 쿨다운 해제
      if (result && typeof (result as any).finally === "function") {
        (result as any).finally(() => {
          isCooling = false;
        });
      } else {
        // 동기 작업이면 타이머로 쿨다운 해제
        setTimeout(() => {
          isCooling = false;
        }, cooldownMs);
      }

      return result as ReturnType<T>;
    } catch (error) {
      isCooling = false;
      throw error;
    }
  };
}
