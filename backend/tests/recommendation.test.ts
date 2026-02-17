import request from 'supertest';
import app from '../index';
import { sequelize } from '../util/db';
import { User, Recommendation, Token } from "../models";
import { connectToDatabase } from "../util/db";


beforeAll(async () => {
  await connectToDatabase();
});

let validToken: any;
const invalidToken = "fsnfihspfahpahfpahfpafh";
let loginUser: any;

const recommendation1 = 
  {
    title: "Eka",
    service: "Service1",
    url: "www.eka.fi",
    likes: 0,
  }
const recommendation2 =
  {
    title: "Toka",
    service: "Service2",
    url: "www.toka.fi",
    likes: 0,
  }


beforeEach(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Recommendation.destroy({ truncate: true, cascade: true });
    await Token.destroy({ truncate: true, cascade: true });
    

    const user = {
        username: "katri",
        password: "salasana",
    };
    await request(app).post("/api/users").send(user);
    loginUser = await request(app).post("/api/login").send(user);
    validToken = loginUser.body.token;
    await request(app).post("/api/recommendations").send(recommendation1).set("Authorization", `Bearer ${validToken}`)
    await request(app).post("/api/recommendations").send(recommendation2).set("Authorization", `Bearer ${validToken}`)
});

describe("get recommendations", () => {
  test("recommendations are returned as json", async () => {
    const response = await request(app)
      .get("/api/recommendations")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.length).toBe(2)
  });

});

describe("add recommendation", () => {
  test("recommendation can be added with valid token", async () => {
    await request(app)
      .post("/api/recommendations")
      .send({
        title: "Kolmas",
        service: "Service3",
        url: "www.kolmas.fi",
        likes: 0
      })
      .set("Authorization", `Bearer ${validToken}`)
      .expect(201);

    const recommendations = await Recommendation.findAll({});

    expect(recommendations.length).toBe(3)

    const titles = recommendations.map((recommendation) => recommendation.title);
    expect(titles).toContain("Kolmas");
  });

  test("recommendation cannot be added with invalid token", async () => {
    const response = await request(app)
      .post("/api/recommendations")
      .send({
        title: "Kolmas",
        service: "Service3",
        url: "www.kolmas.fi",
        likes: 0,
    
      })
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);

      expect(response.body.error).toBe("Token missing or invalid");

  });

  test("default number of likes is zero", async () => {
    const response = await request(app)
      .post("/api/recommendations")
      .send({
        title: "Kolmas",
        service: "Service3",
        url: "www.kolmas.fi",
      })
      .set("Authorization", `Bearer ${validToken}`)
      .expect(201);

    const likes = response.body.likes;
    expect(likes).toBe(0)
  });

  test("recommendation cannot be added without title or service", async () => {
    await request(app)
      .post("/api/recommendations")
      .send({
        service: "Service3",
        url: "www.kolmas.fi",
      })
      .set("Authorization", `Bearer ${validToken}`)
      .expect(400);

    await request(app)
      .post("/api/recommendations")
      .send({
        title: "Kolmas",
      })
      .set("Authorization", `Bearer ${validToken}`)
      .expect(400);
  });
});

describe("deleting recommendation", () => {
  test("a recommendation can be deleted", async () => {
    const response = await request(app)
      .post("/api/recommendations")
      .send({
        title: "Poistettava",
        service: "Service",
      })
      .set("Authorization", `Bearer ${validToken}`);

    const recommendationToDelete = await Recommendation.findByPk(response.body.id);
    if (recommendationToDelete) {
    await request(app)
      .delete(`/api/recommendations/${recommendationToDelete.id}`)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(204);
    }

    const recommendations = await Recommendation.findAll({});

    const titles = recommendations.map((recommendation) => recommendation.title);
    expect(titles).not.toContain("Poistettava")
  });
});


describe("modifying recommendation", () => {
    test("recommendation can be modified", async () => {
        let recommendationToModify = await Recommendation.findOne({
            where: {
                title: "Eka"
            }
        });

        let id = recommendationToModify?.id



        const updatedRecommendation = {
            likes: 3,
        };

        const response = await request(app)
            .put(`/api/recommendations/${id}`)
            .send(updatedRecommendation)
            .set("Authorization", `Bearer ${validToken}`)
            .expect(200);

        expect(response.body.likes).toBe(3)

        const modifiedRecommendation = await Recommendation.findByPk(id);

       
        expect(modifiedRecommendation?.likes).toBe(3);
        
    });
  });


afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true });
  await Recommendation.destroy({ truncate: true, cascade: true });
  await Token.destroy({ truncate: true, cascade: true });
  
  await sequelize.close();
});