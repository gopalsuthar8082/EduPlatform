/**
 * Helper to extract and compute pagination parameters from request query
 * @param {object} query - Express req.query object
 * @param {number} [defaultLimit=10] - Default items per page
 * @param {number} [maxLimit=100] - Maximum allowed items per page
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPagination = (query, defaultLimit = 10, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Helper to build standard pagination metadata object
 * @param {number} total - Total matching records count
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {{ page: number, limit: number, total: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
const formatPagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

module.exports = {
  getPagination,
  formatPagination
};
