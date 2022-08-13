function getDateTime(unixTime) {
  const date = new Date(unixTime * 1000);
  let month = date.getMonth() + 1;
  switch (month) {
    case 1:
      month = "Jan";
      break;
    case 2:
      month = "Feb";
      break;
    case 3:
      month = "Mar";
      break;
    case 4:
      month = "Apr";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "Jun";
      break;
    case 7:
      month = "Jul";
      break;
    case 8:
      month = "Aug";
      break;
    case 9:
      month = "Sep";
      break;
    case 10:
      month = "Oct";
      break;
    case 11:
      month = "Nov";
      break;
    case 12:
      month = "Dec";
      break;
    default:
      month = null;
      break;
  }

  let day = date.getDay() + 1;
  switch (day) {
    case 1:
      day = "Sun";
      break;
    case 2:
      day = "Mon";
      break;
    case 3:
      day = "Tue";
      break;
    case 4:
      day = "Wed";
      break;
    case 5:
      day = "Thu";
      break;
    case 6:
      day = "Fri";
      break;
    case 7:
      day = "Sat";
      break;
    default:
      day = null;
      break;
  }
  let dom = date.getDate();
  let year = date.getFullYear();
  let hours = date.getHours();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day}, ${month} ${dom}, ${year} - ${hours}:${minutes} ${ampm}`;
}

export { getDateTime };
