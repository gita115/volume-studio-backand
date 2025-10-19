const myanimal = require("../models/animalModel")

class dbAccessorAnimal {

    constructor(){
        console.log("ctor");
    }

    getAll = async()=>{
        try {
            //find: פונ' זו מקבלת נתונים מתוך מסד הנתונים לקולקשן הרצוי
            //ניגשים לפונ' דרך אובייקט המודל
            //אם הצומדיים ריקים - מחזיר את כל הנתונים
            //ניתן לשים בצומדים תנאים
            let data = await myanimal.find({})
            if (data.length)
                return data;
            else    
                throw console.error("data not found")
        } catch (error) {
            throw console.error(error)
        }
    }

    getById = async(animalId)=>{
        try {
            console.log(animalId);
            //find: שליפת נתונים
            //כאשר בצומדיים יש תנאי הנתונים יחזרו בהתאם לתנאי
            //תנאי זה הוא האם שדה שווה לערך מסוים
            //ניתן להחזיר ערך בודד ע"י שימוש ב findOne
            let data = await myanimal.find({id:animalId})
            if (data)
                return data;
            else    
                throw console.error("data not found")
        } catch (error) {
            throw console.error(error)
        }
    }

    getByAge = async(min, max)=>{
        try {
            console.log(max);
            //let data = await myanimal.find({age:{$gt:min, $lt:max}}).exec()
            let data = await myanimal.find({}).where("age").gt(min).lt(max)
            if (data)
                return data;
            else    
                throw console.error("data not found")
        } catch (error) {
            throw console.error(error)
        }
    }

    insertAnimal = async(newAnimal)=>{
        try {
            //מוסיפה אובייקט חדש
            //ומחזירה אותו
            //לפעמים יש צורך באויבקט לאחר הוספה
            //כדי לקבל את הקוד האוטומטי שלו
            await myanimal.create(newAnimal)
            return this.getAll();
        } catch (error) {
            throw console.error(error)
        }
    }

    updateAnimal = async(idAnimal, editAnimal)=>{
        try {
            await myanimal.updateOne({id:idAnimal}, editAnimal)
            return this.getAll()
        } catch (error) {
            throw console.error(error)
        }
    }

    deleteAnimal = async(id)=>{
        try {
            await myanimal.deleteOne({id:id})
            return this.getAll()
        } catch (error) {
            throw console.error(error)
        }
    }
}

module.exports = dbAccessorAnimal