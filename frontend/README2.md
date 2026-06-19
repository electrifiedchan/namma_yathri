# 🚀 Artificial Intelligence & Natural Language Processing
### Lab Programs 6–9 (Code Only — No Comments)

> Sentiment Analysis, Text Generation, File Extraction, and Web/Wikipedia Scraping — using `transformers`, `langchain`, `cohere`, and `wikipedia`.

---

## 📌 Table of Contents

| # | Program | Core Library |
|---|---------|---------------|
| 6 | [Sentiment Analysis (Hugging Face & Gemini)](#-program-6--sentiment-analysis-hugging-face--gemini) | `transformers` / `langchain_google_genai` |
| 7 | [Text Generation & Summarization (GPT-2)](#-program-7--text-generation--summarization-gpt-2) | `transformers` |
| 8 | [External File Reading & Extraction (Cohere)](#-program-8--external-file-reading--extraction-cohere) | `langchain-cohere` |
| 9 | [Web Scraping & Structured Extraction (Gemini & Wikipedia)](#-program-9--web-scraping--structured-extraction-gemini--wikipedia) | `langchain_google_genai` / `wikipedia` |

---
---

## 💻 Program 6 — Sentiment Analysis (Hugging Face & Gemini)

<table><tr><td>

### 🔹 Cell 1 — Install Dependencies

</td></tr></table>

```bash
!pip install transformers
```

<table><tr><td>

### 🔹 Cell 2 — Load Pipeline & Define Reviews

</td></tr></table>

```python
from transformers import pipeline

senti_ana = pipeline("sentiment-analysis")

customer_reviews = [
    "I absolutely love this smartphone! The battery life is amazing and the camera is stunning.",
    "Terrible experience. The package arrived two weeks late and the screen was scratched.",
    "It's decent for the price. Not the best quality, but it gets the job done.",
    "Customer service was incredibly helpful when I needed to process a return. Great company!"
]
```

<table><tr><td>

### 🔹 Cell 3 — Run Sentiment Analysis

</td></tr></table>

```python
results = senti_ana(customer_reviews)

for sentence, result in zip(customer_reviews, results):
    print(f"Sentence: {sentence}\nSentiment: {result['label']}, Confidence: {result['score']:.2f}\n")
```

<table><tr><td>

### 🔹 Cell 4 — Install LangChain + Gemini Dependencies

</td></tr></table>

```bash
!pip install -qU langchain-google-genai langchain
```

<table><tr><td>

### 🔹 Cell 5 — Sentiment Analysis via Gemini Prompt Chain

</td></tr></table>

```python
import os
from getpass import getpass
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

print("Enter your Google API Key:")
os.environ["GOOGLE_API_KEY"] = getpass()

text_list = [
    "The product quality is amazing! I'm very satisfied.",
    "I had a terrible experience with customer service.",
    "The delivery was quick, but the packaging was damaged.",
    "Absolutely love this! Best purchase I've made.",
    "Not worth the money, very disappointed."
]

formatted_text = "\n".join([f"- {t}" for t in text_list])

template = """Perform the sentiment analysis for the following:{text}.
Answer: Following is the sentiment for the given text:"""

prompt = PromptTemplate.from_template(template)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.5
)

llm_chain = prompt | llm

print("\nInvoking Model...\n")
response = llm_chain.invoke({"text": formatted_text})

print("Output:")
print(response.content)
```

---
---

## 💻 Program 7 — Text Generation & Summarization (GPT-2)

<table><tr><td>

### 🔹 Cell 1 — Load GPT-2 Pipeline

</td></tr></table>

```python
from transformers import pipeline

generator = pipeline('text-generation', model='gpt2')
```

<table><tr><td>

### 🔹 Cell 2 — Define Source Text

</td></tr></table>

```python
long_text = """
Artificial intelligence (AI) is a rapidly expanding field of computer science dedicated to solving cognitive problems commonly associated with human intelligence, such as learning, problem-solving, and pattern recognition. The term 'AI' was coined in 1956 at a conference at Dartmouth College. Modern AI techniques include machine learning, deep learning, and natural language processing. Machine learning involves training algorithms on large datasets to make predictions or decisions without being explicitly programmed. Deep learning, a subset of machine learning, uses neural networks with many layers to analyze various factors in data. Natural language processing (NLP) enables computers to understand, interpret, and generate human language. AI has applications across numerous industries, including healthcare (e.g., disease diagnosis), finance (e.g., fraud detection), automotive (e.g., self-driving cars), and entertainment (e.g., personalized recommendations). The ethical implications of AI, such as bias in algorithms and job displacement, are active areas of research and debate.

Despite these advantages, AI's integration into education is not without challenges. Ethical concerns surrounding data privacy, bias in AI algorithms, and the digital divide must be addressed to ensure equitable access to AI-driven education. Institutions must adopt transparent AI governance policies, emphasizing accountability and inclusivity in algorithmic decision-making. Additionally, educators must be equipped with the necessary training to effectively implement AI tools within their instructional practices, ensuring that technology serves as an enabler rather than a disruptor.

As AI continues to evolve, its role in education will extend beyond content delivery to fostering critical thinking, creativity, and problem-solving skills. The future of education lies not in replacing human educators but in augmenting their capabilities, enabling a more engaging, efficient, and personalized learning experience for students worldwide. By striking a balance between technological innovation and ethical responsibility, AI has the potential to democratize education and bridge learning gaps on a global scale.
"""
```

<table><tr><td>

### 🔹 Cell 3 — Generate Summary via Prompt Continuation

</td></tr></table>

```python
summary_prompt = f"{long_text}\n\nIn summary, this text discusses:"

summary_output = generator(
    summary_prompt,
    max_new_tokens=50,
    num_return_sequences=1,
    truncation=True
)

print("Generated Summary:")
print(summary_output[0]['generated_text'].replace(summary_prompt, '').strip())
```

---
---

## 💻 Program 8 — External File Reading & Extraction (Cohere)

<table><tr><td>

### 🔹 Cell 1 — Install LangChain + Cohere Dependencies

</td></tr></table>

```bash
!pip install langchain langchain-cohere langchain-community
```

<table><tr><td>

### 🔹 Cell 2 — Install gdown

</td></tr></table>

```bash
!pip install gdown
```

<table><tr><td>

### 🔹 Cell 3 — Set Cohere API Key

</td></tr></table>

```python
import getpass
import os

if not os.environ.get("COHERE_API_KEY"):
    os.environ["COHERE_API_KEY"] = getpass.getpass("Enter API key for Cohere: ")
```

<table><tr><td>

### 🔹 Cell 4 — Initialize Cohere Chat Model

</td></tr></table>

```python
from langchain_cohere import ChatCohere

model = ChatCohere(model="command-r7b-12-2024")
```

<table><tr><td>

### 🔹 Cell 5 — Quick Test: Generate a Quote

</td></tr></table>

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Provide a brief quote on the topic of {topic}. Keep your response to 2-3 sentences maximum.")
chain = prompt | model
chain.invoke({'topic': 'AI'}).content
```

<table><tr><td>

### 🔹 Cell 6 — Download Source File from Google Drive

</td></tr></table>

```python
import gdown

file_id = "1VoK-nNRRWZ-3jirTQXdUoBeCQFFhY2G1"
file_path = "/content/drive/MyDrive/Colab Notebooks/ai_agents_info.txt"
gdown.download(f'https://drive.google.com/file/d/{file_id}/view?usp=drive_link')
```

<table><tr><td>

### 🔹 Cell 7 — Read the Downloaded File

</td></tr></table>

```python
with open(file_path, "r", encoding="utf-8") as file:
    document_text = file.read()

print(document_text)
```

<table><tr><td>

### 🔹 Cell 8 — Extract Agent Types as Bullet Points

</td></tr></table>

```python
prompt = ChatPromptTemplate.from_template("Extract and list the types of AI agents as bullet points from the following text:{document_text}")
chain = prompt | model
print(chain.invoke({"document_text": document_text}).content)
```

<table><tr><td>

### 🔹 Cell 9 — Condense Text into a Numbered List

</td></tr></table>

```python
prompt = ChatPromptTemplate.from_template("Slightly reduce the length of the following text while maintaining its key points and structure. Present the types of agents as a numbered list: {document_text}")
chain = prompt | model
print(chain.invoke({"document_text": document_text}).content)
```

---
---

## 💻 Program 9 — Web Scraping & Structured Extraction (Gemini & Wikipedia)

### Approach 1 — Direct Gemini Query

<table><tr><td>

### 🔹 Cell 1 — Install LangChain + Gemini Dependencies

</td></tr></table>

```bash
!pip install -qU langchain_google_genai langchain
```

<table><tr><td>

### 🔹 Cell 2 — Imports

</td></tr></table>

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
```

<table><tr><td>

### 🔹 Cell 3 — Define Output Schema

</td></tr></table>

```python
class InstitutionDetails(BaseModel):
    founder: str
    founded: str
    branches: int
    employees: int
    summary: str
```

<table><tr><td>

### 🔹 Cell 4 — Auth Imports

</td></tr></table>

```python
import os
from getpass import getpass
```

<table><tr><td>

### 🔹 Cell 5 — Set API Key

</td></tr></table>

```python
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY_HERE"
```

<table><tr><td>

### 🔹 Cell 6 — Build Prompt Chain

</td></tr></table>

```python
prompt = ChatPromptTemplate.from_messages([
    ("human", "Please provide details about {institution_name}.")
])

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
)

llm_chain = prompt | llm
```

<table><tr><td>

### 🔹 Cell 7 — Define Fetch Function

</td></tr></table>

```python
def fetch_institution_details(institution_name: str):
    result = llm_chain.invoke({"institution_name": institution_name})
    return result
```

<table><tr><td>

### 🔹 Cell 8 — Run Interactively

</td></tr></table>

```python
institution_name = input("Enter the name of the institution:")
institution_details = fetch_institution_details(institution_name)
print(institution_details)
```

<table><tr><td>

### 📤 Sample Output — SpaceX

</td></tr></table>

```text
SpaceX (Space Exploration Technologies Corp.) was founded by Elon Musk in 2002, headquartered in
Hawthorne, California. Its mission is to reduce space travel costs and colonize Mars. Key products
include the reusable Falcon 9, heavy-lift Falcon Heavy, and next-gen Starship. Spacecraft include
Dragon (cargo) and Crew Dragon (astronauts) serving the ISS. Starlink provides global satellite
internet. SpaceX pioneered orbital rocket reusability, drastically cutting launch costs. Milestones
include the first private crewed orbital flight (2020) and NASA's Artemis Moon lander contract.
Future goals include Mars colonization and lunar missions.
```

### Approach 2 — Wikipedia Scraping + Regex Parsing

<table><tr><td>

### 🔹 Cell 10 — Install Wikipedia Dependencies

</td></tr></table>

```bash
!pip install -qU wikipedia langchain_community
```

<table><tr><td>

### 🔹 Cell 11 — Imports

</td></tr></table>

```python
%pip install --upgrade --quiet wikipedia
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from pydantic import BaseModel, Field
import re
```

<table><tr><td>

### 🔹 Cell 12 — Define Structured Output Schema

</td></tr></table>

```python
class InstitutionDetails(BaseModel):
    founder: str = Field(..., description="Founder of the institution")
    founded_year: str = Field(..., description="Year the institution was founded")
    branches: list[str] = Field(..., description="Current branches in the institution")
    employees: str = Field(..., description="Number of employees in the institution")
    summary: str = Field(..., description="A brief 4-line summary of the institution")
```

<table><tr><td>

### 🔹 Cell 13 — Regex Parser for Wikipedia Content

</td></tr></table>

```python
def parse_wikipedia_content(content: str) -> dict:

    employees_match = (
        re.search(r"employs\s+approximately\s+([\d,]+)\s*(?:employees|staff|workers|people)", content, re.IGNORECASE)
        or re.search(r"employs\s+([\d,]+)\s*(?:employees|staff|workers|people)", content, re.IGNORECASE)
        or re.search(r"approximately\s+([\d,]+)\s*(?:employees|staff|workers|people)", content, re.IGNORECASE)
        or re.search(r"(?:over|about|nearly|around|some)\s+([\d,]+)\s*(?:employees|staff|workers|people)", content, re.IGNORECASE)
        or re.search(r"([\d,]+)\s*(?:employees|staff|workers|people)", content, re.IGNORECASE)
    )

    founder_match = re.search(
        r"(?:founded|established|created)(?:[^.]+?)by\s+"
        r"(?:(?:the|a|an)\s+)?"
        r"(?:[A-Za-z][a-zA-Z\-]*\s+){0,4}"
        r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})",
        content, re.IGNORECASE
    )

    founded_year_match = re.search(
        r"(?:founded|established|incorporated|launched|started)\s+in\s+"
        r"(?:January|February|March|April|May|June|July|August|September|October|November|December)?\s*"
        r"(\d{4})",
        content, re.IGNORECASE
    )

    branches_match = re.findall(
        r"(?:headquartered|located|based|offices?|branches?|campus)\s+in\s+"
        r"([A-Z][a-zA-Z\s]+?)(?:[,\.]|\s+and|\s+with)",
        content, re.IGNORECASE
    )

    clean_content = re.sub(r"^Page:.*?\n",  "", content,       flags=re.MULTILINE)
    clean_content = re.sub(r"^Summary:\s*", "", clean_content, flags=re.MULTILINE)
    clean_content = re.sub(r"\[\d+\]",      "", clean_content)
    clean_content = clean_content.strip()

    summary_sentences = [s.strip() for s in clean_content.split(". ") if len(s.strip()) > 20]
    summary = ". ".join(summary_sentences[:4])

    return {
        "founder":      founder_match.group(1).strip()      if founder_match      else "Not Found",
        "founded_year": founded_year_match.group(1).strip() if founded_year_match else "Not Found",
        "branches":     branches_match                      if branches_match     else ["Not Found"],
        "employees":    employees_match.group(1).strip()    if employees_match    else "Not Found",
        "summary":      summary
    }
```

<table><tr><td>

### 🔹 Cell 14 — Fetch Wikipedia Page

</td></tr></table>

```python
import wikipedia

wikipedia.set_lang("en")
try:
    page = wikipedia.page("Bugatti")
    wiki_content = page.content
    print("Successfully fetched full content for Bugatti")
except wikipedia.exceptions.PageError:
    print("Page not found.")
except wikipedia.exceptions.DisambiguationError as e:
    print(f"Disambiguation error: {e.options}")
```

<table><tr><td>

### 🔹 Cell 15 — Parse & Validate into Schema

</td></tr></table>

```python
data = parse_wikipedia_content(wiki_content)
institution_details = InstitutionDetails(**data)
print(institution_details.model_dump_json(indent=4))
```

---

<p align="center"><sub>📅 Lab Manual (Programs 6–9, Comment-Free) — 19 June 2026</sub></p>
