const run = async () => {
  console = await import("console");
};

run().then(() => {
  console.log("🚨 Setup test environment! ");
});

if (!globalThis.TEST_GLOBALS) {
  globalThis.TEST_GLOBALS = {
    createdUsers: [],
  };
}
