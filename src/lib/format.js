// Display helpers.

// "Oct 25, 10:05 AM"
export function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

// A readable message from an ApiError: the server's message, plus the first validation issue if there is one.
export function errorMessage(err) {
  const issue = err?.body?.issues?.[0]?.message;
  return issue ? `${err.message}: ${issue}` : (err?.message ?? 'Something went wrong');
}
