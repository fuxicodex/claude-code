/**
 * What the diff compares the working tree against: HEAD partitioned by the
 * session's start, HEAD plainly, the index (what is staged), or the
 * merge-base with the default branch.
 */
export type BaseMode = 'session' | 'uncommitted' | 'staged' | 'branch'
