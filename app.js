const express = require('express')
const bodyparser= require('body-parser')

const {PrismaClient} = require('@prisma/client'); //added this
const prisma = new PrismaClient();

const cors = require('cors')
const app = express()

const cookieParser = require('cookie-parser');
app.use(cookieParser()); // parse cookies
const{clerkClient} = require('./lib/clerk.js');
const { clerkMiddleware, getAuth } = require('@clerk/express');

app.use(clerkMiddleware()); // https://clerk.com/docs/references/express/overview

app.use(bodyparser.json());
//give express teh functions it needs to support incoming and outgoing json
app.use(cors());
const port = process.env.PORT || 3000;//use given port or default to 3000 if none is given

app.get('/hello', (req, res) => {      

  res.json(students)
//   res.json({'message':'hello!'});
})

// app.get('/students', async (req, res) => {
//   // console.log(req.query.school);

//   // instead of only school, generically filter by any property name
//   if (req.query) {
//     const propertyNames = Object.keys(req.query);
//     let Prismastudents = await prisma.student.findMany();
//     for (const propertyName of propertyNames) {
//       Prismastudents = Prismastudents.filter((s) => s[propertyName] === req.query[propertyName]);
//     }
//     res.json(Prismastudents);
//   } else {
//     // else, respond with the entire list
//     res.json(Prismastudents);
//   }
// });

app.get('/students', async (req, res) => {
  const auth = getAuth(req);
  console.log(auth);
  if (!auth.userId) {

    return res.status(401).json([]);

  }

  // instead of only school, generically filter by any property name
  if (req.query) {
    const propertyNames = Object.keys(req.query);
    let students = await prisma.student.findMany();
    for (const propertyName of propertyNames) {
      students = students.filter((s) => s[propertyName] === req.query[propertyName]);
    }
    res.json(students);
  } else {
    // else, respond with the entire list
    res.json(studentList);
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

app.post('/login', async (req, res) => {
  const { emailAddress, password } = req.body;
  const dbUser = await prisma.users.findUnique({ where: { email: emailAddress.toLowerCase() } });
  if (!dbUser) {
    res.status(401).json({ message: 'error logging in' });
  }
  const { verified } = await clerkClient.users.verifyPassword({ userId: dbUser.authId, password });
  if (!verified) {
    res.status(401).json({ message: 'error logging in' });
  }

  const signInToken = await clerkClient.signInTokens.createSignInToken({ userId: dbUser.authId });
  res.cookie('accessToken', signInToken.token);
  res.json(signInToken);
});


app.post('/students', async (req, res) => {
  console.log(req.body);
  // normally we validate req.body but skipping due to time

  const Prismastudents = await prisma.student.create({ data: {... req.body,grade:"FRESHMAN"} });
  res.json(Prismastudents);
});

app.post('/register', async (req, res) => {
  
  const { emailAddress, password } = req.body;
  console.log(req.body);
  const user = await clerkClient.users.createUser({ emailAddress: [emailAddress], password });
  await prisma.users.create({ data: { authId: user.id, email: emailAddress.toLowerCase() } });

  const signInToken = await clerkClient.signInTokens.createSignInToken({ userId: user.id });
  res.cookie('accessToken', signInToken.token);
  res.json(signInToken);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// with node --watch app.js we can have node js reload the server when  