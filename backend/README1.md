# 🚀 AI & NLP Lab Manual — Verified Against Source Files
### (Code Only — No Comments)

> Rebuilt directly from `pgrm1–9.ipynb` and `AImanual.html` (Program 3 source). Quirks, bugs, and inconsistencies present in the original notebooks are preserved and flagged — this is a faithful transcription, not a cleaned-up rewrite.

---

## 📌 Table of Contents

| # | Program | Source File |
|---|---------|-------------|
| 1 | [Word Embeddings & Vector Arithmetic](#-program-1) | `pgrm1.ipynb` |
| 2 | [Dimensionality Reduction (PCA)](#-program-2) | `pgrm2.ipynb` |
| 3 | [Train a Custom Word2Vec Model](#-program-3) | `AImanual.html` |
| 4 | [Prompt Enrichment using Embeddings & LLM](#-program-4) | `pgrm4.ipynb` |
| 5 | [Semantic Search & Context Generation](#-program-5) | `pgrm5.ipynb` |
| 6 | [Sentiment Analysis (Hugging Face & Gemini)](#-program-6) | `pgrm6.ipynb` |
| 7 | [Text Generation & Summarization (GPT-2)](#-program-7) | `pgrm7.ipynb` |
| 8 | [External File Reading & Extraction (Cohere)](#-program-8) | `pgrm8.ipynb` |
| 9 | [Web Scraping & Structured Extraction (Gemini & Wikipedia)](#-program-9) | `pgrm9.ipynb` |

---
---

## 💻 Program 1
**Source: `pgrm1.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
pip install gensim
```

<table><tr><td>🔹 Cell 2</td></tr></table>

```python
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors

g_i_f = "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.txt"
word2vec_op ="/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt"

glove2word2vec(g_i_f,word2vec_op)

model = KeyedVectors.load_word2vec_format(word2vec_op,binary=False)

print(model.most_similar("cat"))
```

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
sim_to_place = model.similar_by_vector(model['german'],topn = 3)
print(f"words sim to place : {sim_to_place}")
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
rv1 = model['king'] - model['man'] + model['woman']
r1 = model.similar_by_vector(rv1,topn = 2)
print(f"final is = {r1}")
```

<table><tr><td>🔹 Cell 5</td></tr></table>

```python
rv2 = model['india'] - model['delhi'] + model['sonne']
r2 = model.similar_by_vector(rv2,topn = 3)
print(f"fianl is : {r2}")
```

<table><tr><td>🔹 Cell 6</td></tr></table>

```python
sv = model['hotel']*2
r2 = model.similar_by_vector(sv,topn = 3)
r2
```

<table><tr><td>🔹 Cell 7</td></tr></table>

```python
import numpy as np
nv= model['fish']/np.linalg.norm(model['fish'])
r2 = model.similar_by_vector(nv,topn = 3)
r2
```

<table><tr><td>🔹 Cell 8</td></tr></table>

```python
av = (model['king'] + model['woman'] + model['man'])/3
r2 = model.similar_by_vector(av,topn =3)
r2
```

<table><tr><td>🔹 Cell 9</td></tr></table>

```python
gif = "/content/drive/MyDrive/Colab Notebooks/glove.6B.50d.txt"
wtv = "/content/drive/MyDrive/Colab Notebooks/glove.6B.50d.word2vec.txt"

glove2word2vec(gif,wtv)

m50 = KeyedVectors.load_word2vec_format(wtv,binary=False)

print(model.most_similar("cat"))
```

<table><tr><td>🔹 Cell 10</td></tr></table>

```python
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors

g_i_f = "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.txt"
word2vec_op ="/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt"

glove2word2vec(g_i_f,word2vec_op)

m100 = KeyedVectors.load_word2vec_format(word2vec_op,binary=False)

print(model.most_similar("cat"))
```

<table><tr><td>🔹 Cell 11</td></tr></table>

```python
w1 = "fire"
w2 = "blaze"

m50d_similarity_score = m50.similarity(w1,w2)
m100d_similarity_score = m100.similarity(w1,w2)

print(f"similarity between {w1} and {w2} in 50d : {m50d_similarity_score : .4f}")
print(f"similarity between {w1} and {w2} in 100d : {m100d_similarity_score : .4f}")
```

<table><tr><td>🔹 Cell 12</td></tr></table>

```python
d50_d = m50.distance(w1,w2)
d100_d = m100.distance(w1,w2)

print(f"Distance (50d) between {w1} and {w2} : {d50_d : .4f}")
print(f"Distance (100d) between {w1} and {w2} : {d100_d : .4f}")
```

> ⚠️ Cells 2 and 10 both reload the 100d model (once as `model`, once as `m100`) — redundant but harmless.

---
---

## 💻 Program 2
**Source: `pgrm2.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
pip install gensim
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from gensim.models import keyedvectors
```

<table><tr><td>🔹 Cell 5</td></tr></table>

```python
m100d = keyedvectors.load_word2vec_format('/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt',binary = False)
```

<table><tr><td>🔹 Cell 6</td></tr></table>

```python
words = ['body', 'brain', 'foot', 'hand', 'liver']
word_vector = np.array([m100d[word]for word in words])
```

<table><tr><td>🔹 Cell 7</td></tr></table>

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
word_vector_scaled = scaler.fit_transform(word_vector)

pca = PCA(n_components=2)
pca_result = pca.fit_transform(word_vector_scaled)
```

<table><tr><td>🔹 Cell 8</td></tr></table>

```python
plt.figure(figsize = (10,8))
for i,word in enumerate(words):
    plt.scatter(pca_result[i,0],pca_result[i,1])
    plt.text(pca_result[i,0],pca_result[i,1],word )
plt.title("PCA visualization of word embeddings (100d)")
plt.xlabel("PCA Dimension 1")
plt.ylabel("PCA Dimension 2")
plt.show()
```

<table><tr><td>🔹 Cell 9</td></tr></table>

```python
def get_similar_words(Word,model,topn = 5):
  sim_words = model.most_similar(Word,topn = topn)
  return sim_words
```

<table><tr><td>🔹 Cell 10</td></tr></table>

```python
a = "blood"
sim_word = get_similar_words(a, m100d, topn=5)
print(f"Words similar to {a}: {sim_word}")
```

<table><tr><td>🔹 Cell 11</td></tr></table>

```python
words_to_print = ['blood', 'plant']
```

<table><tr><td>🔹 Cell 12</td></tr></table>

```python
for word in words_to_print:
  if word in m100d:
    print(f"Vector embedding for word '{word}': \n{m100d[word]}")
  else:
    print(f"word'{word}'not found in the embedding model")
```

> ⚠️ Cell 4 imports the lowercase `keyedvectors` **module**, not the `KeyedVectors` class — calling `.load_word2vec_format` on it works in some gensim versions but isn't the standard usage. `Word2Vec`, `simple_preprocess`, and `TSNE` (Cells 2–3) are imported but never used.

---
---

## 💻 Program 3
**Source: `pgrm3.ipynb`**

### Part 1 — Basic Legal Corpus Training

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
!pip install gensim
```

<table><tr><td>🔹 Cell 2</td></tr></table>

```python
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
```

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
legal_corpus = [
    "The court ruled in favour of the plaintiff.",
    "The defendant was found guilty of negligence.",
    "A breach of contract case was filed.",
    "The agreement between parties must be honored.",
    "Legal documents must be drafted carefully.",
    "The jury deliberated for several hours.",
    "A settlement was reached between the parties.",
    "The plaintiff claimed damages for losses incurred.",
    "The contract outlined the obligations of both parties."
]

tokenized_corpus = [simple_preprocess(sentence) for sentence in legal_corpus]
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
legal_word2vec = Word2Vec(
    sentences=tokenized_corpus,
    vector_size=50,
    window=3,
    min_count=1,
    sg=1,
    epochs=100
)

legal_word2vec.save("legal-word2vec.model")
```

<table><tr><td>🔹 Cell 5</td></tr></table>

```python
word = "lawyer"
if word in legal_word2vec.wv:
    print(f"Vector embedding for {word}: \n {legal_word2vec.wv[word]}\n")
else:
    print(f"Word '{word}' not found in the word2vec model")
```

<table><tr><td>🔹 Cell 6</td></tr></table>

```python
words_to_visualize = ["court", "plaintiff", "defendant", "agreement", "lawyer", "evidence", "contract", "settlement", "jury"]

valid_words = [w for w in words_to_visualize if w in legal_word2vec.wv]
word_vectors = [legal_word2vec.wv[word] for word in valid_words]

pca = PCA(n_components=2)
reduced_vectors = pca.fit_transform(word_vectors)

plt.figure(figsize=(10, 8))
for i, word in enumerate(valid_words):
    plt.scatter(reduced_vectors[i, 0], reduced_vectors[i, 1])
    plt.text(reduced_vectors[i, 0] + 0.002, reduced_vectors[i, 1], word, fontsize=12)

plt.title("PCA visualization of legal word Embeddings")
plt.xlabel("PCA Dimension 1")
plt.ylabel("PCA Dimension 2")
plt.show()
```

<table><tr><td>🔹 Cell 7</td></tr></table>

```python
if "lawyer" in legal_word2vec.wv:
    similar_words = legal_word2vec.wv.most_similar("lawyer", topn=5)
    print(f"Words similar to lawyer: {similar_words}")
```

### Part 2 — Enhanced Legal & Medical Corpus

<table><tr><td>🔹 Cell 8</td></tr></table>

```python
enhanced_corpus = [
    # Legal domain
    "The court dismissed the case due to lacking evidence.",
    "An amendment protected intellectual property rights.",
    "The defendant pleaded not guilty with a credible alibi.",
    "The plaintiff alleged the company violated environmental rules.",
    "Arbitration reached a settlement avoiding a trial.",
    "The legal team argued to overturn the judgment.",
    "Contracts must be fulfilled unless mutually waived.",
    "The jury found the accused guilty of fraud.",
    "The appeal was dismissed due to inadmissible evidence.",
    "The attorney emphasized adhering to the constitution.",

    # Medical domain
    "The patient entered the ER with chest pain.",
    "The surgeon successfully removed the tumor.",
    "Clinical trials proved the experimental drug works.",
    "Screening helps detect chronic illness early.",
    "The doctor recommended physical therapy after surgery.",
    "The hospital started protocols to stop infections.",
    "The nurse checked patient vitals hourly.",
    "Vaccines have drastically reduced global polio.",
    "The radiologist found a CT scan abnormality.",
    "Nutrition and exercise vital for health."
]

tokenized_corpus_enhanced = [simple_preprocess(sentence) for sentence in enhanced_corpus]
```

<table><tr><td>🔹 Cell 9</td></tr></table>

```python
domain_word2vec = Word2Vec(
    sentences=tokenized_corpus_enhanced,
    vector_size=100,
    window=5,
    min_count=2,
    sg=1,
    epochs=100
)

domain_word2vec.save("enhanced-domain-word2vec.model")
```

<table><tr><td>🔹 Cell 10</td></tr></table>

```python
words_to_analyze = ["court", "plaintiff", "doctor", "patient", "guilty", "surgery"]
for word in words_to_analyze:
    if word in domain_word2vec.wv:
        print(f"Vector embedding for '{word}': \n{domain_word2vec.wv[word]}\n")
    else:
        print(f"Word '{word}' not found in the word2vec model.")
```

<table><tr><td>🔹 Cell 11</td></tr></table>

```python
selected_words = ["court", "plaintiff", "defendant", "guilty", "jury",
                  "patient", "doctor", "hospital", "surgery", "emergency"]

valid_selected_words = [w for w in selected_words if w in domain_word2vec.wv]
word_vectors_domain = [domain_word2vec.wv[word] for word in valid_selected_words]

pca_domain = PCA(n_components=2)
reduced_vectors_domain = pca_domain.fit_transform(word_vectors_domain)

plt.figure(figsize=(12, 8))
for i, word in enumerate(valid_selected_words):
    plt.scatter(reduced_vectors_domain[i, 0], reduced_vectors_domain[i, 1])
    plt.text(reduced_vectors_domain[i, 0] + 0.005, reduced_vectors_domain[i, 1], word, fontsize=12)

plt.title("PCA visualization of legal & Medical word Embeddings")
plt.xlabel("PCA Dimension 1")
plt.ylabel("PCA Dimension 2")
plt.show()
```

> ⚠️ `min_count=2` in Cell 9 means words appearing only once (e.g. `"radiologist"`) will be silently skipped during training — the `valid_selected_words` safety check in Cell 11 guards against a `KeyError` at visualization time.

---
---

## 💻 Program 4
**Source: `pgrm4.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
!pip install gensim
!pip install langchain_google_genai
```

<table><tr><td>🔹 Cell 2</td></tr></table>

```python
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors
```

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
gif_in = "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.txt"
w2v_op =  "/content/drive/MyDrive/Colab Notebooks/glove.6B.100d.word2vec.txt"
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
glove2word2vec(gif_in, w2v_op)
```

<table><tr><td>🔹 Cell 5</td></tr></table>

```python
m100 = KeyedVectors.load_word2vec_format(w2v_op, binary=False)
```

<table><tr><td>🔹 Cell 6</td></tr></table>

```python
OP = "Nowdays VAccinations is important in helthcare"
KT = ["vaccinations", "healthcare"]
ST = []
```

<table><tr><td>🔹 Cell 7</td></tr></table>

```python
for T in KT:
    if T in m100.key_to_index:
      ST.extend({word for word, _ in m100.most_similar(T, topn=3)})
      if ST:
        EP = f"{OP} Consider aspects like: {', '.join(ST)}."
      else:
        EP = OT

print("Original Prompt:", OP)
print("Enriched Prompt:", EP)
```

<table><tr><td>🔹 Cell 8</td></tr></table>

```python
import getpass
import os
from langchain_google_genai import ChatGoogleGenerativeAI
```

<table><tr><td>🔹 Cell 9</td></tr></table>

```python
os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter your Google AI API key: ")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
)
```

<table><tr><td>🔹 Cell 10</td></tr></table>

```python
print(f"original prompt:{llm.invoke(OP).content}")
print(f"enriched prompt:{llm.invoke(EP).content}")
```

> ⚠️ **Bug in Cell 7**: `ST.extend({...})` uses a **set** comprehension, not a list — order isn't guaranteed. The `if ST / else` block is nested *inside* the `for` loop, so it re-evaluates every iteration. The `else` branch assigns `EP = OT`, but `OT` is never defined anywhere — this only doesn't crash because `ST` is never empty for these inputs. Recommend changing to a `list` comprehension and moving the `if/else` outside the loop, and fixing `OT` → `OP`.

---
---

## 💻 Program 5
**Source: `pgrm5.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
!pip install sentence_transformers langchain-huggingface
!pip install --upgrade transformers sentence-transformers huggingface-hub langchain-huggingface
!pip install tf-keras --user
```

<table><tr><td>🔹 Cell 2</td></tr></table>

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
corpus_embeddings
```

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
def generate_paragraph(seed_word, corpus, corpus_embeddings, model, top_n=5):
    seed_sentence = f"Tell me more about {seed_word} in finance. "
    seed_embedding = model.encode(seed_sentence, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(seed_embedding, corpus_embeddings)[0]
    top_results = similarities.topk(top_n)
    print("Top results: ", top_results)
    story = f"The topic of '{seed_word}' is crucial in the finance industry."
    for idx in top_results.indices:
      similar_sentence = corpus[idx]
      story += f" {similar_sentence}"
    story += f" These concepts highlight the importance of {seed_word} in understanding financial markets and investment strategies. "
    return story
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
seed_word = "bonds"
story = generate_paragraph(seed_word, corpus, corpus_embeddings, model, top_n=5)
print(story)
```

---
---

## 💻 Program 6
**Source: `pgrm6.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
!pip install transformers
```

<table><tr><td>🔹 Cell 2</td></tr></table>

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

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
results = senti_ana(customer_reviews)

for sentence, result in zip(customer_reviews, results):
    print(f"Sentence: {sentence}\nSentiment: {result['label']}, Confidence: {result['score']:.2f}\n")
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```bash
!pip install -qU langchain-google-genai langchain
```

<table><tr><td>🔹 Cell 5</td></tr></table>

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

## 💻 Program 7
**Source: `pgrm7.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```python
from transformers import pipeline

generator = pipeline('text-generation', model='gpt2')
```

<table><tr><td>🔹 Cell 2</td></tr></table>

```python
long_text = """
Artificial intelligence (AI) is a rapidly expanding field of computer science dedicated to solving cognitive problems commonly associated with human intelligence, such as learning, problem-solving, and pattern recognition. The term 'AI' was coined in 1956 at a conference at Dartmouth College. Modern AI techniques include machine learning, deep learning, and natural language processing. Machine learning involves training algorithms on large datasets to make predictions or decisions without being explicitly programmed. Deep learning, a subset of machine learning, uses neural networks with many layers to analyze various factors in data. Natural language processing (NLP) enables computers to understand, interpret, and generate human language. AI has applications across numerous industries, including healthcare (e.g., disease diagnosis), finance (e.g., fraud detection), automotive (e.g., self-driving cars), and entertainment (e.g., personalized recommendations). The ethical implications of AI, such as bias in algorithms and job displacement, are active areas of research and debate.

Despite these advantages, AI's integration into education is not without challenges. Ethical concerns surrounding data privacy, bias in AI algorithms, and the digital divide must be addressed to ensure equitable access to AI-driven education. Institutions must adopt transparent AI governance policies, emphasizing accountability and inclusivity in algorithmic decision-making. Additionally, educators must be equipped with the necessary training to effectively implement AI tools within their instructional practices, ensuring that technology serves as an enabler rather than a disruptor.

As AI continues to evolve, its role in education will extend beyond content delivery to fostering critical thinking, creativity, and problem-solving skills. The future of education lies not in replacing human educators but in augmenting their capabilities, enabling a more engaging, efficient, and personalized learning experience for students worldwide. By striking a balance between technological innovation and ethical responsibility, AI has the potential to democratize education and bridge learning gaps on a global scale.
"""
```

<table><tr><td>🔹 Cell 3</td></tr></table>

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

> ⚠️ `pgrm7.ipynb` has these same three cells **duplicated** (run twice) — shown once here since the duplicate adds nothing.

---
---

## 💻 Program 8
**Source: `pgrm8.ipynb`**

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
!pip install langchain langchain-cohere langchain-community
```

<table><tr><td>🔹 Cell 2</td></tr></table>

```bash
!pip install gdown
```

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
import getpass
import os

if not os.environ.get("COHERE_API_KEY"):
    os.environ["COHERE_API_KEY"] = getpass.getpass("Enter API key for Cohere: ")
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
from langchain_cohere import ChatCohere

model = ChatCohere(model="command-r7b-12-2024")
```

<table><tr><td>🔹 Cell 5</td></tr></table>

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Provide a brief quote on the topic of {topic}. Keep your response to 2-3 sentences maximum.")
chain = prompt | model
chain.invoke({'topic': 'AI'}).content
```

<table><tr><td>🔹 Cell 6</td></tr></table>

```python
import gdown

file_id = "1VoK-nNRRWZ-3jirTQXdUoBeCQFFhY2G1"
file_path = "/content/drive/MyDrive/Colab Notebooks/ai_agents_info.txt"
gdown.download(f'https://drive.google.com/file/d/{file_id}/view?usp=drive_link')
```

<table><tr><td>🔹 Cell 7</td></tr></table>

```python
with open(file_path, "r", encoding="utf-8") as file:
    document_text = file.read()

print(document_text)
```

<table><tr><td>🔹 Cell 8</td></tr></table>

```python
prompt = ChatPromptTemplate.from_template("Extract and list the types of AI agents as bullet points from the following text:{document_text}")
chain = prompt | model
print(chain.invoke({"document_text": document_text}).content)
```

<table><tr><td>🔹 Cell 9</td></tr></table>

```python
prompt = ChatPromptTemplate.from_template("Slightly reduce the length of the following text while maintaining its key points and structure. Present the types of agents as a numbered list: {document_text}")
chain = prompt | model
print(chain.invoke({"document_text": document_text}).content)
```

---
---

## 💻 Program 9
**Source: `pgrm9.ipynb`**

### Approach 1 — Direct Gemini Query

<table><tr><td>🔹 Cell 1</td></tr></table>

```bash
!pip install -qU langchain_google_genai langchain
```

<table><tr><td>🔹 Cell 2</td></tr></table>

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
```

<table><tr><td>🔹 Cell 3</td></tr></table>

```python
class InstitutionDetails(BaseModel):
    founder: str
    founded: str
    branches: int
    employees: int
    summary: str
```

<table><tr><td>🔹 Cell 4</td></tr></table>

```python
import os
from getpass import getpass
```

<table><tr><td>🔹 Cell 5 — ⚠️ API key redacted</td></tr></table>

```python
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY_HERE"
```

> 🚨 **Your actual notebook has a real key hardcoded here.** I've redacted it. Rotate that key in Google AI Studio before this notebook goes anywhere public.

<table><tr><td>🔹 Cell 6</td></tr></table>

```python
prompt = ChatPromptTemplate.from_messages([
    ("human", "Please provide details about {institution_name}.")
])

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
)

llm_chain = prompt | llm
```

<table><tr><td>🔹 Cell 7</td></tr></table>

```python
def fetch_institution_details(institution_name: str):
    result = llm_chain.invoke({"institution_name": institution_name})
    return result
```

<table><tr><td>🔹 Cell 8</td></tr></table>

```python
institution_name = input("Enter the name of the institution:")
institution_details = fetch_institution_details(institution_name)
print(institution_details)
```

<table><tr><td>📤 Sample Output — SpaceX</td></tr></table>

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

<table><tr><td>🔹 Cell 9</td></tr></table>

```bash
!pip install -qU wikipedia langchain_community
```

<table><tr><td>🔹 Cell 10</td></tr></table>

```python
%pip install --upgrade --quiet wikipedia
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from pydantic import BaseModel, Field
import re
```

<table><tr><td>🔹 Cell 11</td></tr></table>

```python
class InstitutionDetails(BaseModel):
    founder: str = Field(..., description="Founder of the institution")
    founded_year: str = Field(..., description="Year the institution was founded")
    branches: list[str] = Field(..., description="Current branches in the institution")
    employees: str = Field(..., description="Number of employees in the institution")
    summary: str = Field(..., description="A brief 4-line summary of the institution")
```

<table><tr><td>🔹 Cell 12</td></tr></table>

```python
def parse_wikipedia_content(content: str) -> dict:

    employees_match = (
        re.search(r"employs\s+approximately\s+([\d,]+)\s*(?:employees|staff|workers|people)",
                  content, re.IGNORECASE)
        or
        re.search(r"employs\s+([\d,]+)\s*(?:employees|staff|workers|people)",
                  content, re.IGNORECASE)
        or
        re.search(r"approximately\s+([\d,]+)\s*(?:employees|staff|workers|people)",
                  content, re.IGNORECASE)
        or
        re.search(r"(?:over|about|nearly|around|some)\s+([\d,]+)\s*(?:employees|staff|workers|people)",
                  content, re.IGNORECASE)
        or
        re.search(r"([\d,]+)\s*(?:employees|staff|workers|people)",
                  content, re.IGNORECASE)
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

<table><tr><td>🔹 Cell 13</td></tr></table>

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

<table><tr><td>🔹 Cell 14</td></tr></table>

```python
data = parse_wikipedia_content(wiki_content)
institution_details = InstitutionDetails(**data)
print(institution_details.model_dump_json(indent=4))
```

---

<p align="center"><sub>📅 Verified Lab Manual — 19 June 2026</sub></p>
