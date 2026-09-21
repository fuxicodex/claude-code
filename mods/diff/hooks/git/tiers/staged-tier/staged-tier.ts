import type Types from '../../types'
import Probes from '../../probes'
import { diffDataOf } from '../diff-data-of'
import { unbornTier } from '../unborn-tier'
import { mergedResultOf } from '../with-untracked/merged-result-of'

/**
 * Staged mode: the index against HEAD, the built-in panel's cached tier.
 *
 * Rather than the working tree, `git diff --cached` compares what is staged;
 * a file edited after staging has no honest body, so its hunks read against
 * `--cached` too. Untracked files are not staged, so none are merged in: the
 * rows are the tracked ones alone. An unborn HEAD (where `--cached` would
 * compare against nothing) falls to unbornTier, which marks the rows unborn
 * and folds unstaged edits in.
 *
 * @param context the fetch
 * @returns the outcome
 */
export async function stagedTier(
  context: Types.FetchContext,
): Promise<Types.FetchOutcome> {
  if (await Probes.isUnbornHead(context.run)) {
    return unbornTier(context)
  }

  const staged = await Probes.statsOf(context, '--cached')

  if (!staged) {
    return { kind: 'unavailable' }
  }

  return {
    kind: 'data',
    data: diffDataOf(
      context,
      mergedResultOf(staged, { isUntrackedWithheld: false }),
      {
        source: { kind: 'working-tree', base: 'HEAD' },
        baseRef: '--cached',
        isUnborn: false,
        stalePaths: [],
      },
    ),
  }
}