import moment from "moment";

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

export const getLocalDateTimeString= (datetimeString:string | Date)=> {
    var tzString = "Asia/Seoul"
    var dt = new Date((typeof datetimeString=== "string" ? new Date(datetimeString) : datetimeString).toLocaleString("en-US", {timeZone: tzString}));
    return moment(dt).format("YYYY-MM-DD")

}