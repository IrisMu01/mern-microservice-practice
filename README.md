# mern-microservice-practice

todos - features in general:
- random terrain generation

todos - backend:
- standardize mongoose entity `id` and `_id` usages: `_id` preferred
- consider writing the username into session cache as well to reduce # of `User` collection lookups - a commonly used field in creating activity logs
- map enum values with keys to prevent fat-fingering

todos - frontend: 
- refactor to make form state management code less repetitive
