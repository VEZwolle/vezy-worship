// Export all files in this directory
const requireContext = require.context('./', false, /.*\.vue$/)
export default requireContext.keys()
  .map(file => requireContext(file).default)
