//התחברות למסד נתונים

//ספריה זו מתחברת למסד נתונים של מונגו 
const mymongo = require("mongoose")

//מחרוזת הקישור למסד הנתונים
const url = "mongodb://localhost:27017"
//שם מסד הנתונים שלנו
const dbName = "Zoo"

const connectDB = {}

//פונ' זו מבצעת את ההתחברות בפועל
//הפונקציה תופעל דרך מי שישתמש במודול זה
connectDB.connect = async()=>{
    try {
        //פונ' זו מתחברת למסד הנתונים
        //מקבלת את מחרוזת הקישור ושם המסד
        //ההתחברות היא פעולה אסינכרונית
        await mymongo.connect(`${url}/${dbName}`,
            //הגדרות אבטחה
            //אין חובה לשים אותן אם אין צורך
        {useNewUrlParser:true, useUnifiedTopology:true})
            //כאשר מסד הנתונים נוציא את ההודעה הבאה
        console.log("Connection successfully to mongoDB");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB

