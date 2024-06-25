const run = async () => {
  console = await import("console");
};

run().then(() => {
  console.log("☢️ Starting tests! ");
});

if (!globalThis.TEST_CONFIG) {
  globalThis.TEST_CONFIG = {
    createdUsers: [],
  };
}
