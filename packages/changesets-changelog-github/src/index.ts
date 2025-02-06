import changelogFunctions from '@changesets/changelog-github';
import { getInfo } from '@changesets/get-github-info';

const modified = {
  ...changelogFunctions,
  async getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
      );
    }

    if (dependenciesUpdated.length === 0) return '';

    const commits = (
      await Promise.all(
        changesets
          .filter((cs) => cs.commit)
          .map((cs) => getInfo({ repo: options.repo, commit: cs.commit! }))
      )
    )
      .map((r) => r.links.commit)
      .filter(Boolean)
      .join(', ');

    return `- Dependencies ${commits ? `[${commits}]` : ''}:`;
  }
} satisfies typeof changelogFunctions;

export default modified as any;
