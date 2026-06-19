# 🚀 Artificial Intelligence & Natural Language Processing
### Comprehensive Lab Manual

> Nine lab programs covering Word Embeddings, Dimensionality Reduction, Custom Word2Vec Training, Prompt Enrichment, Semantic Search, Sentiment Analysis, Text Generation, File Extraction, and Web/Wikipedia Scraping — using `gensim`, `sentence-transformers`, `transformers`, `langchain`, and `wikipedia`.

---

## 📌 Table of Contents

| # | Program | Core Library |
|---|---------|---------------|
| 1 | [Word Embeddings & Vector Arithmetic](#-program-1--word-embeddings--vector-arithmetic) | `gensim` |
| 2 | [Dimensionality Reduction (PCA)](#-program-2--dimensionality-reduction-pca-for-word-embeddings) | `sklearn` |
| 3 | [Train a Custom Word2Vec Model](#-program-3--train-a-custom-word2vec-model) | `gensim` |
| 4 | [Prompt Enrichment using Embeddings & LLM](#-program-4--prompt-enrichment-using-word-embeddings--llm) | `langchain_google_genai` |
| 5 | [Semantic Search & Context Generation](#-program-5--semantic-search--context-generation-using-sentence-transformers) | `sentence-transformers` |
| 6 | [Sentiment Analysis (Hugging Face & Gemini)](#-program-6--sentiment-analysis-hugging-face--gemini) | `transformers` / `langchain_google_genai` |
| 7 | [Text Generation & Summarization (GPT-2)](#-program-7--text-generation--summarization-gpt-2) | `transformers` |
| 8 | [External File Reading & Extraction (Cohere)](#-program-8--external-file-reading--extraction-cohere) | `langchain-cohere` |
| 9 | [Web Scraping & Structured Extraction (Gemini & Wikipedia)](#-program-9--web-scraping--structured-extraction-gemini--wikipedia) | `langchain_google_genai` / `wikipedia` |

---
---

## 💻 Program 1 — Word Embeddings & Vector Arithmetic

Loads pre-trained **GloVe** embeddings via `gensim`, converts them to Word2Vec format, and performs semantic similarity + vector arithmetic operations.

<table><tr><td>

### 🔹 Cell 1 — Install Dependencies

</td></tr></table>

```bash
!pip install gensim
```

<table><tr><td>

### 🔹 Cell 2 — Convert GloVe → Word2Vec & Load Model

</td></tr></table>

```python
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors

g_i_f = "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.txt"
word2vec_op = "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt"

# Convert GloVe format to Word2Vec format
glove2word2vec(g_i_f, word2vec_op)

# Load the converted Word2Vec model
model = KeyedVectors.load_word2vec_format(word2vec_op, binary=False)

# Test the loaded model
print(model.most_similar("cat"))
```

<table><tr><td>

### 🔹 Cell 3 — Find Similar Words by Vector

</td></tr></table>

```python
sim_to_place = model.similar_by_vector(model['german'], topn=3)
print(f"Words similar to place : {sim_to_place}")
```

<table><tr><td>

### 🔹 Cell 4 — Vector Arithmetic (King − Man + Woman)

</td></tr></table>

```python
rv1 = model['king'] - model['man'] + model['woman']
r1 = model.similar_by_vector(rv1, topn=2)
print(f"Final is = {r1}")
```

<table><tr><td>

### 🔹 Cell 5 — Advanced Vector Operations (Scaling & Normalization)

</td></tr></table>

```python
import numpy as np

# Scaling
sv = model['hotel'] * 2
r2_scaled = model.similar_by_vector(sv, topn=3)
print(f"Scaled Vector Results: {r2_scaled}")

# Normalization
nv = model['fish'] / np.linalg.norm(model['fish'])
r2_norm = model.similar_by_vector(nv, topn=3)
print(f"Normalized Vector Results: {r2_norm}")

# Averaging
av = (model['king'] + model['woman'] + model['man']) / 3
r2_avg = model.similar_by_vector(av, topn=3)
print(f"Averaged Vector Results: {r2_avg}")
```

<table><tr><td>

### 🔹 Cell 6 — Similarity and Distance Comparison

</td></tr></table>

```python
w1 = "fire"
w2 = "blaze"

# Assuming m50 and m100 are loaded models of 50d and 100d respectively
m100d_similarity_score = model.similarity(w1, w2)
d100_d = model.distance(w1, w2)

print(f"Similarity between {w1} and {w2} in 100d : {m100d_similarity_score:.4f}")
print(f"Distance between {w1} and {w2} in 100d : {d100_d:.4f}")
```

---
---

## 💻 Program 2 — Dimensionality Reduction (PCA) for Word Embeddings

Visualizes high-dimensional word embeddings by reducing them to 2D using **Principal Component Analysis (PCA)**.

<table><tr><td>

### 🔹 Cell 1 — Import Required Libraries & Load Model

</td></tr></table>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from gensim.models import KeyedVectors

# Load pre-trained GloVe embeddings (100d model)
m100d = KeyedVectors.load_word2vec_format('/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt', binary=False)
```

<table><tr><td>

### 🔹 Cell 2 — Dimensionality Reduction using PCA

</td></tr></table>

```python
words = ['body', 'brain', 'foot', 'hand', 'liver']
word_vector = np.array([m100d[word] for word in words])

# 1. Scale the vectors first
scaler = StandardScaler()
word_vector_scaled = scaler.fit_transform(word_vector)

# 2. Run PCA on the scaled data
pca = PCA(n_components=2)
pca_result = pca.fit_transform(word_vector_scaled)
```

<table><tr><td>

### 🔹 Cell 3 — Visualize the Embeddings

</td></tr></table>

```python
plt.figure(figsize=(10, 8))
for i, word in enumerate(words):
    plt.scatter(pca_result[i, 0], pca_result[i, 1])
    plt.text(pca_result[i, 0] + 0.02, pca_result[i, 1], word)

plt.title("PCA visualization of word embeddings (100d)")
plt.xlabel("PCA Dimension 1")
plt.ylabel("PCA Dimension 2")
plt.show()
```

<table><tr><td>

### 🔹 Cell 4 — Utility Function for Similar Words

</td></tr></table>

```python
def get_similar_words(Word, model, topn=5):
    sim_words = model.most_similar(Word, topn=topn)
    return sim_words

a = "blood"
sim_word = get_similar_words(a, m100d, topn=5)
print(f"Words similar to {a}: {sim_word}")
```

---
---

## 💻 Program 3 — Train a Custom Word2Vec Model

Trains a custom **Word2Vec** model from scratch using a specialized domain corpus (Legal and Medical).

<table><tr><td>

### 🔹 Cell 1 — Define Corpus & Preprocess

</td></tr></table>

```python
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Enhanced legal and medical corpus
enhanced_corpus = [
    "The court ordered the immediate release of the detained individual due to lack of evidence.",
    "A new amendment was introduced to ensure the protection of intellectual property rights.",
    "The defendant pleaded not guilty, citing an alibi supported by credible witnesses.",
    "The plaintiff accused the company of violating environmental regulations.",
    "A settlement agreement was reached through arbitration, avoiding a lengthy trial.",
    "The patient was admitted to the emergency department with severe chest pain.",
    "The surgeon successfully performed a minimally invasive procedure to remove the tumor.",
    "Clinical trials showed significant improvement in patients treated with the experimental drug.",
    "Regular screening is essential for early detection of chronic illnesses such as diabetes.",
    "The hospital implemented stringent protocols to prevent the spread of infectious diseases."
]

# Preprocess the corpus
tokenized_corpus = [simple_preprocess(sentence) for sentence in enhanced_corpus]
print(tokenized_corpus[:2])
```

<table><tr><td>

### 🔹 Cell 2 — Train and Save the Model

</td></tr></table>

```python
# Train Word2Vec
domain_word2vec = Word2Vec(
    sentences=tokenized_corpus,
    vector_size=100, # Embedding dimension
    window=5,        # Context window
    min_count=1,     # Include all words
    sg=1,            # Skip-gram model
    epochs=150       # Training iterations
)

# Save the model
domain_word2vec.save("enhanced_domain_word2vec.model")

# Analyze embeddings
words_to_analyze = ["court", "plaintiff", "doctor", "patient", "guilty", "surgery"]
for word in words_to_analyze:
    if word in domain_word2vec.wv:
        print(f"Vector embedding for '{word}':\n{domain_word2vec.wv[word][:5]}...\n")
```

<table><tr><td>

### 🔹 Cell 3 — Visualization of Custom Embeddings

</td></tr></table>

```python
selected_words = ["court", "plaintiff", "defendant", "guilty", "patient", "hospital", "surgery", "emergency"]
word_vectors = [domain_word2vec.wv[word] for word in selected_words if word in domain_word2vec.wv]
valid_words = [word for word in selected_words if word in domain_word2vec.wv]

pca = PCA(n_components=2)
reduced_vectors = pca.fit_transform(word_vectors)

plt.figure(figsize=(10, 8))
for i, word in enumerate(valid_words):
    plt.scatter(reduced_vectors[i, 0], reduced_vectors[i, 1])
    plt.text(reduced_vectors[i, 0] + 0.002, reduced_vectors[i, 1], word, fontsize=12)

plt.title("PCA Visualization of Legal and Medical Word Embeddings")
plt.xlabel("PCA Dimension 1")
plt.ylabel("PCA Dimension 2")
plt.show()
```

---
---

## 💻 Program 4 — Prompt Enrichment using Word Embeddings & LLM

Enriches a basic user prompt by identifying related concepts through vector similarity, then passes both the original and enriched prompts to an LLM (**Gemini**) for comparison.

<table><tr><td>

### 🔹 Cell 1 — Install Required Libraries

</td></tr></table>

```bash
!pip install gensim langchain_google_genai
```

<table><tr><td>

### 🔹 Cell 2 — Load Embeddings & Define Prompts

</td></tr></table>

```python
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors

w2v_op = "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt"
m100 = KeyedVectors.load_word2vec_format(w2v_op, binary=False)

OP = "Nowdays VAccinations is important in helthcare"
KT = ["vaccinations", "healthcare"]
ST = []
```

<table><tr><td>

### 🔹 Cell 3 — Enrich the Prompt

</td></tr></table>

```python
for T in KT:
    if T in m100.key_to_index:
        ST.extend([word for word, _ in m100.most_similar(T, topn=3)])

if ST:
    EP = f"{OP} Consider aspects like: {', '.join(ST)}."
else:
    EP = OP

print("Original Prompt:", OP)
print("Enriched Prompt:", EP)
```

<table><tr><td>

### 🔹 Cell 4 — Query LLM using LangChain

</td></tr></table>

```python
import getpass
import os
from langchain_google_genai import ChatGoogleGenerativeAI

os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter your Google AI API key: ")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
)

print(f"Original Prompt Output:\n{llm.invoke(OP).content}\n")
print(f"Enriched Prompt Output:\n{llm.invoke(EP).content}")
```

---
---

## 💻 Program 5 — Semantic Search & Context Generation using Sentence Transformers

Uses Hugging Face's `sentence-transformers` to encode a corpus of financial sentences, enabling semantic search and dynamic, context-aware paragraph generation based on a seed word.

<table><tr><td>

### 🔹 Cell 1 — Install Dependencies

</td></tr></table>

```bash
!pip install sentence_transformers langchain-huggingface
!pip install --upgrade transformers sentence-transformers huggingface-hub langchain-huggingface
!pip install tf-keras --user
```

<table><tr><td>

### 🔹 Cell 2 — Initialize Sentence Transformer & Corpus

</td></tr></table>

```python
import huggingface_hub
import transformers
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

corpus = [
    "The Federal Reserve signaled a potential interest rate hike next quarter.",
    "Stock markets reacted positively to the latest corporate earnings reports.",
    "Analysts predict a bullish trend for technology stocks in the coming months.",
    "Bond yields have been fluctuating due to inflation concerns.",
    "Cryptocurrency investors are closely watching the performance of Bitcoin and Ethereum.",
    "Diversifying your investment portfolio is crucial for long-term growth.",
    "Real estate prices continue to rise in urban areas, driven by demand.",
    "The global economy faces headwinds from geopolitical tensions and supply chain issues.",
    "ESG investing is gaining traction among socially conscious investors.",
    "Commodity prices, especially oil and gold, have seen significant volatility.",
    "Venture capital funding for startups reached a record high last year.",
    "Personal finance experts advise building an emergency fund before investing.",
    "The housing market shows signs of cooling, with fewer new home sales reported.",
    "Digital currencies are revolutionizing the payment processing industry.",
    "Understanding your risk tolerance is key to making sound investment decisions."
]

corpus_embeddings = model.encode(corpus, convert_to_tensor=True)
```

<table><tr><td>

### 🔹 Cell 3 — Define Generation Function

</td></tr></table>

```python
def generate_paragraph(seed_word, corpus, corpus_embeddings, model, top_n=5):
    seed_sentence = f"Tell me more about {seed_word} in finance. "
    seed_embedding = model.encode(seed_sentence, convert_to_tensor=True)

    # Calculate cosine similarities
    similarities = util.pytorch_cos_sim(seed_embedding, corpus_embeddings)[0]
    top_results = similarities.topk(top_n)

    print("Top matches indices: ", top_results.indices.tolist())

    story = f"The topic of '{seed_word}' is crucial in the finance industry."
    for idx in top_results.indices:
        similar_sentence = corpus[idx]
        story += f" {similar_sentence}"
    story += f" These concepts highlight the importance of {seed_word} in understanding financial markets and investment strategies."

    return story
```

<table><tr><td>

### 🔹 Cell 4 — Execute Semantic Search

</td></tr></table>

```python
seed_word = "bonds"
story = generate_paragraph(seed_word, corpus, corpus_embeddings, model, top_n=5)
print("\nGenerated Story:\n", story)
```

---
---

## 💻 Program 6 — Sentiment Analysis (Hugging Face & Gemini)

Classifies customer review sentiment two ways: a local **Hugging Face** pipeline, then a prompt-driven **Gemini** chain via LangChain for comparison.

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

Loads a **GPT-2** text-generation pipeline and uses prompt continuation to produce a pseudo-summary of a long passage about AI in education.

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

Downloads a text file from Google Drive via `gdown`, then uses **Cohere**'s `command-r7b` model through LangChain to extract and restructure information from it.

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

Two approaches to structured institution-data extraction: **Approach 1** queries Gemini directly via LangChain; **Approach 2** pulls live data from **Wikipedia** and parses it with regex into a Pydantic schema.

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
    """
    Fetches institution details using the Langchain chain and GPT-3 model.

    Args:
        institution_name (str): The name of the institution to fetch details for.

    Returns:
        str: The result from the LLMChain run, containing institution details.
    """
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

<p align="center"><sub>📅 Lab Manual compiled — 19 June 2026</sub></p>
