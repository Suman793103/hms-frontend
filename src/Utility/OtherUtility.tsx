const arrayToCSV = (arr: string[]) => {
  if (!arr || arr.length === 0) return null;
  return arr.join(",");
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const addZeroMonths = (data: any[], monthKey: string, valueKey: string) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const result = months.map((month) => {
    const found = data.find((item) => item[monthKey] === month);
    return found
      ? found
      : {
          [monthKey]: month,
          [valueKey]: 0,
        };
  });
  return result;
};

const convertReasonChartData = (data: any[]) => {
  const colors = [
    "#4c6ef5",
    "#15aabf",
    "#f76707",
    "#e64980",
    "#12b886",
    "#fd7e14",
    "#20c997",
    "#f03e3e",
    "#228be6",
    "#f59f00",
  ];
  return data.map((item, index) => ({
    name: item.reason,
    value: item.count,
    color: colors[index % colors.length],
  }));
};

export {
  arrayToCSV,
  capitalizeFirstLetter,
  addZeroMonths,
  convertReasonChartData,
};
