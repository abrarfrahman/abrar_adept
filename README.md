# Adept Frontend Project Instructions

## Goals of the project

At Adept, we've created customer workflows that get run many times throughout the day. The goal of this project is to create a dashboard to visualize and derive insights from these workflow runs. You can find the relevant interfaces and sample data in `src/data/workflowsData.ts`

Please add notes to `notes.md` to provide context around design decisions. This is an open-ended project, so feel free to use `notes.md` to explain the scope you have chosen.

By default, we will use `npm install` && `npm run dev` to test the completed project. If there are different instructions we should follow, please add them to `notes.md`.

## Requirements

- Users should be able to find the complete details of any workflow or workflow run.
- Users should be able to see the number of failed workflow runs for a given workflow on a given day.
- Users should also be able to determine at least one other insight/metric from the data. You should determine what that is and include it in `notes.md`.
- Either Javascript or Typescript should be used.
- The project will be evaluated on both functionality and UX

## Framework

We have set up a starter project using [Next.js](https://nextjs.org/) through [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) to get you going. However, if you have a preference for a different JavaScript or TypeScript framework, please feel free to choose an alternative that suits your needs. Additionally, feel free to use any publicly available component libraries.

### Getting Started

1. Run `npm install` to install all the dependencies
2. Run `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
