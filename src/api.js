const axios = require("axios");
const adapter = require("axios/lib/adapters/http");

axios.defaults.adapter = adapter;

export class CategoryApiClient {
  constructor(url) {
    if (url === undefined || url === "") {
      url = process.env.BASE_URL;
    }
    if (url.endsWith("/")) {
      url = url.substr(0, url.length - 1);
    }
    this.url = url;
  }

  withPath(path) {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return `${this.url}${path}`;
  }

  async getCategories() {
    const url = this.withPath("/api/v1/categories");
    return axios({
      url,
      method: "GET",
      headers: {
        baseSiteId: "CTR",
      },
    }).then((r) => r.data);
  }

  async getCategoryById(id) {
    const url = this.withPath("/api/v1/categories/" + id);
    return axios({
      url,
      method: "GET",
      headers: {
        baseSiteId: "CTR",
      },
    }).then((r) => r.data);
  }
}
