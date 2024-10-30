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

export const AiGenerateChapterContent = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Explain the concept in Detail on Topic: Designing using Figma, Chapter:Introduction to the World of Figma, in JSON Format with list of array with field as title, explanation on given chapter in detail, Code Example(Code field in <precode> format) if applicable",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "title": "Introduction to Figma",\n    "explanation": "Figma is a powerful and versatile design tool that allows users to create professional-looking designs for websites, mobile apps, and other digital products. It is a web-based application, meaning that it can be accessed from any device with an internet connection. Figma offers a wide range of features, including vector editing, prototyping, collaboration tools, and a vast library of pre-made components.",\n    "code": ""\n  },\n  {\n    "title": "Key Features of Figma",\n    "explanation": "Figma\'s key features include:\\n\\n* **Vector Editing:** Figma allows users to create and edit vector graphics, which can be scaled to any size without losing quality. This makes it ideal for designing icons, logos, and other elements that need to be easily resized.\\n* **Prototyping:** Figma enables designers to create interactive prototypes that simulate the user experience of a website or app. This allows users to test their designs and get feedback before development begins.\\n* **Collaboration Tools:** Figma offers powerful collaboration tools that allow teams to work together on designs in real-time. This includes features like shared workspaces, version history, and comments.\\n* **Component Library:** Figma provides a built-in component library that allows users to create and reuse design elements. This helps to ensure consistency across projects and speeds up the design process.\\n* **Plugins and Integrations:** Figma has a robust plugin ecosystem that allows users to extend its functionality. There are plugins for everything from design automation to data visualization.",\n    "code": ""\n  },\n  {\n    "title": "Benefits of Using Figma",\n    "explanation": "There are numerous benefits to using Figma, including:\\n\\n* **Accessibility:** Figma is a web-based application, making it accessible from any device with an internet connection.\\n* **Collaboration:** Figma\'s collaborative features make it easy for teams to work together on designs in real-time.\\n* **Versatility:** Figma is a versatile tool that can be used for a wide range of design tasks.\\n* **Affordable:** Figma offers a free plan that provides access to many of its core features. It also has paid plans for teams and organizations.\\n* **User-Friendly:** Figma is designed to be intuitive and easy to use, even for beginners.",\n    "code": ""\n  },\n  {\n    "title": "Getting Started with Figma",\n    "explanation": "To get started with Figma, you will need to create a free account. Once you have an account, you can access the Figma editor, where you can create new projects, open existing projects, and explore the various features of the application.",\n    "code": ""\n  },\n  {\n    "title": "Figma\'s User Interface",\n    "explanation": "Figma\'s user interface is organized into several key areas:\\n\\n* **Canvas:** The canvas is the main area where you create your designs.\\n* **Toolbar:** The toolbar contains a variety of tools for drawing, editing, and manipulating objects.\\n* **Layers Panel:** The layers panel shows a hierarchical list of all the objects in your design.\\n* **Design Panel:** The design panel allows you to change the properties of selected objects.\\n* **Prototype Panel:** The prototype panel is where you create and edit interactive prototypes.",\n    "code": ""\n  }\n]\n```',
        },
      ],
    },
  ],
});

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
