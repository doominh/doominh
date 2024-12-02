export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const formattedDate = `${day} Tháng ${monthIndex + 1}, ${year}`;
  const formattedTime = date.toLocaleTimeString();
  return { formattedDate, formattedTime };
};

export default formatDateTime;
