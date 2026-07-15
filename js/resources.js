const RESOURCE_RULES = [
  { pattern: /docs\/day01_detailed_guide\.md/i, url: "docs/day01_detailed_guide.md" },
  { pattern: /Hands-on ML/i, url: "https://github.com/ageron/handson-mlp" },
  { pattern: /LLMs-from-scratch/i, url: "https://github.com/rasbt/LLMs-from-scratch" },
  { pattern: /nanoChat/i, url: "https://github.com/karpathy/nanochat" },
  { pattern: /System-Design Primer/i, url: "https://github.com/donnemartin/system-design-primer" },
  { pattern: /System design|URL shortener|Twitter timeline|Web crawler|realtime_ml_inference|scaling follow-ups/i, url: "https://github.com/donnemartin/system-design-primer" },
  { pattern: /Data-Science-Interview-Q&A/i, url: "https://github.com/youssefHosni/Data-Science-Interview-Questions-Answers" },
  { pattern: /MLJobSearch/i, url: "https://github.com/TidorP/MLJobSearch2025" },
  { pattern: /Simplilearn/i, url: "https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions" },
  { pattern: /LeetCode\s+(\d+)/i, url: match => `https://leetcode.com/problems/${LEETCODE_SLUGS[match[1]] || ""}` },
  { pattern: /LinkedIn Learning/i, url: "https://www.linkedin.com/learning/agentic-ai-fundamentals-architectures-frameworks-and-applications/what-is-agentic-ai" },
  { pattern: /Microsoft lesson|Microsoft lessons/i, url: "https://github.com/microsoft/ai-agents-for-beginners" },
  { pattern: /behavior|STAR|Tell me about yourself|Why this role|Why this company|ownership|failure\/risk|collaboration\/conflict|ambiguity|communication|filler words/i, url: "https://docs.google.com/document/d/e/2PACX-1vTG_14sE1SLYHCcjDmh8X3yFFIdlqTpo37MlJ-Tba_pHWDr5xgU4EAzC2tIxFEsKi2qLlhB1ssoBhFn/pub" },
  { pattern: /LinkedIn jobs|Search LinkedIn|Prioritize .* on LinkedIn/i, url: "https://www.linkedin.com/jobs/" },
  { pattern: /Lever/i, url: "https://jobs.lever.co/" },
  { pattern: /Wellfound/i, url: "https://wellfound.com/jobs" },
  { pattern: /YC Startup Job Board|YC board|YC startups/i, url: "https://www.ycombinator.com/jobs" },
  { pattern: /GitHub Hiring-ML/i, url: "https://github.com/labuladong/fucking-algorithm/blob/master/job/hiring-ml.md" }
];

const LEETCODE_SLUGS = {
  1: "two-sum",
  3: "longest-substring-without-repeating-characters",
  15: "3sum",
  20: "valid-parentheses",
  33: "search-in-rotated-sorted-array",
  53: "maximum-subarray",
  56: "merge-intervals",
  121: "best-time-to-buy-and-sell-stock",
  200: "number-of-islands",
  238: "product-of-array-except-self",
  322: "coin-change",
  704: "binary-search",
  973: "k-closest-points-to-origin"
};

/** Returns a URL for tasks that reference an external resource. */
export function getResourceUrl(task) {
  for (const rule of RESOURCE_RULES) {
    const match = task.match(rule.pattern);
    if (!match) continue;
    return typeof rule.url === "function" ? rule.url(match) : rule.url;
  }
  return "";
}
