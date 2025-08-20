import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 연속 클릭 방지 유틸: 호출 중이거나 쿨다운 동안 추가 호출을 무시합니다.
export function preventRapidClicks<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn | Promise<TReturn>,
  cooldownMs = 600
) {
  let isCooling = false;

  return (...args: TArgs): (TReturn | Promise<TReturn>) | undefined => {
    if (isCooling) return undefined as unknown as TReturn | Promise<TReturn>;
    isCooling = true;

    try {
      const result = fn(...args);

      // Promise 작업이면 완료 후 쿨다운 해제
      if (result instanceof Promise) {
        return result.finally(() => {
          isCooling = false;
        });
      }

      // 동기 작업이면 타이머로 쿨다운 해제
      setTimeout(() => {
        isCooling = false;
      }, cooldownMs);

      return result;
    } catch (error) {
      isCooling = false;
      throw error;
    }
  };
}
