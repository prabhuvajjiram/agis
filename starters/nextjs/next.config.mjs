/** Keep the standalone starter's build root independent of a containing monorepo. */
export default {
  turbopack: { root: import.meta.dirname },
  poweredByHeader: false,
};
