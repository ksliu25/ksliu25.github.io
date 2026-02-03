---
title: Database Fundamentals - Optimistic locking
date: "2026-02-03"
description: Reflections on optimistic locking specifically implemented in Spring boot with Postgres
---

As opposed to pessimistic locking which translates into FOR UPDATE from Hibernate, Optimistic locking simply passes on a "WHERE VERSION = 4" in the update statement. This is small but significant change in the application code and end user flow. Since pessimistic locking LOCKS that row entirely, if we go back to the kiosk example they would reach a screen that would just HANG and see a spinner until the person editing that row finishes what they're doing (resulting in a TICKET SOLD notification).

Remember also that the first example is a "LOST UPDATE" as default behavior. If we don't catch and have business logic, at contention or concurrent behavior, SQL would see nothing wrong with the ticket inventory being decremented past 0. You can't even have busines logic to catch this either! Let's say you have something that says "If inventory < 1, fail!" in your java spring boot code. because that in flight transaction is reading stale data, it would think the inventory is still 1!

You'd have to use some sort of UNIQUE CONSTRAINT as an integrity constraint, like this

```
ALTER TABLE tickets ADD CONSTRAINT quantity_not_negative CHECK (quantity >= 0);
```

Anyways. Let's move onto optimistic. If the default just goes through (or fails with that constraint above but the intent is a little wonky vs just having a pessmistic lock), and the pessmistic locks the screen, optmistic will simply pass along that WHERE VERSION is as we said. This DOESN'T result in a SQL db failure as "0 rows updated" seem fine, but at the application spring boot level an OptimisticLockingFailureException happens!

Unlike the lock annotation, we add a @version annotation to our entity:

```
@Entity
public class Ticket {
    @Id
    private Long id;
    private Integer quantity;

    @Version  // <--- The Magic Ingredient
    private Long version;
}
```

and then in our service

```
@Transactional
public void purchaseTicket(Long ticketId) {
    // 1. SELECT: Alice and Bob both get the ticket with version = 1
    Ticket ticket = repo.findById(ticketId).get();

    if (ticket.getQuantity() > 0) {
        paymentService.charge(user, price); // The "Human Window"
        
        ticket.setQuantity(ticket.getQuantity() - 1);
        
        // 2. SAVE: Alice succeeds.
        // When Bob tries, Hibernate runs: 
        // UPDATE ticket SET quantity=0, version=2 WHERE id=1 AND version=1;
        // Bob's call fails here with OptimisticLockingFailureException.
        repo.save(ticket);
    }
}
```

I tried using a kiosk analogy for this with Gemini, it summed it up as this:

```
How it compares to your Kiosk thoughts:
You mentioned: "instead of hanging or saying it's out of date, we could display the same error again right, that the version is out of date if there's any concurrency?"

Exactly. The user experience is:

Pessimistic: Bob waits for Alice to finish (Slow).

Optimistic: Bob does all his work, but when he hits "Confirm," he gets an immediate "Sorry, someone beat you to it" message (Fast, but potentially annoying for Bob).

When to use which?
Pessimistic: High contention (e.g., a "Flash Sale"). If you know 100 people are fighting for 1 item, don't let 99 people fill out credit card forms just to fail at the end. Make them wait.

Optimistic: Low contention (e.g., editing a User Profile). It's rare that two people edit the same profile at the exact same second, so don't bother with the overhead of locks.
```

