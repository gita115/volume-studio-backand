const myexpress = require("express")
const db  = require("./dal/db-accessor")
const animalRouter = require("./routes/animal-router")
const app = myexpress()

app.use(myexpress.urlencoded({extends:true}))
app.use(myexpress.json())

//חיבור ל DB
const init = async()=>{
    await db.connect()
}
init()

//יצירת שרת
const hostname="localhost"
const port = 5000
app.listen(port, hostname, ()=>{
    console.log(`Server running at ${hostname}:${port}`);
})

//סדר הכתיבה היה תחילה חיבור למסד הנתונים
//ואח"כ חיבור לשרת
//בפועל, תחילה התחבר לשרת
//ואח"כ למסד הנתונים
//כיון שהן פעולות אסינכרוניות

app.use("/animal", animalRouter)


