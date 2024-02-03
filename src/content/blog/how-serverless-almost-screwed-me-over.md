---
title: I'm not sure I like serverless
author: Emil Sharier
pubDatetime: 2024-02-03T08:05:08.995Z
slug: how-serverless-almost-screwed-me-over
draft: true
tags:
  - serverless
  - web-dev
  - AWS
  - rant
ogImage: "https://blog.entrostat.com/content/images/size/w2000/2018/09/nestjs-2.jpg"
description: Some thoughts after trying out Nest.js for a couple of weeks
---

### A little background

Our engineering team at [Sigtech](https://sigtech.com) has decided to rewrite all our microservices as a part of the second iteration. Why a rewrite, you say? Because the tech stack heavily relied on [Serverless](https://www.serverless.com/) as a solution and it came to bite the team back after 3 years. How did this happen? As and when the user base increases, you realize something which is painful. **Lambdas aren't cheap,** _in fact they're bloody expensive_.

So here I am, given duties of rewriting some of the core components keeping scalability & performance in mind.

### Why Nest.js? Hell! Why even think of Node at all?

I have been writing APIs in Node for a little over 2 years now. Is it the best thing available out there? Probably not. You might argue saying [Go](https://go.dev/) with [Gin](https://github.com/gin-gonic/gin) might be more performant. However, I choose Node because everything is in the Javascript ecosystem & it helps me quickly iterate on frontend work with React. Yes, guilty as charged. I prefer Node just because of the convenience it offers.

### What did I like about Nest.js?

[Express.js](https://expressjs.com/) is my go-to framework for hosting a quick and simple REST API. I'd use this without any particular design pattern in my pet project's codebase.
However, that isn't the case when you write code for any company. There are rules, guidelines etc. for you to follow so that the code is "readable" by all engineers alike.

Nest.js is like a nice bootstrap template over Express.js. Their main selling point is [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection#:~:text=Dependency%20injection%20aims%20to%20separate,how%20to%20construct%20those%20services.) ~~_Omega lol who gives a shit about dependency injection in a language like JS where I can write re-usable modules_~~.

> [Refactoring guru](https://refactoring.guru/) is an amazing collection of docs around different design patterns. And they're all free!!

The authors encourages us to stick and adhere to a design pattern/principle & provides neat abstractions, routing and other essentials that are needed for hosting a REST API. They promote the use of ES6 components like class decorators which are heavily used within Nest.js.

I'd recommend Nest.js

- Because you want to implement a strict pattern and maintain a structure to the codebase.
- As it has plenty of utilities that aid in adding tests & connecting with other adapters like sequelize, mongoose etc.
- As you can leverage Dependency injection and cache management to efficiently re-use objects that can lead to less overhead on memory.
