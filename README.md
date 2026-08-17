# Utsavam

> **An interactive English Club experience built for events, competitions, and campus activities.**

Utsavam is a digital event platform created to bring English Club activities into an interactive web experience.

Instead of relying on separate registration forms, physical activities, and disconnected event tools, Utsavam combines event information, participant registration, team management, interactive language games, and themed experiences into one platform.

---

## What is Utsavam?

Utsavam is designed as a **digital companion for an English Club event**.

The platform combines:

- Event information
- Participant registration
- Registration confirmation
- Team management
- Interactive activities
- Language-based games
- Event extras
- Themed experiences

The result is a single web application that can be used before, during, and after an English Club event.

---

## Platform Flow

```text
                    UTSAVAM
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       DISCOVER      REGISTER      EVENTS
          │            │            │
          │            ▼            │
          │       TEAM MANAGEMENT   │
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
                INTERACTIVE GAMES
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
  Word Search     Synonym Challenge   Sentence Fixer
       │               │                │
       └───────────────┼────────────────┘
                       │
             ┌─────────┴──────────┐
             ▼                    ▼
        Guess the Word      Magical Sorter
````

---

# Core Features

## 🏫 Event Portal

The main Utsavam experience provides a centralized entry point for the English Club event.

Participants can explore event information and navigate directly to registration, activities, events, and additional experiences.

---

## 📝 Participant Registration

Utsavam includes a dedicated registration flow for event participants.

The registration experience is separated from the main landing page and includes a dedicated success state after registration.

Routes include:

```text
/register
/registration-success
```

This allows the event team to maintain a clear registration workflow.

---

## 👥 Team Management

The platform includes a dedicated team-management section for organizing participants into teams.

This makes Utsavam suitable for English Club activities where events or competitions involve team participation.

```text
Participants
     │
     ▼
Team Management
     │
 ┌───┴────┐
 ▼        ▼
Teams   Members
```

---

# 🎮 Interactive English Games

One of Utsavam's primary features is its collection of browser-based language games.

These activities are designed to make English Club participation more engaging than traditional static exercises.

---

## 🔎 Word Search

The **Word Search** activity provides an interactive vocabulary-based game.

Participants search for target words inside a digital puzzle environment.

Route:

```text
/word-search
```

This can be used as an individual activity or as part of an event competition.

---

## 🔤 Synonym Challenge

The **Synonym Challenge** tests vocabulary knowledge by asking participants to identify appropriate synonyms.

Route:

```text
/synonym-challenge
```

The activity is designed around fast-paced language interaction and can be incorporated into event rounds.

---

## ✍️ Sentence Fixer

The **Sentence Fixer** activity challenges participants to identify and correct incorrect sentence structures.

Route:

```text
/sentence-fixer
```

This provides an interactive way to test:

* Grammar
* Sentence construction
* English usage
* Error identification

---

## 🧠 Guess the Word

The **Guess the Word** game challenges participants to identify a target word based on the information presented by the game.

Route:

```text
/guess-the-word
```

It adds a more casual and competitive vocabulary activity to the event.

---

## 🪄 Magical Sorter

Utsavam also includes a themed **Magical Sorter** experience.

Route:

```text
/magical-sorter
```

This provides a more immersive and entertainment-focused activity alongside the language games.

The experience allows the English Club event to include a themed participant interaction rather than consisting entirely of traditional educational games.

---

# Events

Utsavam includes a dedicated events section:

```text
/events
```

This provides a central location for presenting event-related information and activities.

---

# Extras

The platform also provides an additional section for event-specific experiences:

```text
/extras
```

This provides room for supplementary content, activities, or interactive experiences without overcrowding the main event interface.

---

# Learn More

A dedicated information section is available through:

```text
/learn-more
```

This allows the platform to separate introductory information from the main activity experience.

---

# Application Architecture

The application uses React Router to divide the platform into independent experiences.

```text
                       React Application
                              │
                     ┌────────┴────────┐
                     │                 │
                 Main Site          Activities
                     │                 │
          ┌──────────┼──────────┐      │
          ▼          ▼          ▼      ├── Word Search
        Events    Register    Extras   ├── Synonym Challenge
                                       ├── Sentence Fixer
                                       ├── Guess the Word
                                       └── Magical Sorter
                             
                     Team Management
```

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* React Router

## UI

* Tailwind CSS
* shadcn/ui
* Radix UI
* Lucide React

## Application Infrastructure

* Supabase
* TanStack React Query
* React Hook Form
* Zod

## Notifications

* Sonner
* Toast-based UI components

---

# Project Structure

```text
utsavam_6/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── games/
│   │   │   ├── SynonymChallenge.*
│   │   │   ├── SentenceFixer.*
│   │   │   └── GuessTheWord.*
│   │   │
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Index.*
│   │   ├── LearnMore.*
│   │   ├── Events.*
│   │   ├── Register.*
│   │   ├── RegistrationSuccess.*
│   │   ├── Extras.*
│   │   ├── TeamManagement.*
│   │   ├── WordSearchGame.*
│   │   ├── MagicalSorter.*
│   │   └── NotFound.*
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.*
└── README.md
```

---

# Getting Started

## Requirements

Install:

* Node.js
* npm

## Clone

```bash
git clone https://github.com/Sakho115/utsavam_6.git
cd utsavam_6
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

---

# Production Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

---

# Event Use Cases

Utsavam can be used for:

* English Club competitions
* College cultural events
* Vocabulary competitions
* Grammar activities
* Team-based language games
* Icebreaker activities
* Interactive participant engagement
* English learning events
* Campus club programs

---

# Design Philosophy

Utsavam is designed around the idea that an English Club event should feel like an **experience**, not just a collection of forms.

The platform combines:

```text
Information
     +
Registration
     +
Teams
     +
Games
     +
Competition
     +
Entertainment
```

into a single digital environment.

---

# Event Experience

A participant's journey can look like:

```text
Discover Utsavam
       ↓
Explore the Event
       ↓
Register
       ↓
Join / Manage Team
       ↓
Explore Activities
       ↓
Play English Games
       ↓
Participate in Themed Experiences
       ↓
Complete the Event
```

---

# Project Status

**English Club Event Platform**

Utsavam was built as a digital platform for English Club activities and events, combining event management with interactive language-focused experiences.

The platform can be extended with additional games, scoring systems, participant analytics, team competitions, event schedules, certificates, and other club-specific functionality.

---

# Author

Developed by **Sakho115**.

GitHub:

[https://github.com/Sakho115](https://github.com/Sakho115)

---

# License

See the repository license for applicable usage and distribution terms.

```
```
