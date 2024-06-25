const run = async () => {
  console = await import("console");
};

run().then(() => {
  console.log("☢️ Starting tests! ");
});

if (!globalThis.TEST_GLOBALS) {
  globalThis.TEST_GLOBALS = {
    createdUsers: [],
  };
}
