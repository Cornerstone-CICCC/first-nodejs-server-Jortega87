import http from "http";

const PORT = 3000;

interface Post {
  id: number;
  title: string;
}

let posts: Post[] = [
  {
    id: 1,
    title: "First Post",
  },
];

const server = http.createServer(async (request, response) => {
  const requestURL = request.url ?? "";
  const requestMethod = request.method ?? "";

  response.setHeader("Content-Type", "application/json");

  // GET /posts
  if (requestURL === "/posts" && requestMethod === "GET") {
    response.writeHead(200);
    response.end(JSON.stringify(posts));
    return;
  }

  // GET /posts/1
  if (
    requestURL.startsWith("/posts/") &&
    requestMethod === "GET"
  ) {
    const id = Number(requestURL.split("/")[2]);

    const post = posts.find((p) => p.id === id);

    if (!post) {
      response.writeHead(404);
      response.end(
        JSON.stringify({ message: "Post not found" })
      );
      return;
    }

    response.writeHead(200);
    response.end(JSON.stringify(post));
    return;
  }

  // POST /posts
  if (requestURL === "/posts" && requestMethod === "POST") {
    let body = "";

    for await (const chunk of request) {
      body += chunk;
    }

    const data = JSON.parse(body);

    const newPost: Post = {
      id: Date.now(),
      title: data.title,
    };

    posts.push(newPost);

    response.writeHead(201);
    response.end(JSON.stringify(newPost));
    return;
  }

  // PUT /posts/1
  if (
    requestURL.startsWith("/posts/") &&
    requestMethod === "PUT"
  ) {
    const id = Number(requestURL.split("/")[2]);

    let body = "";

    for await (const chunk of request) {
      body += chunk;
    }

    const data = JSON.parse(body);

    const post = posts.find((p) => p.id === id);

    if (!post) {
      response.writeHead(404);
      response.end(
        JSON.stringify({ message: "Post not found" })
      );
      return;
    }

    post.title = data.title;

    response.writeHead(200);
    response.end(JSON.stringify(post));
    return;
  }

  // DELETE /posts/1
  if (
    requestURL.startsWith("/posts/") &&
    requestMethod === "DELETE"
  ) {
    const id = Number(requestURL.split("/")[2]);

    posts = posts.filter((p) => p.id !== id);

    response.writeHead(200);
    response.end(
      JSON.stringify({
        message: "Post deleted",
      })
    );
    return;
  }

  response.writeHead(404);
  response.end(
    JSON.stringify({
      message: "Route not found",
    })
  );
});
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});