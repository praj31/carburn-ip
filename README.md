## Getting Started

1. Clone the repository
2. Make sure you have Node >= v16.14 install on your system.
3. Check if you have `yarn` installed on your system. If not, install it.
4. Run `yarn` in the root folder from your terminal. This will install all the dependencies.
5. To start the development server, run `yarn dev`. The server starts on `http://localhost:3000`.

## VSCode Settings

Install the following extensions:
- IntelliCode by Microsoft
- JavaScript and TypeScript Nightly by Microsoft
- Path Intellisense by Christian Kohler
- Prettier by Prettier
- Tailwind CSS Intellisense by Tailwind Labs

Optional extensions (good to have):
- GitLens by GitKraken

## Rules for GitHub
1. Always create a new branch when working on your task.
2. The branch must be created from the `dev` branch only (unless it is a hotfix). Therefore, always checkout to `dev` and do a `git pull` before doing a `git checkout -b`.
3. Branch Naming Rules:
- `feature/S01-03-task` for a feature development task where "S01-03" is the name of the ticket. 
- `bugfix/S01-03-bug` for a bug fix task.
- `hotfix/S01-03-task` for a hot fix. **Note: A hotfix branch is created from main branch and PR is made to both main and dev.**
4. Create your PR to the `dev` branch only.
5. Wait for atleast two code reviewers to approve your PR before merging your branch to `dev`.
6. Delete your branch from remote if you are done working on it.
7. Contact the technical lead if there are conflicts in your branch.

## Rules for Components Folder

- Create a component as a separate file (named using PascalCase) with a `.tsx` extension.
- If you have a component that uses dot notation to extend its variants use a folder.
- Export your component from within the file and also from `index.ts` present in the `components` directory. Make sure exports are sorted.

## Rules for Tailwind CSS Class Order

1. unique class (if you created a class for a component like card put it first)
2. position (if its relative or absolute) at first glance you’ll immediately know if the element doesn't abide by the rules.
3. size (width, height)
4. display (flex block hidden)
5. fonts
6. colors (text or bg colors)
7. borders
8. margins, paddings and gaps
9. absolute positioning (top, left…z indexes)
