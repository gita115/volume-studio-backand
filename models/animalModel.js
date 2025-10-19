//מודל הוא מיפוי לקולקשן במסד הנתונים

const mymongo = require("mongoose")

//הסכמה מגדירה איך נראים השדות במסד הנתונים
const animalSchema = new mymongo.Schema(
    {
        id:Number,
        //name:{type:String, require:true, default:"unname" },
        name:String,
        say:String
    }
)

//פונ' זו יוצרת אובייקט שדרכו ניגשים למסד הנתונים
//מקבלת את שם הקולקשן
//ואובייקט הסכמה
//הפרמטר השלישי הוא כינוי לקולקשן
//נשים שם את השם הרגיל
const animal = mymongo.model("Animal", animalSchema, "Animal")

module.exports = animal