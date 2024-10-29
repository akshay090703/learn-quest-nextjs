const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AiGenerateCourseLayout = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate A Course Tutorial on following details with field as Course Name, Description, Along with chapter name, about, Duration:\nCategory: 'Programming', Topic: 'Python', Level: 'Basic', Duration: 1 hours, NoOfChapters: 5. in JSON format\nreturn only the json response, so that i can use it in my webapp\nThe json format should be like the following:\n{course: 1. name 2. description 3. chapters -> (a) name (b) about (c) duration 4. category 5. topic 6. level 7. duration 8. noOfChapters }",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "course": {\n    "name": "Python Programming Fundamentals",\n    "description": "This course provides a comprehensive introduction to the Python programming language, covering fundamental concepts, syntax, data types, control flow, and basic programming techniques. You will learn how to write simple Python programs and gain a solid foundation for further exploration.",\n    "chapters": [\n      {\n        "name": "Introduction to Python",\n        "about": "This chapter introduces the Python programming language, its history, and its key features. You will learn how to install Python and set up your development environment.",\n        "duration": "15 minutes"\n      },\n      {\n        "name": "Basic Syntax and Data Types",\n        "about": "This chapter covers Python\'s basic syntax, including variables, data types, operators, and expressions. You will learn how to work with numbers, strings, and booleans.",\n        "duration": "20 minutes"\n      },\n      {\n        "name": "Control Flow and Loops",\n        "about": "This chapter explores control flow statements like if-else, loops, and functions. You will learn how to write programs that make decisions and repeat actions.",\n        "duration": "25 minutes"\n      },\n      {\n        "name": "Lists, Tuples, and Dictionaries",\n        "about": "This chapter introduces fundamental data structures like lists, tuples, and dictionaries. You will learn how to manipulate and access data within these structures.",\n        "duration": "15 minutes"\n      },\n      {\n        "name": "Functions and Modules",\n        "about": "This chapter covers functions and modules, essential tools for organizing and reusing code. You will learn how to define, call, and import functions.",\n        "duration": "15 minutes"\n      }\n    ],\n    "category": "Programming",\n    "topic": "Python",\n    "level": "Basic",\n    "duration": "1 hour",\n    "noOfChapters": 5\n  }\n}\n```',
        },
      ],
    },
  ],
});

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
