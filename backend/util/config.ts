require("dotenv").config();

const PORT = process.env.PORT || 3001;
const DATABASE_URL =
  process.env.NODE_ENV === "test" || process.env.NODE_ENV === "teste2e"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

export default { DATABASE_URL, PORT };
