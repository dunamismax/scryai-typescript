import { getBoss, stopBoss } from "~/lib/jobs.server";

async function run() {
  const boss = await getBoss();

  if (!boss) {
    console.error("worker disabled: set ENABLE_JOBS=true");
    process.exit(1);
  }

  await boss.createQueue("system.demo");

  await boss.work<{ requestedByUserId: string; requestedAt: string }>(
    "system.demo",
    async ([job]) => {
      console.log(
        `processed job=${job.id} requestedBy=${job.data.requestedByUserId} at=${job.data.requestedAt}`,
      );
    },
  );

  console.log("worker started");

  const shutdown = async () => {
    await stopBoss();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

run().catch(async (error) => {
  console.error(error);
  await stopBoss();
  process.exit(1);
});
