// Lesson 9 — Pause Before You Allow It
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-9",
  "num": 9,
  "arc": "How It Works",
  "title": "Pause Before You Allow It",
  "coreQuestion": "Before I sign in, upload, download, grant access, pay, post, or let an AI act, what should I check?",
  "blurb": "Safety is not one magic browser word. Check the destination, data, access, commitment, and way back before you allow a consequential action.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The button is not the decision",
      "scenario": "A link opens a polished AI study tool. It asks you to 'Continue with Google,' allow access to your Drive, install a helper download, and start a trial. The page uses HTTPS and looks professional. None of that, by itself, proves who operates it or what will happen after you approve.",
      "prompt": "Before selecting anything, name two consequences you would want to understand. What could the service receive, change, download, charge, send, or keep?"
    },
    {
      "kind": "reveal",
      "title": "Check the consequence, not a trigger word",
      "body": "A secure-looking page can still be deceptive, and an unfamiliar warning can appear on a legitimate service. Do not reduce safety to 'password and payment mean pause' or 'Not secure means leave.' Instead, pause before any action that shares data, grants access, downloads software, creates a commitment, publishes or sends something, or may be difficult to undo.\n\nUse seven checks:\n1. Identity — who is asking?\n2. Destination — what exact app, domain, account, or recipient will receive the action?\n3. Data — what information will be uploaded, retained, or exposed?\n4. Permissions — what can the service view, create, change, or send, and for how long?\n5. Downloads and commitments — will this install software, start a renewal, charge money, publish content, or contact someone?\n6. Reversibility — can you undo it, revoke access, cancel, recover, or remove the data?\n7. Independent route — can you close the link and reopen the service through a known app, saved bookmark, official provider page, or trusted contact?",
      "mistake": "Trusting a page because it looks official, uses HTTPS, or avoids a short list of alarming words.",
      "good": "Pause before consequence, inspect what will happen, and verify the service through a route the request did not control."
    },
    {
      "kind": "classify",
      "title": "Read, or pause before allowing?",
      "prompt": "Sort each action. 'Read or navigate' does not grant new access or create a commitment. 'Pause before allowing' changes data, access, software, money, communication, or recovery options.",
      "buckets": [
        "Read or navigate",
        "Pause before allowing"
      ],
      "items": [
        {
          "text": "Open the Help page inside an app you reached through your own bookmark.",
          "answer": 0
        },
        {
          "text": "Allow an AI extension to read and change data on every website you visit.",
          "answer": 1
        },
        {
          "text": "Upload a school document containing names and private feedback.",
          "answer": 1
        },
        {
          "text": "Read the price and renewal terms without starting the trial.",
          "answer": 0
        },
        {
          "text": "Download and open a 'required AI helper' from a link in an unexpected message.",
          "answer": 1
        },
        {
          "text": "Approve 'Continue with Google' when the service requests Drive, contacts, and email access.",
          "answer": 1
        },
        {
          "text": "Let an agent send the drafted email automatically.",
          "answer": 1
        },
        {
          "text": "View account settings to learn where connected apps can be revoked.",
          "answer": 0
        }
      ],
      "reveal": "The pause happens before you grant, upload, install, pay, publish, send, or commit — not merely when a particular word appears. Reading a screen is different from approving its consequence."
    },
    {
      "kind": "workflowChain",
      "title": "Verify without using the path that asked",
      "goal": "Evaluate an unexpected link that claims your AI account needs urgent permission to avoid being locked.",
      "correct": [
        "Stop before signing in, downloading, or approving access",
        "Identify the claimed provider and inspect the exact destination",
        "List the data, permissions, downloads, and commitments being requested",
        "Check whether each consequence is necessary and reversible",
        "Close the link and navigate independently through a known app, bookmark, or official page",
        "Use the provider's official support or a trusted person if uncertainty remains",
        "Revoke access, change credentials, or report the request if something was already approved"
      ],
      "choices": [
        "List the data, permissions, downloads, and commitments being requested",
        "Use the provider's official support or a trusted person if uncertainty remains",
        "Stop before signing in, downloading, or approving access",
        "Revoke access, change credentials, or report the request if something was already approved",
        "Identify the claimed provider and inspect the exact destination",
        "Close the link and navigate independently through a known app, bookmark, or official page",
        "Check whether each consequence is necessary and reversible"
      ],
      "note": "Do not use the suspicious link's phone number, reply address, QR code, or support button to verify itself. Independent navigation breaks the requester's control of the route."
    },
    {
      "kind": "compare",
      "title": "HTTPS is protection in transit, not proof of identity",
      "weak": "The page has a lock icon and looks official, so every permission it asks for is safe.",
      "strong": "A protected connection can still lead to the wrong service. I will verify the exact provider and destination, inspect requested access and commitments, and reopen the account independently before approving anything.",
      "why": "Connection security helps protect data while it travels. It does not prove that the recipient deserves the data, that a download is safe, or that the requested permission is necessary."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save your pause-before-allowing check",
      "cardType": "Permission and commitment check",
      "fields": [
        {
          "key": "identity",
          "label": "Identity and destination",
          "placeholder": "Who is asking, and what exact app, domain, account, or recipient will receive it?"
        },
        {
          "key": "dataAccess",
          "label": "Data and permissions",
          "placeholder": "What can it view, keep, create, change, upload, or send?"
        },
        {
          "key": "commitment",
          "label": "Download or commitment",
          "placeholder": "Will it install, renew, charge, publish, message, or act?"
        },
        {
          "key": "recovery",
          "label": "Reversibility and independent route",
          "placeholder": "How can I undo it, revoke it, and reopen the real service without this link?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Choose the safe next move",
      "question": "A convincing message says your AI account will close in ten minutes unless you use its link, sign in, install a browser helper, and grant access to your files. The linked page uses HTTPS. What should you do?",
      "options": [
        {
          "text": "Stop. Do not use the link, sign in, install, or grant access. Open the provider independently, check the account there, and use official support; if I already approved something, revoke it and secure the account.",
          "ok": true,
          "feedback": "Correct. You checked identity and destination, refused unnecessary access and downloads, broke the urgent route, and kept a recovery plan."
        },
        {
          "text": "Continue because HTTPS and professional design prove the service is legitimate.",
          "ok": false,
          "feedback": "HTTPS protects a connection; it does not prove who deserves your credentials, files, or device access."
        },
        {
          "text": "Only pause when the page asks for a card number; file access and downloads are routine.",
          "ok": false,
          "feedback": "Permissions, uploads, downloads, messages, and account access can be as consequential as a payment. Pause before allowing any of them."
        },
        {
          "text": "Ask the same linked page's chatbot whether the link is safe, then follow its answer.",
          "ok": false,
          "feedback": "A request cannot verify itself. Close it and use an independent route you already trust."
        }
      ]
    }
  ]
};
