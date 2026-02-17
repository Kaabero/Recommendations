import request from 'supertest';
import app from '../index';
import { sequelize } from '../util/db';
import { User, Recommendation, Token } from "../models";
import { connectToDatabase } from "../util/db";

beforeAll(async () => {
  await connectToDatabase();
});


beforeEach(async () => {
  await Recommendation.destroy({ truncate: true, cascade: true });
  await Token.destroy({ truncate: true, cascade: true });
  await User.destroy({ truncate: true, cascade: true });
});


describe("adding user", () => {
  test("user can be added", async () => {
    const newUser = {
      username: "pirjo",
      password: "salasana",
    };

    const response = await request(app).post("/api/users").send(newUser).expect(200);

    expect(response.body.username).toBe("pirjo");

  })
  test("user cannot be added with invalid username or password", async () => {
    let response = await request(app).post('/api/users')
      .send({
        username: "mo",
        password: "salasana",
      })
      .expect(400);

    expect(response.body.error).toBe("Invalid username or password");


    response = await request(app).post('/api/users')
      .send({
        username: "moikka",
        password: "sa",
      })
      .expect(400);

    expect(response.body.error).toBe("Invalid username or password");
  });

  test("user can be added only with unique username", async () => {
    const newUser = {
      username: "katri",
      password: "salasana",
    };
    let response = await request(app).post("/api/users").send(newUser).expect(200);

    expect(response.body.username).toBe("katri");
    

    response = await request(app).post("/api/users")
      .send({
        username: "  KATri  ",
        password: "salasana",
      })
      .expect(400);
    
    expect(response.body.error).toBe("Username already in use");

  });
});


afterAll(async () => {
  await Recommendation.destroy({ truncate: true, cascade: true });
  await Token.destroy({ truncate: true, cascade: true });
  await User.destroy({ truncate: true, cascade: true });
  await sequelize.close();
});
