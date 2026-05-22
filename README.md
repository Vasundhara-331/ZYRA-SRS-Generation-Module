# ZYRA – SRS Generation Module

This is the first module created for ZYRA: AI-Driven Web Development Agent for Requirement-Based UI/UX Design.                                                                                       
This is an AI-powered **Software Requirements Specification (SRS) Generation System** that transforms user prompts into structured and professional SRS documents.  
Built to simplify requirement gathering, documentation, and project planning for developers, startups, and teams.

---

## Features

- AI-powered SRS document generation
- Uses **Ollama Phi-3** for local LLM inference
- Converts prompts into structured software requirements
- Easy document export in JSON, PDF and DOCX formats

---

Install Ollama from:

https://ollama.com

Pull the Phi-3 model:

```bash
ollama pull phi3
```

---
## Installation

### Clone the Repository

```bash
git clone https://github.com/Vasundhara-331/ZYRA-SRS-Generation-Module.git
```

### Navigate to the Project Directory

```bash
cd ZYRA-SRS-Generation-Module
```

### Start the server

```bash
npm install
npm run dev
```

---

## Usage

Run the module and provide project details or prompts to generate an SRS document.

Example prompt:

```text
Create an SRS for a smart hospital management system with patient tracking and appointment scheduling.
```

---
## Workflow

1. User enters software/project requirements
2. Prompt is processed using Ollama Phi-3
3. The model generates structured SRS content
4. Output is displayed/generated as documentation

---
GitHub:  
https://github.com/Vasundhara-331

Repository:  
https://github.com/Vasundhara-331/ZYRA-SRS-Generation-Module
