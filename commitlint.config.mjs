export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scope is always required — 42 commits without scope in audit
    'scope-empty': [2, 'never'],

    // Reject empty messages like "fix: test", "fix: ci issues"
    'subject-min-length': [2, 'always', 15],

    // Conventional Commits types used in this project
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
  },
};
