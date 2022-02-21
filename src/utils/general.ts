export const numberTextFormat = (n:number, unit:string) => {
    
    let sFromNumber = n.toLocaleString();
    
    if (unit === "count"){
        return `${sFromNumber} 개`
    } 
   
    if (unit === "currency"){
        return `${sFromNumber} 원`
    }

    return `${sFromNumber}`
}

export const getDateRangeFromToday= (n:number) => {
    var date = new Date();
    return date.setDate(date.getDate()-n);
}