import { shutdown } from './express';

export default async function () {
  await shutdown();
}
