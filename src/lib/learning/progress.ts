import type { LearningPath } from "@/lib/learning/paths";

export const LEARNING_PROGRESS_STORAGE_KEY =
  "trading-guide-learning-progress-v1";
export const LEARNING_PROGRESS_EVENT = "trading-guide-learning-progress-change";

export type StoredPathProgress = {
  completedLessonIds: string[];
  lastVisitedLessonId?: string;
  updatedAt: string;
};

export type StoredLearningProgress = {
  version: 1;
  paths: Record<string, StoredPathProgress>;
};

export const EMPTY_LEARNING_PROGRESS: StoredLearningProgress = {
  version: 1,
  paths: {},
};

let cachedRaw: string | null | undefined;
let cachedProgress: StoredLearningProgress = EMPTY_LEARNING_PROGRESS;

export function readLearningProgress(): StoredLearningProgress {
  if (typeof window === "undefined") return EMPTY_LEARNING_PROGRESS;
  try {
    const raw = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
    if (raw === cachedRaw) return cachedProgress;

    cachedRaw = raw;
    if (!raw) {
      cachedProgress = EMPTY_LEARNING_PROGRESS;
      return cachedProgress;
    }

    const parsed = JSON.parse(raw) as StoredLearningProgress;
    if (
      parsed?.version !== 1 ||
      !parsed.paths ||
      typeof parsed.paths !== "object"
    ) {
      cachedProgress = EMPTY_LEARNING_PROGRESS;
      return cachedProgress;
    }

    cachedProgress = parsed;
    return cachedProgress;
  } catch {
    cachedRaw = undefined;
    cachedProgress = EMPTY_LEARNING_PROGRESS;
    return cachedProgress;
  }
}

export function getLearningProgressServerSnapshot(): StoredLearningProgress {
  return EMPTY_LEARNING_PROGRESS;
}

export function subscribeToLearningProgress(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(LEARNING_PROGRESS_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LEARNING_PROGRESS_EVENT, handleChange);
  };
}

function writeLearningProgress(progress: StoredLearningProgress) {
  window.localStorage.setItem(
    LEARNING_PROGRESS_STORAGE_KEY,
    JSON.stringify(progress)
  );
  window.dispatchEvent(new Event(LEARNING_PROGRESS_EVENT));
}

export function markLessonVisited(pathId: string, lessonId: string) {
  if (typeof window === "undefined") return;
  const progress = readLearningProgress();
  const current = progress.paths[pathId];
  if (current?.lastVisitedLessonId === lessonId) return;
  writeLearningProgress({
    ...progress,
    paths: {
      ...progress.paths,
      [pathId]: {
        completedLessonIds: current?.completedLessonIds ?? [],
        lastVisitedLessonId: lessonId,
        updatedAt: new Date().toISOString(),
      },
    },
  });
}

export function setLessonCompleted(
  pathId: string,
  lessonId: string,
  completed: boolean
) {
  if (typeof window === "undefined") return;
  const progress = readLearningProgress();
  const current = progress.paths[pathId];
  const ids = new Set(current?.completedLessonIds ?? []);
  if (completed) {
    ids.add(lessonId);
  } else {
    ids.delete(lessonId);
  }
  writeLearningProgress({
    ...progress,
    paths: {
      ...progress.paths,
      [pathId]: {
        completedLessonIds: [...ids],
        lastVisitedLessonId: lessonId,
        updatedAt: new Date().toISOString(),
      },
    },
  });
}

export function getPathProgress(
  path: LearningPath,
  progress: StoredLearningProgress
) {
  const stored = progress.paths[path.id];
  const completed = new Set(stored?.completedLessonIds ?? []);
  const completedCount = path.lessons.filter((lesson) =>
    completed.has(lesson.id)
  ).length;
  const lastVisitedIndex = stored?.lastVisitedLessonId
    ? path.lessons.findIndex(
        (lesson) => lesson.id === stored.lastVisitedLessonId
      )
    : -1;
  const firstIncompleteIndex = path.lessons.findIndex(
    (lesson) => !completed.has(lesson.id)
  );
  const resumeIndex =
    firstIncompleteIndex >= 0
      ? Math.max(
          firstIncompleteIndex,
          lastVisitedIndex >= 0 &&
            !completed.has(path.lessons[lastVisitedIndex].id)
            ? lastVisitedIndex
            : 0
        )
      : path.lessons.length - 1;
  return {
    completed,
    completedCount,
    percent: path.lessons.length
      ? Math.round((completedCount / path.lessons.length) * 100)
      : 0,
    resumeLesson: path.lessons[Math.max(0, resumeIndex)],
    isComplete: completedCount === path.lessons.length,
  };
}
