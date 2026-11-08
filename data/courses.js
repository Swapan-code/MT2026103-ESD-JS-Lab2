// The course catalogue for this lab: 20 plain objects in a plain array.
// No server, no database: everything in this lab runs on this file.
// (The fields are the same ones the course API uses later in the term,
// so nothing you write here needs to change when the data comes from a server.)

export const courses = [
  { id: 1,  code: "CS101", title: "Programming Fundamentals",        description: "Variables, control flow, functions and debugging in Java.", department: "Computer Science",  credits: 4, capacity: 120, seatsLeft: 34 },
  { id: 2,  code: "CS201", title: "Data Structures",                 description: "Lists, trees, hash tables and the cost of each operation.", department: "Computer Science",  credits: 4, capacity: 90,  seatsLeft: 0 },
  { id: 3,  code: "CS305", title: "Database Systems",                description: "Relational modelling, SQL, indexing and transactions.",       department: "Computer Science",  credits: 4, capacity: 80,  seatsLeft: 12 },
  { id: 4,  code: "CS402", title: "Enterprise Software Development", description: "Spring Boot, React and building one app end to end.",       department: "Computer Science",  credits: 4, capacity: 120, seatsLeft: 3 },
  { id: 5,  code: "CS501", title: "Distributed Systems",             description: "Consensus, replication and what happens when machines fail.", department: "Computer Science",  credits: 4, capacity: 60,  seatsLeft: 1 },
  { id: 6,  code: "EC101", title: "Digital Logic",                   description: "Gates, flip-flops and building a tiny CPU.",                 department: "Electronics",       credits: 3, capacity: 70,  seatsLeft: 22 },
  { id: 7,  code: "EC210", title: "Signals and Systems",             description: "Convolution, Fourier transforms and filters.",               department: "Electronics",       credits: 4, capacity: 60,  seatsLeft: 0 },
  { id: 8,  code: "EC330", title: "Embedded Systems",                description: null,                                                         department: "Electronics",       credits: 3, capacity: 40,  seatsLeft: 9 },
  { id: 9,  code: "EC415", title: "VLSI Design",                     description: "From transistor to layout.",                                 department: "Electronics",       credits: 4, capacity: 35,  seatsLeft: 14 },
  { id: 10, code: "MA101", title: "Linear Algebra",                  description: "Vectors, matrices, eigenvalues and why ML needs them.",      department: "Mathematics",       credits: 4, capacity: 150, seatsLeft: 41 },
  { id: 11, code: "MA202", title: "Probability and Statistics",      description: "Random variables, distributions and estimation.",            department: "Mathematics",       credits: 4, capacity: 150, seatsLeft: 0 },
  { id: 12, code: "MA310", title: "Discrete Mathematics",            description: "Logic, sets, graphs and counting.",                          department: "Mathematics",       credits: 3, capacity: 100, seatsLeft: 27 },
  { id: 13, code: "MA405", title: "Optimization",                    description: "",                                                           department: "Mathematics",       credits: 3, capacity: 50,  seatsLeft: 18 },
  { id: 14, code: "DS101", title: "Introduction to Data Science",    description: "Cleaning, exploring and visualising real datasets.",        department: "Data Science & AI", credits: 3, capacity: 100, seatsLeft: 6 },
  { id: 15, code: "DS220", title: "Machine Learning",                description: "Regression, classification and model evaluation.",          department: "Data Science & AI", credits: 4, capacity: 90,  seatsLeft: 0 },
  { id: 16, code: "DS330", title: "Deep Learning",                   description: "Neural networks, backpropagation and PyTorch.",             department: "Data Science & AI", credits: 4, capacity: 60,  seatsLeft: 2 },
  { id: 17, code: "DS440", title: "Natural Language Processing",     description: "Text as data, embeddings and transformers.",                 department: "Data Science & AI", credits: 4, capacity: 45,  seatsLeft: 11 },
  { id: 18, code: "HS101", title: "Technical Communication",         description: "Writing and presenting for engineers.",                     department: "Humanities",        credits: 2, capacity: 200, seatsLeft: 88 },
  { id: 19, code: "HS205", title: "Economics for Engineers",         description: "Markets, costs and decisions.",                             department: "Humanities",        credits: 2, capacity: 120, seatsLeft: 0 },
  { id: 20, code: "HS310", title: "Ethics in Technology",            description: "Privacy, bias and responsibility in software.",             department: "Humanities",        credits: 2, capacity: 80,  seatsLeft: 30 },
];
