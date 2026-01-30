---
title: Database Fundamentals - Default MVCC behavior in PostgreSQL
date: "2026-01-29"
description: Exploring the motivations for optimistic and pessimistic locking specifically implemented in Spring boot with Postgres
---

## Stuff taken directly from my conversations with chatgpt/Gemini because I'm too dumb to understand basic computer science

Postgres MVCC lets everyone read and write at the same time by keeping multiple versions of data. It doesn’t stop conflicts — it just avoids blocking.
Optimistic and pessimistic locking are how the application decides what to do when conflicts matter.
MVCC is optimistic in attitude (assume things won’t collide), but it doesn’t enforce correctness. Locking is where correctness gets enforced

```
Imagine a giant concert stadium.

The Snapshot (MVCC): Person A and Person B both walk up to their own separate electronic kiosks at the exact same time. When they touch the screen, the kiosk pulls a "snapshot" of the seating map. Both screens show one seat left (Seat 1A).

The Interpretation: * Person A thinks: "Awesome, Seat 1A is free. I'll take it."

Person B thinks: "Awesome, Seat 1A is free. I'll take it."

The Lost Update (The Conflict):

Person A hits "Confirm." The database (Postgres) sees the seat is currently empty and marks it as "Sold to A."

Person B hits "Confirm" a millisecond later and the transaction goes through
```
Make note that the concurrency in this case, although it says millisecond later, can specifically mean "execution windows".

Take a look at a default bread and butter spring boot implementaiton

```
@Transactional
public void purchaseTicket(Long ticketId) {
    // 1. SELECT: Get current inventory
    Ticket ticket = repo.findById(ticketId); // Inventory = 1
    
    if (ticket.getQuantity() > 0) {
        
        // 2. THE HUMAN WINDOW: 3rd party credit card call (takes 2 seconds)
        paymentService.charge(user, price); 
        
        // 3. UPDATE: Decrement and save
        ticket.setQuantity(ticket.getQuantity() - 1);
        repo.save(ticket); 
    }
}
```

If you have two users, Alice and Bob, the sequence looks like this:

```
T1: Alice hits the endpoint. Her transaction starts. She executes SELECT and sees Quantity = 1.

T2: Bob hits the endpoint. His transaction starts. He executes SELECT and also sees Quantity = 1 because Alice hasn't changed anything yet.

T3: Alice is waiting for the credit card API (the 2-second "Human Window").

T4: Bob is also waiting for the credit card API.

T5: Alice’s payment clears. Her code executes the UPDATE to set Quantity = 0. Her transaction commits.

T6: Bob’s payment clears. His code executes the UPDATE to set Quantity = 0. His transaction commits.

The Result: Two people paid, but the inventory only went down by 1.
```
I had a hard time forming a coherent mental model on this as I needed more and more concrete examples to understand what "concurrency" really meant in the context of "two database transactions come in at the same time!" (Which is a somewhat separate but related topic...)

```
Why this is a "Human Level" problem
You mentioned this is for human-level timing. You're right because:

DB level: Transactions usually take microseconds.

App level: Between the SELECT and the UPDATE, you might have business logic, loops, or IO calls.

If you use a "Long Conversation" (like a user opening an 'Edit' screen, going to get coffee, and then hitting 'Save'), the window isn't 2 seconds; it's 20 minutes. Plain MVCC is completely helpless here because the database cannot hold a lock for 20 minutes while a user is away from their keyboard.
```
Talking more with Gemini, I wanted to know if these things occurred near the outset of web development because it just didn't make much sense to me that a user would enter an "edit" mode and have a long running db connection open for that long... but these ideas are very educational to explore and glean the intuition going from the very start to finish of modern web development.

```
Phase 1: The "Wild West" (Plain MVCC)In the early days of simple web apps, we relied on the database's default behavior.
The Flow: Alice reads data > Alice sees it on her screen > Alice clicks "Save" 10 minutes later > The app sends an UPDATE.

The Problem: If Bob edited the same record while Alice was at lunch, Alice’s "Save" would blindly overwrite Bob’s changes. This is the Lost Update in a stateless environment.

Intuition: The database is just a filing cabinet. It doesn't know Alice's "Save" is based on 10-minute-old information.
```