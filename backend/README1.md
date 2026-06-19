# 🚀 Artificial Intelligence & Natural Language Processing
### Comprehensive Lab Manual

> Five lab programs covering Word Embeddings, Dimensionality Reduction, Custom Word2Vec Training, Prompt Enrichment, and Semantic Search — using `gensim`, `sentence-transformers`, and `langchain`.

---

## 📌 Table of Contents

| # | Program | Core Library |
|---|---------|---------------|
| 1 | [Word Embeddings & Vector Arithmetic](#-program-1--word-embeddings--vector-arithmetic) | `gensim` |
| 2 | [Dimensionality Reduction (PCA)](#-program-2--dimensionality-reduction-pca-for-word-embeddings) | `sklearn` |
| 3 | [Train a Custom Word2Vec Model](#-program-3--train-a-custom-word2vec-model) | `gensim` |
| 4 | [Prompt Enrichment using Embeddings & LLM](#-program-4--prompt-enrichment-using-word-embeddings--llm) | `langchain_google_genai` |
| 5 | [Semantic Search & Context Generation](#-program-5--semantic-search--context-generation-using-sentence-transformers) | `sentence-transformers` |

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

<p align="center"><sub>📅 Lab Manual compiled — 19 June 2026</sub></p>
