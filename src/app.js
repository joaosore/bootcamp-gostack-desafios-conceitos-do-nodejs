const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const getRepositoryIndex = repositories.findIndex(p => p.id === id);

  if(getRepositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'});
  }

  if(getRepositoryIndex >= 0) {

    const { likes } = repositories[getRepositoryIndex];

    const repository = {
      id,
      title,
      url,
      techs,
      likes
    }

    repositories[getRepositoryIndex] = repository;

    return response.json(repository);
  }

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const getRepositoryIndex = repositories.findIndex(p => p.id === id);

  if(getRepositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'});
  }

  repositories.splice(getRepositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const getRepositoryIndex = repositories.findIndex(p => p.id === id);

  if(getRepositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'});
  }

  if(getRepositoryIndex >= 0) {
    const { likes } = repositories[getRepositoryIndex];
    repositories[getRepositoryIndex].likes = likes + 1;
  }

  const repository = repositories[getRepositoryIndex];

  return response.json(repository);

});

module.exports = app;
