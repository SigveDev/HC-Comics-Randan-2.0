export const calculateHowLongAgo = (date: Date) => {
  const createdAt = new Date(date);
  const currentTime = new Date();
  const diffInMilliseconds = currentTime.getTime() - createdAt.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let howLongAgo = "";
  if (diffInDays > 0) {
    howLongAgo = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    howLongAgo = `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    howLongAgo = `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    howLongAgo = `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
  }

  return howLongAgo;
};
