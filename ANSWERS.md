# JavaScript Polling in the KwickPOS Tampermonkey Script

## Topic

This note summarizes the questions and answers about the `setInterval()` polling used to initialize the KwickPOS frame/button script.

---

## 1. Why does the script poll?

The script uses:

```javascript
const initInterval = setInterval(() => {
    // initialization code
}, 50);
```

This means:

> Run the initialization code every 50 milliseconds.

The reason is that the script uses:

```javascript
// @run-at document-start
```

So the userscript starts very early, potentially before KwickPOS has finished creating its frames and documents.

For example, when the script first starts:

```text
Userscript starts
      ↓
mylog frame may not exist yet
      ↓
mywin frame may not exist yet
      ↓
mywin's document/body may not exist yet
      ↓
KwickPOS continues loading
      ↓
Required elements eventually appear
```

Polling gives the script repeated opportunities to find those elements after they become available.

---

# 2. Should polling stop once the button exists?

**Yes.**

This was the main question.

If the purpose of polling is to initialize the button, then once the button has successfully been created and exists in the document, there is normally no reason to continue polling for initialization.

The ideal behavior is:

```text
Keep trying
     ↓
Button does not exist
     ↓
Try again
     ↓
Button does not exist
     ↓
Try again
     ↓
Button exists
     ↓
STOP POLLING
```

The important idea is:

> Poll until the required condition is satisfied, then stop.

---

# 3. Why doesn't calling `injectCompactButton()` automatically mean the button exists?

Because the function can be called without successfully creating the button.

The function contains:

```javascript
if (
    !winDoc ||
    !winDoc.body ||
    winDoc.getElementById('kwick-compact-toggle')
) {
    return;
}
```

There are several possible situations.

### Situation A: `winDoc` does not exist yet

```javascript
!winDoc
```

is `true`.

The function returns without creating anything.

### Situation B: The document exists but its body is not ready

```javascript
!winDoc.body
```

is `true`.

Again, the function returns.

### Situation C: The button already exists

```javascript
winDoc.getElementById('kwick-compact-toggle')
```

returns the existing button.

The function returns because there is nothing else to create.

### Situation D: Everything is ready

The function continues:

```javascript
const btn = winDoc.createElement('button');
```

and eventually:

```javascript
winDoc.body.appendChild(btn);
```

Now the button actually exists in the document.

Therefore:

> Calling `injectCompactButton()` is not the same thing as successfully initializing the button.

---

# 4. Why can we keep polling until the button actually exists?

Yes, this is a valid design.

For example:

```javascript
const initInterval = setInterval(() => {

    injectCompactButton();

    const winDoc = getMyWinDocument();

    if (
        winDoc &&
        winDoc.getElementById('kwick-compact-toggle')
    ) {
        clearInterval(initInterval);
    }

}, 50);
```

The logic is:

1. Try to inject the button.
2. Check whether the button exists.
3. If it exists, stop the interval.
4. Otherwise, wait 50 ms and try again.

---

# 5. Why might we NOT want to poll forever?

This is the resource concern.

Suppose something is permanently wrong:

```text
mywin frame never loads
```

If we poll forever:

```text
50 ms → fail
50 ms → fail
50 ms → fail
50 ms → fail
...
50 ms → fail
50 ms → fail
...
```

The script continues executing the same checks indefinitely.

Each individual check is small, but unnecessary repeated work is still undesirable.

For example, the script may repeatedly perform:

```javascript
querySelector(...)
```

and:

```javascript
getElementById(...)
```

and other DOM operations.

Therefore:

> Polling forever provides maximum persistence, but can waste resources if the required element can never appear.

---

# 6. What about the original five-attempt approach?

The original script contains:

```javascript
let attempts = 0;

const initInterval = setInterval(() => {

    if (hasMyLogFrame()) {
        setFramesetCols(isCollapsed);
        injectCompactButton();
    }

    attempts++;

    if (attempts >= 5) {
        clearInterval(initInterval);
    }

}, 50);
```

Because the interval is 50 ms:

```text
5 attempts × 50 ms = approximately 250 ms
```

So the script essentially says:

> Try for about 250 milliseconds, then stop regardless of whether initialization succeeded.

---

# 7. What is the problem with stopping after exactly five attempts?

The problem is that **five attempts does not necessarily mean initialization succeeded.**

For example:

```text
0 ms      Userscript starts
50 ms     KwickPOS not ready
100 ms    KwickPOS not ready
150 ms    KwickPOS not ready
200 ms    KwickPOS not ready
250 ms    KwickPOS finally starts creating frames
          ↓
          Script stops
```

The script may give up just before the required elements become available.

Therefore, the five-attempt approach is simple, but it is not necessarily the most reliable.

---

# 8. What is the better approach?

A good practical design is:

> **Keep polling until initialization succeeds, but also set a maximum number of attempts/time as a safety net.**

For example:

```javascript
let attempts = 0;

const initInterval = setInterval(() => {

    if (hasMyLogFrame()) {
        setFramesetCols(isCollapsed);
        injectCompactButton();

        const winDoc = getMyWinDocument();

        if (
            winDoc &&
            winDoc.getElementById('kwick-compact-toggle')
        ) {
            clearInterval(initInterval);
            return;
        }
    }

    attempts++;

    if (attempts >= 100) {
        clearInterval(initInterval);
    }

}, 50);
```

Here:

```text
100 attempts × 50 ms = 5000 ms
```

So the behavior becomes:

```text
                    ┌── Button does not exist ──┐
                    │                            │
Start → Try → Check ─┤                            ├→ Try again
                    │                            │
                    └── Button exists → STOP ───┘

                         OR

                    100 attempts reached
                              ↓
                         STOP anyway
```

This gives us two protections.

### If everything works:

```text
Try
 ↓
Button appears
 ↓
Stop immediately
```

Very little unnecessary work.

### If something is broken:

```text
Try
 ↓
Fail
 ↓
Try
 ↓
Fail
 ↓
...
 ↓
Maximum timeout reached
 ↓
Stop
```

The script does not run forever.

---

# 9. Why return a value from `injectCompactButton()`?

Another clean design is to have the function report whether initialization succeeded.

For example:

```javascript
function injectCompactButton() {
    if (!hasMyLogFrame()) return false;

    const winDoc = getMyWinDocument();

    if (
        !winDoc ||
        !winDoc.body ||
        winDoc.getElementById('kwick-compact-toggle')
    ) {
        return false;
    }

    const btn = winDoc.createElement('button');

    // Configure button...

    winDoc.body.appendChild(btn);

    return true;
}
```

Now the function has a useful contract:

```text
false → button was not created
true  → button was successfully created
```

Then the polling code can be:

```javascript
const initInterval = setInterval(() => {

    const initialized = injectCompactButton();

    if (initialized) {
        clearInterval(initInterval);
    }

}, 50);
```

This is conceptually very clean:

```text
injectCompactButton()
        ↓
"Did initialization succeed?"
        ↓
   ┌────┴────┐
 false      true
   ↓          ↓
try again    STOP
```

---

# 10. Polling is not necessarily "heavy"

`setInterval()` itself is not automatically resource-heavy.

The important factor is:

> What does the callback do, and how often does it run?

This:

```javascript
setInterval(() => {
    // tiny operation
}, 50);
```

is generally a small amount of work.

But unnecessary repeated DOM operations can add up.

For example:

```javascript
setInterval(() => {
    document.querySelector(...);
    document.querySelector(...);
    document.querySelector(...);
    document.getElementById(...);
}, 50);
```

If it runs indefinitely, those operations happen over and over.

Therefore:

> The best practice is to stop polling as soon as the initialization condition has been satisfied.

---

# 11. The important distinction: initialization vs normal operation

Once the button exists, we do NOT need the polling interval to handle the button.

The button already has its event handler:

```javascript
btn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();

    setFramesetCols(!isCollapsed);
};
```

After the button has been created, clicking it directly executes this function.

The interval is only for **initialization**.

Therefore:

```text
Initialization
     ↓
Polling
     ↓
Find/create button
     ↓
Stop polling
     ↓
Normal operation
     ↓
User clicks button
     ↓
onclick handler runs
```

The button does not need the polling timer to continue existing or responding to clicks.

---

# 12. Key takeaway

The most important concept from this discussion is:

> **Polling should normally continue while the required condition is false and stop as soon as the condition becomes true.**

For this KwickPOS script:

```text
Required condition:
"The compact toggle button exists and initialization succeeded."
```

A robust strategy is:

```text
Start polling
     ↓
Is KwickPOS ready?
     ↓
No → wait and try again
     ↓
Yes
     ↓
Try to create button
     ↓
Does button exist?
     ↓
No → wait and try again
     ↓
Yes
     ↓
clearInterval()
     ↓
Initialization complete
```

Then add a maximum timeout/attempt count as a safety net:

```text
Success → stop immediately

Failure → keep trying for a reasonable maximum time → stop
```

This is generally better than:

```text
"Always stop after exactly 5 attempts."
```

because the stopping condition is based on **actual success**, not merely the number of attempts.
