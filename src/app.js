const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//READ
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//CREATE
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  response.json(repository);
});

//UPDATE
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found'});

  const like = repositories[repositoryIndex].likes;
  const repository = {
    id,
    title,
    url,
    techs,
    like
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

//GIVE LIKES
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params; 

  const repository = repositories.find(repository => repository.id === id);

  if (!repository)
    return response.status(400).json({ error: 'Repository not found'});
  
  repository.likes++;

  repositories[repository] = repository;

  return response.json(repository);
});

module.exports = app;
