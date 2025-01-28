export const isDatePassed = (timestamp: number) => {
    const currentTime = new Date();
    const targetDate = new Date(timestamp);
  
    const diff = currentTime.getTime() - targetDate.getTime();
    const minutes = process.env.ITEM_MAX_AGE && parseInt(process.env.ITEM_MAX_AGE) || 5;
    return diff >=  minutes * 60 * 1000;
  }