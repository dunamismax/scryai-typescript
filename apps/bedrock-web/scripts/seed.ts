import { db } from "~/lib/db.server";

const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;

async function run() {
  if (!adminEmail) {
    console.log("seed skipped: set BOOTSTRAP_ADMIN_EMAIL to promote an existing user");
    await db.end();
    return;
  }

  const rows = await db<{ id: string; email: string }[]>`
    update "user"
    set role = 'admin', "updatedAt" = now()
    where lower(email) = lower(${adminEmail})
    returning id, email
  `;

  if (rows.length === 0) {
    console.log(`seed warning: no user found for ${adminEmail}`);
  } else {
    console.log(`seed ok: promoted ${rows[0].email} to admin`);
  }

  await db.end();
}

run().catch(async (error) => {
  console.error(error);
  await db.end({ timeout: 0 });
  process.exit(1);
});
