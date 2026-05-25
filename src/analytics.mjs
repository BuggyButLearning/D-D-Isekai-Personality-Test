import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    persistence: "memory",
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
  });
  initialized = true;
}

export function trackTestComplete({ result, answers }) {
  if (!initialized) return;
  posthog.capture("test_completed", {
    top_class: result.topClass,
    second_class: result.secondClass,
    top_subclass: result.topSubclass,
    is_multiclass: result.isMulticlass,
    trait_badges: result.traitBadges,
    tb_fired: result.tbFired,
    sub_qs_fired: result.subQsFired,
    answers,
    answers_count: Object.keys(answers).length,
    app_version: typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : null,
  });
}
