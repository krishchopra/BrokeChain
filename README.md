# BrokeChain

**No more broken smart contracts—just airtight blockchain security with AI-powered auditing.**

## The Problem BrokeChain Solves
Smart contracts can harbor hidden security flaws that lead to major losses. Manual audits are slow, costly, and error-prone. BrokeChain automates the entire audit process by using an AI agent to scan Solidity code, detect vulnerabilities, and explain risks in seconds—making smart contracts safer, faster, and easier to deploy.

## User Interaction and Data Flow
- **Login & GitHub Integration:**  
  Users sign in via GitHub; the system automatically scans their repositories for Solidity smart contracts. Alternatively, users can paste code directly.
- **AI-Powered Analysis:**  
  Submitted code is analyzed with a blend of static analysis (using Semgrep and Slither) and advanced AI reasoning to detect issues like reentrancy, overflows, and access control flaws.
- **On-Chain Verification:**  
  The tool fetches live on-chain details via Flare to ensure the audited code matches the deployed contract.
- **Report Generation:**  
  A detailed security report is produced, offering risk levels and recommended fixes. Reports can be exported as JSON, PDF, Markdown, or plain text.
- **Continuous Improvement:**  
  Users can further train the AI agent on private datasets, enhancing its accuracy over time.

## The Project Architecture and Development Process
**Tech Stack & Overview:**
- **Frontend:**  
  Built with React, featuring a chat-based interface for intuitive interaction and dynamic report exports.
- **Backend:**  
  Developed using FastAPI/Node.js to manage API requests and AI interactions.
- **AI Model:**  
  Fine-tuned on Hugging Face to specialize in identifying vulnerabilities in Solidity contracts.
- **Static Analysis:**  
  Integrated with Semgrep and Slither to catch common issues.
- **On-Chain Verification:**  
  Uses Web3.py to fetch real-time contract data from Flare, ensuring accurate audits.

## Product Integrations
- **Flare Network:**  
  Retrieves on-chain contract ABI, bytecode, and address to verify that the audited contract matches the deployed version.
- **Hugging Face:**  
  Hosts our fine-tuned AI model for vulnerability detection.
- **GitHub:**  
  Enables automatic scanning of user repositories for Solidity contracts.
- **OpenAI API:**  
  Assists in providing contextual vulnerability analysis based on audit data.

## Key Differentiators and Uniqueness
- **Custom AI Training:**  
  Users can train the AI agent on their own datasets, increasing accuracy over time.
- **Dual Analysis Approach:**  
  Combines traditional static analysis with AI-powered reasoning to uncover deeper, less obvious vulnerabilities.
- **Live On-Chain Verification:**  
  Ensures that the audited source code aligns with the actual deployed contract.
- **Multi-Format Reporting:**  
  Provides flexible report exports (text, JSON, PDF, Markdown) for seamless integration into security workflows.

## Trade-offs and Shortcuts
Time constraints led us to prioritize GitHub integration and comprehensive report generation over real-time in-editor analysis. Future iterations will incorporate real-time feedback directly within code editors. For now, the focus is on robust, automated audits across entire repositories.

## Additional Features
- **Audit History Dashboard:**  
  Maintain a record of past audits and track security improvements.
- **User-Friendly Interface:**  
  An intuitive, chat-based UI that requires minimal training for effective use.
- **Buildathon-Exclusive:**  
  Developed entirely during the Buildathon, with planned enhancements for broader integration and real-time analysis in future updates.

## Technologies We Used
React, FastAPI, Node.js, Hugging Face, OpenAI GPT-4, jsPDF, Web3.py, Semgrep, Slither, TailwindCSS, Framer Motion

## Links
- **GitHub:** [https://github.com/krishchopra/BrokeChain](https://github.com/krishchopra/BrokeChain)
- **Website:** [https://brokechain.vercel.app/](https://brokechain.vercel.app/)

## Video Demo
[https://youtu.be/ZZBGl5tzA5Q](https://youtu.be/ZZBGl5tzA5Q)
