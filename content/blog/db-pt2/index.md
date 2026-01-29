---
title: Database Fundamentals - Optimistic and Pessimistic locking
date: "2026-01-23"
description: Reflections on optimistic and pessimistic locking specifically implemented in Spring boot with Postgres
---

## Stuff taken directly from my conversations with chatgpt/Gemini because I'm too dumb to understand basic computer science

So we talked about the default behavior of multi version concurrency control in Postgres which is "optimistic" in nature. It's not thinking that there's going to be any contention. There are two different ways to handle this in application code (we're not going to cover the isolation levels at the db level because frankly I haven't explored them quite yet).

As we exemplified before, the default behavior has an implicit lock at the update and allows for "clean" reads making sure that there is no blocking when a resource is being read.

But for financial systems or systems that are of paramount importance -- including what we mentioned before with ticketing systems -- you CAN'T just oversell tickets or lose a deposit, right?

This is where "Pessimistic" locking comes into play. And once again i want to reiterate that mvcc is simply about visibility and not blocking, but now we're introducing specific locking mechanisms that we'll see in the application code.

