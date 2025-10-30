import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nextConfig = {};

try {
  const { version } = require("next/package.json");
  const [major = "0", minor = "0"] = version.split(".");
  const majorNumber = Number(major);
  const minorNumber = Number(minor);

  if (Number.isFinite(majorNumber)) {
    if (majorNumber >= 16) {
      nextConfig.reactCompiler = true;
    } else if (
      majorNumber === 15 ||
      (majorNumber === 14 && Number.isFinite(minorNumber) && minorNumber >= 2)
    ) {
      nextConfig.experimental = {
        ...(nextConfig.experimental ?? {}),
        reactCompiler: true,
      };
    }
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn("Unable to determine Next.js version for React Compiler:", error);
}

export default nextConfig;
