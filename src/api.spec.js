import { imposterPort } from "../test/config";
import { CategoryApiClient } from "./api";
import { startAndClearStubs, writeStubs, stopStubs } from "../test/mountebank";

import {
  Response,
  Imposter,
  Mountebank,
  Stub,
  EqualPredicate,
  HttpMethod,
  NotFoundResponse,
} from "@anev/ts-mountebank";

describe("API Contract Test", () => {
  const mb = new Mountebank();
  const api = new CategoryApiClient(`http://localhost:${imposterPort}`);
  const imposter = new Imposter()
    .withPort(imposterPort)
    .withRecordRequests(true);

  beforeAll(() => startAndClearStubs());
  afterEach(() => writeStubs(mb, imposterPort));
  afterAll(() => stopStubs());

  const categoriesResponse = {
    categories: [
      {
        id: "string",
        name: "string",
        url: "string",
        searchLink: "string",
        image: "string",
        subcategories: [],
      },
    ],
  };

  const categoryResponse = {
    id: "string",
    description: "string",
    image: "string",
  };

  describe("Retrieving categories", () => {
    test("Categories exists", async () => {
      // Arrange
      imposter.withStub(
        new Stub()
          .withPredicate(
            new EqualPredicate()
              .withMethod(HttpMethod.GET)
              .withPath("/api/v1/categories")
          )
          .withResponse(
            new Response().withStatusCode(200).withJSONBody(categoriesResponse)
          )
      );
      await mb.createImposter(imposter);

      // make request to Pact mock server
      const response = await api.getCategories();

      // assert that we got the expected response
      expect(response).toStrictEqual(categoriesResponse);
    });
  });

  describe("Retrieving a category", () => {
    beforeAll(async () => {
      // Arrange
      imposter
        .withStub(
          new Stub()
            .withPredicate(
              new EqualPredicate()
                .withMethod(HttpMethod.GET)
                .withPath("/api/v1/category/DC0000001")
            )
            .withResponse(
              new Response().withStatusCode(200).withJSONBody(categoryResponse)
            )
        )
        .withStub(new Stub().withResponse(new NotFoundResponse()));

      await mb.createImposter(imposter);
    });

    test("ID DC0000001 exists", async () => {
      // Act
      const category = await api.getCategoryById("DC0000001");

      // Assert - did we get the expected response
      expect(category).toStrictEqual(categoryResponse);
    });

    // test("product does not exist", async () => {
    //   // Act + Assert
    //   await expect(api.getProduct("11")).rejects.toThrow(
    //     "Request failed with status code 404"
    //   );
    // });
  });
});
