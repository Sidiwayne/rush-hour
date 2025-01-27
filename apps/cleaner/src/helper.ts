export const isDatePassedBy5Minutes = (timestamp: number) => {
    const currentTime = new Date();
    const targetDate = new Date(timestamp);
  
    const diff = currentTime.getTime() - targetDate.getTime();
    return diff >=  5 * 60 * 1000;
  }