const express = require('express')
const bodyparser= require('body-parser')
const {PrismaClient} = require('@prisma/client'); //added this
const prisma = new PrismaClient();
const cors = require('cors')
const app = express()
app.use(bodyparser.json());
//give express teh functions it needs to support incoming and outgoing json
app.use(cors());
const port = process.env || 3000;//use given port or default to 3000 if none is given
let students = [
    {
      "firstName": "Aryan",
      "lastName": "Jabbari",
      "sId": "234",
      "school": "Queens College",
      "major": "Computer Science"
    },
    {
      "firstName": "Lidia",
      "lastName": "De La Cruz",
      "sId": "333",
      "school": "Harvard",
      "major": "Philanthrophy"
    },
    {
      "firstName": "Brian",
      "lastName": "De Los Santos",
      "sId": "468",
      "school": "John Jay",
      "major": "Computer Science"
    },
    {
      "firstName": "Adam",
      "lastName": "Albaghali",
      "sId": "589",
      "school": "Brooklyn College",
      "major": "Computer Science"
    },
    {
      "firstName": "Nathan",
      "lastName": "Vazquez",
      "sId": "559",
      "school": "Hunter College",
      "major": "Computer Science"
    },
    {
      "firstName": "Ynalois",
      "lastName": "Pangilinan",
      "sId": "560",
      "school": "Hunter College",
      "major": "Computer Science"
    },
    {
      "firstName": "Shohruz",
      "lastName": "Ernazarov",
      "sId": "561",
      "school": "Hunter College",
      "major": "Computer Science"
    },
    {
      "firstName": "Kevin",
      "lastName": "Orta",
      "sId": "562",
      "school": "John Jay",
      "major": "Computer Science"
    }
  ]
app.get('/hello', (req, res) => {      

  res.json(students)
//   res.json({'message':'hello!'});
})

app.get('/students', async (req, res) => {
  // console.log(req.query.school);

  // instead of only school, generically filter by any property name
  if (req.query) {
    const propertyNames = Object.keys(req.query);
    let Prismastudents = await prisma.student.findMany();
    for (const propertyName of propertyNames) {
      Prismastudents = Prismastudents.filter((s) => s[propertyName] === req.query[propertyName]);
    }
    res.json(Prismastudents);
  } else {
    // else, respond with the entire list
    res.json(Prismastudents);
  }
});


// if(req.query.school){
//     if(typeof(req.query) == "number"){
//         console.log("sId");
//     }else if((req.query)[-1:-7] == "College"){
//         console.log("College");
//     }else if ((req.query).indexOf(" ")){
//         console.log("")
//     }else{

//     }
//     const filteredStudents = students.filter((student)=>)
// }

// for(const student of students){
//     if(student.school == schoolParam){
//         collegeList.append(student);
//     }
// }
// res.send(students)



// write a GET /students/:id endpoint that returns a single student by id
app.get('/students/:id', async (req, res) => {
  // id exists in the request
  const id = req.params.id;
  console.log(id);

  const student = await prisma.student.findUnique({
    where:{sId:id},
  });
  // let students = await prisma.student.findMany();
  // // find student with matching ID and respond with the student
  // const student = students.find((s) => s.sId === id);
  console.log(student);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'student not found' });
  }
});


app.post('/students', async (req, res) => {
  console.log(req.body);
  // normally we validate req.body but skipping due to time

  const Prismastudents = await prisma.student.create({ data: req.body });
  res.json(Prismastudents);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// with node --watch app.js we can have node js reload the server when  