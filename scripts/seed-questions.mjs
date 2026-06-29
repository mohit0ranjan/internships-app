import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
  // Frontend
  {
    question: "What is the primary difference between `let` and `var` in JavaScript?",
    options: JSON.stringify([
      "`var` is block-scoped, while `let` is function-scoped.",
      "`let` is block-scoped, while `var` is function-scoped.",
      "`let` variables are hoisted to the top, while `var` variables are not.",
      "There is no difference, they are interchangeable."
    ]),
    correctAnswer: "`let` is block-scoped, while `var` is function-scoped.",
    explanation: "In JavaScript, `var` declarations are function-scoped or globally-scoped, whereas `let` and `const` are block-scoped.",
    difficulty: "EASY",
    topic: "JavaScript",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "In TypeScript, what does the `never` type represent?",
    options: JSON.stringify([
      "A value that is null or undefined.",
      "The type of values that never occur.",
      "A type used exclusively for uninitialized variables.",
      "An alias for the `void` type."
    ]),
    correctAnswer: "The type of values that never occur.",
    explanation: "The `never` type represents the type of values that never occur. For instance, `never` is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns.",
    difficulty: "MEDIUM",
    topic: "TypeScript",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which hook should be used to perform side effects in a React functional component?",
    options: JSON.stringify([
      "useState",
      "useReducer",
      "useEffect",
      "useContext"
    ]),
    correctAnswer: "useEffect",
    explanation: "The `useEffect` Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.",
    difficulty: "EASY",
    topic: "React",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "In Next.js (App Router), which file convention is used to handle UI fallbacks while content is loading?",
    options: JSON.stringify([
      "fallback.tsx",
      "loading.tsx",
      "suspense.tsx",
      "skeleton.tsx"
    ]),
    correctAnswer: "loading.tsx",
    explanation: "In the Next.js App Router, the `loading.tsx` file is a special file convention that allows you to create fallback UI (like skeletons or spinners) to show while the route segment's content is loading.",
    difficulty: "EASY",
    topic: "Next.js",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which CSS property is used to change the stacking order of positioned elements?",
    options: JSON.stringify([
      "z-index",
      "position",
      "stack-order",
      "display"
    ]),
    correctAnswer: "z-index",
    explanation: "The `z-index` property specifies the stack order of an element. An element with greater stack order is always in front of an element with a lower stack order.",
    difficulty: "EASY",
    topic: "CSS",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which of the following HTML elements is typically used to convey that a section is an independent, self-contained piece of content?",
    options: JSON.stringify([
      "<section>",
      "<article>",
      "<div>",
      "<main>"
    ]),
    correctAnswer: "<article>",
    explanation: "The `<article>` element represents a self-contained composition in a document, page, application, or site, which is intended to be independently distributable or reusable.",
    difficulty: "MEDIUM",
    topic: "HTML",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which Web Vitals metric primarily measures visual load performance?",
    options: JSON.stringify([
      "Cumulative Layout Shift (CLS)",
      "First Input Delay (FID)",
      "Largest Contentful Paint (LCP)",
      "Time to Interactive (TTI)"
    ]),
    correctAnswer: "Largest Contentful Paint (LCP)",
    explanation: "Largest Contentful Paint (LCP) measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.",
    difficulty: "HARD",
    topic: "Performance",
    marks: 2,
    negativeMarks: 0.5
  },
  {
    question: "What is the primary purpose of the `aria-label` attribute in web accessibility?",
    options: JSON.stringify([
      "To style an element using a CSS pseudo-class.",
      "To provide an accessible name for an element when there is no visible text.",
      "To link a label to a form input.",
      "To define the semantic structure of a webpage."
    ]),
    correctAnswer: "To provide an accessible name for an element when there is no visible text.",
    explanation: "The `aria-label` attribute is used to define a string that labels the current element. Use it in cases where a text label is not visible on the screen.",
    difficulty: "MEDIUM",
    topic: "Accessibility",
    marks: 1,
    negativeMarks: 0.25
  },

  // DSA
  {
    question: "What is the worst-case time complexity of accessing an element by index in an Array?",
    options: JSON.stringify([
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n^2)"
    ]),
    correctAnswer: "O(1)",
    explanation: "Accessing an element by index in an array is an O(1) operation because arrays are stored in contiguous memory blocks, allowing the exact memory location to be calculated instantly.",
    difficulty: "EASY",
    topic: "Arrays",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which algorithm is commonly used for efficient string matching/searching?",
    options: JSON.stringify([
      "Dijkstra's Algorithm",
      "KMP (Knuth-Morris-Pratt) Algorithm",
      "Floyd-Warshall Algorithm",
      "Kruskal's Algorithm"
    ]),
    correctAnswer: "KMP (Knuth-Morris-Pratt) Algorithm",
    explanation: "KMP is a string-searching algorithm that searches for occurrences of a 'word' within a main 'text string' efficiently in O(n) time.",
    difficulty: "HARD",
    topic: "Strings",
    marks: 2,
    negativeMarks: 0.5
  },
  {
    question: "In a Hash Map, what happens when two keys hash to the same index?",
    options: JSON.stringify([
      "The program throws an error.",
      "The new value overwrites the old value entirely.",
      "A collision occurs, typically resolved via chaining or open addressing.",
      "The hash map is resized and all keys are rehashed immediately."
    ]),
    correctAnswer: "A collision occurs, typically resolved via chaining or open addressing.",
    explanation: "When two distinct keys hash to the same bucket index, it is called a collision. Common resolution techniques are Separate Chaining (using linked lists) or Open Addressing.",
    difficulty: "MEDIUM",
    topic: "Hashing",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    options: JSON.stringify([
      "Queue",
      "Linked List",
      "Stack",
      "Tree"
    ]),
    correctAnswer: "Stack",
    explanation: "A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle, where the last element added is the first one to be removed.",
    difficulty: "EASY",
    topic: "Stacks",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "A Queue is implemented using a standard array. Enqueueing an element takes O(1) time. What is the worst-case time complexity of Dequeueing (removing the front element) if the array shifts all remaining elements?",
    options: JSON.stringify([
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n^2)"
    ]),
    correctAnswer: "O(n)",
    explanation: "If you remove the first element of an array and shift all subsequent elements to the left by one position, it requires O(n) operations.",
    difficulty: "MEDIUM",
    topic: "Queues",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "What is the Time Complexity of Quick Sort in the worst-case scenario?",
    options: JSON.stringify([
      "O(n)",
      "O(n log n)",
      "O(n^2)",
      "O(2^n)"
    ]),
    correctAnswer: "O(n^2)",
    explanation: "Quick Sort's worst-case time complexity is O(n^2), which occurs when the pivot chosen is consistently the greatest or smallest element (e.g., if the array is already sorted and the pivot is the first or last element without random selection).",
    difficulty: "MEDIUM",
    topic: "Time Complexity",
    marks: 1,
    negativeMarks: 0.25
  },

  // Backend
  {
    question: "Which underlying JavaScript engine powers Node.js?",
    options: JSON.stringify([
      "SpiderMonkey",
      "Chakra",
      "V8",
      "JavaScriptCore"
    ]),
    correctAnswer: "V8",
    explanation: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    difficulty: "EASY",
    topic: "Node.js",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "In Express.js, what is middleware?",
    options: JSON.stringify([
      "A database ORM.",
      "A function that has access to the request and response objects and the next middleware function.",
      "A template engine for rendering HTML.",
      "A built-in module for file system operations."
    ]),
    correctAnswer: "A function that has access to the request and response objects and the next middleware function.",
    explanation: "Middleware functions in Express are functions that have access to the request object (req), the response object (res), and the next function in the application's request-response cycle.",
    difficulty: "EASY",
    topic: "Express",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "In a RESTful API, which HTTP method is typically used to completely replace an existing resource?",
    options: JSON.stringify([
      "PATCH",
      "PUT",
      "POST",
      "DELETE"
    ]),
    correctAnswer: "PUT",
    explanation: "The HTTP PUT request method creates a new resource or replaces a representation of the target resource with the request payload.",
    difficulty: "MEDIUM",
    topic: "REST APIs",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "What does an HTTP 403 status code represent?",
    options: JSON.stringify([
      "Not Found",
      "Unauthorized",
      "Forbidden",
      "Bad Request"
    ]),
    correctAnswer: "Forbidden",
    explanation: "The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it.",
    difficulty: "EASY",
    topic: "HTTP",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "Which command is used in Prisma to push your Prisma schema state to the database without generating migrations?",
    options: JSON.stringify([
      "npx prisma migrate dev",
      "npx prisma db push",
      "npx prisma generate",
      "npx prisma deploy"
    ]),
    correctAnswer: "npx prisma db push",
    explanation: "The `prisma db push` command pushes the state of your Prisma schema to the database without creating a migration file.",
    difficulty: "MEDIUM",
    topic: "Prisma",
    marks: 1,
    negativeMarks: 0.25
  },
  {
    question: "In PostgreSQL, what is the purpose of the JSONB data type compared to JSON?",
    options: JSON.stringify([
      "JSONB stores JSON as plain text, while JSON uses binary.",
      "JSONB validates the JSON structure on insert, while JSON does not.",
      "JSONB stores data in a decomposed binary format, enabling indexing and faster processing.",
      "There is no difference; they are aliases for the same type."
    ]),
    correctAnswer: "JSONB stores data in a decomposed binary format, enabling indexing and faster processing.",
    explanation: "JSONB stores data in a decomposed binary format, making it slightly slower to input due to added conversion overhead, but significantly faster to process since no reparsing is needed, and it supports indexing.",
    difficulty: "HARD",
    topic: "PostgreSQL",
    marks: 2,
    negativeMarks: 0.5
  }
];

async function main() {
  console.log("Seeding Screening Assessment & Questions...");

  // Upsert the main assessment
  const assessment = await prisma.assessment.upsert({
    where: { id: "cl_screening_assessment" }, // Just a unique placeholder id, Prisma upsert needs unique. Wait, 'id' is CUID by default but we can set it.
    update: {},
    create: {
      id: "cl_screening_assessment",
      title: "CSDAC Internship Screening Assessment",
      duration: 30, // 30 minutes
      totalMarks: 23, // 20 questions, some are 2 marks
      passingMarks: 12,
      isActive: true,
    }
  });

  console.log(`Created Assessment: ${assessment.title}`);

  // Clear existing questions for this assessment to prevent duplicates if run multiple times
  await prisma.assessmentQuestion.deleteMany({
    where: { assessmentId: assessment.id }
  });

  for (const q of questions) {
    await prisma.assessmentQuestion.create({
      data: {
        assessmentId: assessment.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
      }
    });
  }

  console.log(`Successfully seeded ${questions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
