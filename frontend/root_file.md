# 🎯 AI & NLP Lab — Viva Questions & Answers
### All 9 Programs | Every Angle Covered

---

## 📌 Quick Index

| Program | Topic |
|---------|-------|
| [P1](#-program-1--word-embeddings--vector-arithmetic) | Word Embeddings & Vector Arithmetic |
| [P2](#-program-2--dimensionality-reduction-pca) | Dimensionality Reduction (PCA) |
| [P3](#-program-3--custom-word2vec-training) | Custom Word2Vec Training |
| [P4](#-program-4--prompt-enrichment) | Prompt Enrichment using Embeddings & LLM |
| [P5](#-program-5--semantic-search) | Semantic Search & Context Generation |
| [P6](#-program-6--sentiment-analysis) | Sentiment Analysis |
| [P7](#-program-7--text-generation--summarization) | Text Generation & Summarization |
| [P8](#-program-8--external-file-reading--extraction) | External File Reading & Extraction |
| [P9](#-program-9--web-scraping--structured-extraction) | Web Scraping & Structured Extraction |

---
---

## 🔵 Program 1 — Word Embeddings & Vector Arithmetic

---

**Q1. What is a word embedding?**

A numerical representation of a word as a dense vector in a high-dimensional space, where words with similar meanings are placed close together. Unlike one-hot encoding, embeddings capture semantic relationships between words.

---

**Q2. What is GloVe and how is it different from Word2Vec?**

GloVe (Global Vectors for Word Representation) is a pre-trained embedding model trained on global word co-occurrence statistics across an entire corpus. Word2Vec uses a local sliding window approach (either Skip-gram or CBOW) to learn from context. GloVe captures global statistics better; Word2Vec captures local context better. In this program, GloVe embeddings are converted to Word2Vec format so `gensim` can read them.

---

**Q3. Why do we need to convert GloVe to Word2Vec format?**

`gensim`'s `KeyedVectors.load_word2vec_format()` expects a specific file structure: the first line is a header containing vocabulary size and vector dimension, followed by word-vector pairs. GloVe files don't have this header. `glove2word2vec()` adds that header so the file becomes readable by gensim.

---

**Q4. What does `most_similar("cat")` return?**

It returns the top 10 words whose vectors are closest to the vector of "cat" by cosine similarity, along with their similarity scores. Example output: `[('dog', 0.87), ('rabbit', 0.74), ...]`

---

**Q5. What is cosine similarity?**

A measure of similarity between two vectors based on the angle between them, not their magnitude. Formula: `cos(θ) = (A · B) / (|A| × |B|)`. Value ranges from -1 to 1. Two words with similar meaning will have vectors pointing in a similar direction, giving a score close to 1.

---

**Q6. Explain the King − Man + Woman = Queen operation.**

This is vector arithmetic that demonstrates that word embeddings capture analogical relationships. By subtracting the "man" concept from "king" and adding "woman," the resulting vector lands closest to "queen" in the embedding space. It means the model has learned: (royalty - masculine + feminine) ≈ queen.

---

**Q7. What does `similar_by_vector()` do vs `most_similar()`?**

`most_similar("word")` takes a word string and internally fetches its vector before computing similarities. `similar_by_vector(vector)` takes a raw numpy vector directly — useful when you've done arithmetic on vectors (like king − man + woman) and want to find the nearest word to that computed vector.

---

**Q8. What is vector scaling and does it change the nearest neighbors?**

Scaling multiplies a vector by a scalar (e.g. `model['hotel'] * 2`). Since cosine similarity is direction-based, not magnitude-based, scaling doesn't change the nearest neighbors — the vector still points in the same direction. The output is identical to `most_similar("hotel")`.

---

**Q9. What is vector normalization and why is it done?**

Normalization divides a vector by its L2 norm (`np.linalg.norm()`), making its magnitude equal to 1 (a unit vector). It standardizes vectors so comparisons are purely based on direction. Again, since cosine similarity ignores magnitude, normalized results are the same as the original.

---

**Q10. What is the difference between similarity and distance in gensim?**

`similarity(w1, w2)` returns cosine similarity (higher = more similar, max = 1.0). `distance(w1, w2)` returns cosine distance = `1 − similarity` (lower = more similar). They are complementary; `similarity + distance = 1`.

---

**Q11. Why did the program load both 50d and 100d models?**

To compare how embedding dimensionality affects similarity/distance scores. Higher dimensions (100d) capture more nuanced semantic relationships but require more memory and computation. 50d is more compact. The program prints both scores for the same word pair ("fire" vs "blaze") to show this difference.

---

**Q12. What would happen if you queried a word not in the vocabulary?**

`gensim` would raise a `KeyError`. Pre-trained GloVe models have a fixed vocabulary (400K words for 6B tokens model) — OOV (out-of-vocabulary) words like typos, proper nouns, or domain-specific terms are not present.

---
---

## 🟢 Program 2 — Dimensionality Reduction (PCA)

---

**Q1. What is the curse of dimensionality?**

As the number of dimensions increases, the volume of the space increases so fast that data becomes sparse, making distance metrics less meaningful. A 100-dimensional word vector is hard to visualize or cluster directly — dimensionality reduction helps make it tractable.

---

**Q2. What is PCA?**

Principal Component Analysis is a linear dimensionality reduction technique. It finds the directions (principal components) of maximum variance in the data and projects the data onto those directions. The first component captures the most variance, the second captures the next most, and so on.

---

**Q3. Why do we apply `StandardScaler` before PCA?**

PCA is sensitive to the scale of features. If one feature has a much larger range than others, it dominates the principal components. `StandardScaler` standardizes each feature to zero mean and unit variance, ensuring all dimensions contribute equally to PCA.

---

**Q4. What does `n_components=2` mean in PCA?**

It tells PCA to reduce the data to 2 dimensions (from 100). This makes it possible to plot on a 2D scatter plot. Information is inevitably lost, but the 2 components chosen capture the maximum possible variance from the original 100 dimensions.

---

**Q5. What does the PCA scatter plot tell us?**

Words plotted close together are semantically similar in the embedding space (after reduction). For example, body parts like "body", "brain", "foot", "hand", "liver" should cluster together, showing the model learned they're related.

---

**Q6. What is the difference between PCA and t-SNE?**

PCA is linear and focuses on preserving global structure (maximum variance). t-SNE (t-distributed Stochastic Neighbor Embedding) is non-linear and focuses on preserving local structure (nearest neighbors). t-SNE is better for visualizing clusters; PCA is better for understanding overall variance. t-SNE was imported in this notebook but never used.

---

**Q7. Why was `keyedvectors` (lowercase) used instead of `KeyedVectors`?**

That was a quirk in the original notebook. `from gensim.models import keyedvectors` imports the *module*, not the class. Calling `keyedvectors.load_word2vec_format(...)` still works because the function is accessible through the module, but it's non-standard. The correct import is `from gensim.models import KeyedVectors`.

---

**Q8. What does `most_similar()` return and what is `topn`?**

It returns the `topn` most similar words to the given word based on cosine similarity, as a list of `(word, score)` tuples. `topn=5` returns the 5 closest words.

---

**Q9. What is the purpose of printing the embedding vector for a word?**

To inspect the raw numerical representation. A word embedding is just a float array of fixed size (100 values here). Printing it confirms the model loaded correctly and shows what the model "thinks" a word looks like numerically.

---

**Q10. Can PCA be used for tasks other than visualization?**

Yes — PCA is widely used for noise reduction, feature compression before feeding into ML models, speeding up training (fewer dimensions = faster), and removing redundant features. In NLP specifically, it can reduce embedding size for memory-constrained environments.

---
---

## 🟡 Program 3 — Custom Word2Vec Training

---

**Q1. What is Word2Vec?**

A neural network-based technique by Google (2013) that trains word embeddings from scratch on a given corpus. Unlike GloVe (pre-trained), Word2Vec lets you train a domain-specific model on your own data so embeddings reflect your corpus's vocabulary and context.

---

**Q2. What are the two architectures in Word2Vec?**

- **CBOW (Continuous Bag of Words):** predicts the center word from surrounding context words. Faster, better for frequent words. (`sg=0`)
- **Skip-gram:** predicts surrounding context words from the center word. Slower but better for rare words and captures more nuanced relationships. (`sg=1`) — used in this program.

---

**Q3. What does `vector_size=100` mean?**

Each word will be represented as a 100-dimensional vector. This is the embedding dimension. Larger values capture more information but need more data and compute.

---

**Q4. What does `window=5` mean?**

The context window — for each target word, Word2Vec considers the 5 words to the left and 5 to the right as context. A larger window captures broader topical relationships; a smaller window captures syntactic relationships.

---

**Q5. What does `min_count=1` mean?**

Words appearing fewer than `min_count` times in the corpus are ignored. Setting it to 1 means every word is included regardless of frequency. In a small corpus like this (10-20 sentences), this prevents losing important domain terms that appear only once.

---

**Q6. What does `epochs=150` mean?**

The model iterates over the entire training corpus 150 times. More epochs = better learning on small datasets. For a 20-sentence corpus, 150 epochs compensates for the small amount of training data.

---

**Q7. Why use a domain-specific corpus instead of pre-trained GloVe?**

Pre-trained GloVe is trained on general web text (Wikipedia, news). Legal and medical terms like "plaintiff", "arbitration", "lesion" may not have accurate embeddings in a general model. Training on domain text ensures the embeddings reflect domain-specific context and relationships.

---

**Q8. What is `simple_preprocess()`?**

A gensim utility that tokenizes text, lowercases it, and removes punctuation and numbers. It converts a sentence string into a list of clean word tokens suitable for Word2Vec training.

---

**Q9. What does `domain_word2vec.save()` do?**

Saves the trained model to disk in gensim's binary format. It can later be reloaded with `Word2Vec.load()` without retraining — useful for large corpora where retraining is expensive.

---

**Q10. What does `.wv` mean on the model?**

`.wv` gives access to the `KeyedVectors` object — the actual word-to-vector mappings. After training, you typically only need `.wv` for inference (similarity, analogy tasks). The full `Word2Vec` object is only needed if you want to continue training.

---

**Q11. How is this corpus different from the earlier draft?**

The actual corpus used in the program has 20 sentences (10 legal + 10 medical), not 10 as appeared in earlier documentation. It also selects 10 words for PCA visualization vs the earlier 8.

---

**Q12. Why might the embeddings be poor quality?**

20 sentences is an extremely small corpus for Word2Vec. The embeddings trained here won't be as meaningful as GloVe embeddings trained on billions of words. With such a small corpus, the model barely has enough context to learn meaningful relationships.

---
---

## 🟠 Program 4 — Prompt Enrichment

---

**Q1. What is prompt enrichment?**

The process of augmenting a user's original (possibly vague or poorly written) prompt with additional semantically related terms before passing it to an LLM. The goal is to give the LLM richer context, potentially improving response quality and coverage.

---

**Q2. How does word embedding help in prompt enrichment?**

Each keyword from the prompt is looked up in the embedding model. The `topn` most similar words are retrieved. These related terms are appended to the original prompt, expanding it with concepts the user may not have explicitly mentioned.

---

**Q3. What is `key_to_index`?**

A dictionary in gensim's `KeyedVectors` that maps each vocabulary word to its index. Checking `if T in m100.key_to_index` is how you verify whether a word exists in the model's vocabulary before trying to look it up — avoids `KeyError`.

---

**Q4. What is the bug in Cell 7 of this program?**

Three bugs: (1) `ST.extend({...})` uses a **set** comprehension — sets are unordered, so the enriched terms come in random order. Should be a list. (2) The `if ST / else EP = OT` is nested **inside** the `for` loop, so `EP` gets reassigned every iteration. Should be outside the loop. (3) `OT` in the else branch is **undefined** — it should be `OP`. If `ST` happened to be empty, this would raise a `NameError`.

---

**Q5. What is LangChain?**

An open-source framework for building applications powered by LLMs. It provides abstractions for prompt templates, chaining LLM calls, memory, agents, and tool use — making it easier to build complex LLM workflows beyond a single API call.

---

**Q6. What is a `PromptTemplate` in LangChain?**

A reusable template string with placeholders (e.g. `{text}`) that gets filled in at runtime before being sent to the LLM. It separates prompt structure from prompt content, making prompts reusable and parameterizable.

---

**Q7. What does `prompt | llm` mean in LangChain?**

The `|` operator (pipe) chains components together using LangChain's LCEL (LangChain Expression Language). `prompt | llm` means: format the prompt first, then pass the result to the LLM. It returns a `Runnable` object that can be invoked with `.invoke()`.

---

**Q8. What is Gemini 2.5 Flash?**

A Google AI model — a lightweight, fast variant of the Gemini family optimized for speed and cost efficiency, suitable for tasks that don't need the most powerful model. Accessed here via `langchain_google_genai`.

---

**Q9. Why does the original prompt have typos ("VAccinations", "helthcare")?**

Intentional. It simulates a real-world user typing carelessly. The program checks whether enrichment still works despite a poorly typed original prompt — the enrichment is based on the `KT` (key terms) list, not the prompt text itself, so typos in the prompt don't affect enrichment.

---

**Q10. What is `temperature=0` in the LLM?**

Controls randomness in the LLM's output. `temperature=0` means deterministic output — the model always picks the most probable next token. Higher temperature (e.g. 0.9) = more creative/varied responses. For comparison tasks like this, `0` ensures both prompts get consistent responses.

---
---

## 🔴 Program 5 — Semantic Search

---

**Q1. What is semantic search?**

A search approach that understands the *meaning* of a query, not just keyword matches. A query for "bonds" returns results about interest rates, yields, and financial instruments — even if the word "bonds" doesn't appear in every result.

---

**Q2. What are sentence transformers?**

Models from Hugging Face that encode entire sentences (not just words) into dense vectors. Unlike word embeddings that encode individual words, sentence transformers produce a single vector representing the entire sentence's meaning. Better for search, clustering, and similarity tasks.

---

**Q3. What is `all-MiniLM-L6-v2`?**

A lightweight, fast sentence transformer model from Hugging Face. "MiniLM" = small language model, "L6" = 6 transformer layers, "v2" = version 2. It produces 384-dimensional sentence embeddings and is a popular choice for semantic search due to its speed vs quality balance.

---

**Q4. What does `convert_to_tensor=True` do?**

Instead of returning a numpy array, it returns a PyTorch tensor. This is required for `util.pytorch_cos_sim()` which operates on tensors. Also allows GPU acceleration if available.

---

**Q5. What is `pytorch_cos_sim()`?**

A function from `sentence_transformers.util` that computes pairwise cosine similarities between two sets of vectors. `util.pytorch_cos_sim(seed_embedding, corpus_embeddings)` returns a matrix of shape `[1, len(corpus)]` — similarity of the seed against each corpus sentence.

---

**Q6. What does `.topk(top_n)` do?**

A PyTorch tensor method that returns the `top_n` largest values and their indices from a tensor. Used here to find the `top_n` most similar corpus sentences to the seed query.

---

**Q7. What is the difference between keyword search and semantic search?**

Keyword search matches exact words — "bond market" would only return sentences containing those exact words. Semantic search matches meaning — a query about "bonds" returns sentences about yields, interest rates, and inflation even if the word "bond" isn't in them.

---

**Q8. What is the purpose of `generate_paragraph()`?**

Takes a seed word, encodes it as a sentence (`"Tell me more about {seed_word} in finance"`), finds the top-N most semantically similar corpus sentences, concatenates them into a coherent paragraph, and returns it. It's a basic retrieval-augmented generation (RAG) approach without an LLM.

---

**Q9. What is RAG (Retrieval Augmented Generation)?**

A pattern where relevant documents/sentences are first retrieved from a knowledge base using semantic search, then passed to an LLM to generate a grounded, context-aware response. This program implements the retrieval part without the generation step.

---

**Q10. Why does `print("Top results: ", top_results)` print the full tensor object?**

Because `top_results` is a `torch.topk` result object containing both `values` (similarity scores) and `indices`. To print just the indices as a clean list, it should be `top_results.indices.tolist()`. This was a minor oversight in the notebook.

---

**Q11. What is `tf-keras` installed for?**

Some versions of `sentence-transformers` had a dependency on TensorFlow/Keras internally. Installing `tf-keras` prevents import errors in environments where TF is present but the newer Keras interface isn't compatible.

---
---

## 🟣 Program 6 — Sentiment Analysis

---

**Q1. What is sentiment analysis?**

An NLP task that classifies the emotional tone of text — typically as Positive, Negative, or Neutral. Used in product reviews, social media monitoring, customer feedback analysis, etc.

---

**Q2. What is a Hugging Face pipeline?**

A high-level abstraction in the `transformers` library that wraps a pre-trained model + tokenizer + post-processing into a single callable. `pipeline("sentiment-analysis")` automatically downloads a default BERT-based sentiment model (`distilbert-base-uncased-finetuned-sst-2-english`) and handles tokenization and inference internally.

---

**Q3. What model does `pipeline("sentiment-analysis")` use by default?**

`distilbert-base-uncased-finetuned-sst-2-english` — a distilled (smaller, faster) version of BERT, fine-tuned on the SST-2 (Stanford Sentiment Treebank) dataset. Returns POSITIVE or NEGATIVE with a confidence score.

---

**Q4. What does the confidence score represent?**

The model's probability estimate for its predicted label, after softmax. A score of 0.98 for POSITIVE means the model is 98% confident the text is positive. It's not always calibrated perfectly but gives a relative sense of certainty.

---

**Q5. What is the difference between the Hugging Face approach and the Gemini approach in this program?**

The Hugging Face pipeline runs a small, local model (distilbert) — fast, offline, returns structured POSITIVE/NEGATIVE labels with scores. The Gemini approach uses a large cloud-based LLM via a prompt — more flexible (can explain reasoning, handle nuance), but slower, requires API key, and returns free-form text rather than structured labels.

---

**Q6. What is `PromptTemplate.from_template()`?**

A LangChain utility that creates a `PromptTemplate` object from a string with `{placeholder}` variables. At invoke time, the placeholders are filled with actual values before the prompt is sent to the LLM.

---

**Q7. Why is `temperature=0.5` used for Gemini here vs `temperature=0` in Program 4?**

`0.5` allows some variability in Gemini's response — appropriate for sentiment analysis where you want natural, readable explanations rather than a single deterministic answer. Program 4 used `0` because it was doing a strict comparison between two prompts where consistency was needed.

---

**Q8. What is `getpass()` used for?**

Prompts the user to enter a password/API key without echoing it to the screen. Prevents the API key from appearing in the notebook output or being accidentally captured in screenshots.

---

**Q9. Can VADER or TextBlob be used instead of these approaches?**

Yes — VADER (Valence Aware Dictionary and sEntiment Reasoner) and TextBlob are rule-based/lexicon-based simpler alternatives. They're faster and need no API key but are less accurate on complex or domain-specific text. Hugging Face and LLM approaches are more accurate but heavier.

---

**Q10. What are limitations of sentiment analysis?**

Sarcasm, irony, negation ("not bad"), mixed sentiment in a single review, domain-specific language, and multi-language text all challenge sentiment models. Most models are trained on English product reviews and struggle outside that domain.

---
---

## 🟤 Program 7 — Text Generation & Summarization

---

**Q1. What is GPT-2?**

A transformer-based language model by OpenAI (2019) trained on 40GB of internet text. It generates text autoregressively — predicting the next word given all previous words. It was considered large at the time; now considered small compared to modern LLMs.

---

**Q2. What is autoregressive text generation?**

The model generates text one token at a time. It takes the input sequence, predicts the next most likely token, appends it to the sequence, and repeats until a stop condition (max tokens, end token, etc.) is met.

---

**Q3. How does this program perform "summarization"?**

It doesn't use a dedicated summarization model — it uses **prompt continuation**. The long text is appended with `\n\nIn summary, this text discusses:` and GPT-2 is asked to continue from there. GPT-2 generates whatever it thinks follows that prompt, which is not a reliable summarization approach.

---

**Q4. What is `max_new_tokens=50`?**

Limits the number of new tokens GPT-2 generates beyond the input. 50 tokens ≈ 35-40 words. Without a limit, the model would keep generating until it hits an internal maximum.

---

**Q5. What is `num_return_sequences=1`?**

Tells the model to generate 1 completion. You can set this higher (e.g. 5) to get multiple different completions and pick the best one.

---

**Q6. What is `truncation=True`?**

GPT-2 has a maximum context window (1024 tokens). If the input is longer than that, `truncation=True` cuts it to fit. Without this, a `ValueError` is raised for long inputs.

---

**Q7. Why does GPT-2 produce low quality summaries compared to modern models?**

GPT-2 has no explicit summarization training — it just predicts probable continuations. Modern models like GPT-4, Gemini, or fine-tuned BART/T5 are explicitly trained on summarization tasks. Also, GPT-2 (117M-1.5B parameters) is much smaller than modern LLMs.

---

**Q8. What are better alternatives for summarization?**

- `facebook/bart-large-cnn` — fine-tuned on CNN/DailyMail news summarization
- `google/pegasus-xsum` — fine-tuned for extreme summarization
- `t5-small/t5-base` with a summarization prompt
- LLM APIs (Gemini, GPT-4) via prompt

---

**Q9. What is the transformer architecture briefly?**

A neural network architecture based on self-attention mechanisms. It processes entire sequences in parallel (unlike RNNs which are sequential). Consists of encoder and decoder blocks. GPT-2 uses only the decoder block (for generation). BERT uses only the encoder block (for understanding).

---

**Q10. What was the duplicate cell issue in pgrm7.ipynb?**

The notebook had all 3 cells run twice (same code, same output). This happens when cells are accidentally re-run in Colab — it doesn't affect functionality but clutters the notebook and adds to the runtime trace.

---
---

## ⚫ Program 8 — External File Reading & Extraction (Cohere)

---

**Q1. What is Cohere?**

An AI company providing LLM APIs. The `command-r7b-12-2024` model used here is Cohere's instruction-following chat model, designed for retrieval-augmented generation (RAG) and tool use. `r7b` = 7 billion parameter variant, `12-2024` = released December 2024.

---

**Q2. What is LangChain's `ChatCohere`?**

A LangChain wrapper around Cohere's chat API. It implements the standard `BaseChatModel` interface so you can use it interchangeably with other LangChain-compatible models (ChatGoogleGenerativeAI, ChatOpenAI, etc.).

---

**Q3. What is `ChatPromptTemplate.from_template()`?**

Creates a prompt template for chat models (vs `PromptTemplate` for completion models). Chat models expect messages with roles (human, assistant, system); `ChatPromptTemplate` structures the input accordingly.

---

**Q4. Why was `gdown` used originally and why is it unnecessary in Colab?**

`gdown` is a Python library to download files from Google Drive by file ID — useful in non-Colab environments where Drive isn't mounted. In Colab, you can mount Google Drive directly (`drive.mount('/content/drive')`) and access files via their Drive path, making `gdown` redundant.

---

**Q5. What is the simplified approach for Colab?**

Mount Drive once, set the `file_path` to the Drive path, and use `open()` directly. Eliminates `!pip install gdown`, `import gdown`, `file_id`, and `gdown.download()` — 4 lines removed, no external dependency.

---

**Q6. What does `open(file_path, "r", encoding="utf-8")` do?**

Opens the file at `file_path` in read mode (`"r"`) with UTF-8 encoding. `with` statement ensures the file is automatically closed after reading, even if an exception occurs. `file.read()` reads the entire content as a single string.

---

**Q7. What is the difference between Cells 8 and 9 (the two extraction prompts)?**

Cell 8 asks Cohere to **extract** agent types as bullet points — focused, structured, no length change. Cell 9 asks Cohere to **condense** the text while restructuring as a numbered list — it also reduces verbosity. Two different document processing tasks on the same input.

---

**Q8. What is RAG and does this program implement it?**

RAG (Retrieval Augmented Generation) feeds external documents to an LLM to ground its responses in real data. This program partially implements it — it reads an external file and passes its content to Cohere as context in the prompt. A full RAG pipeline would also include vector search over the document chunks.

---

**Q9. What would happen if `document_text` was too long for the model's context window?**

The API call would either truncate the input silently or raise an error depending on the model's configuration. Cohere's `command-r7b` supports up to 128K tokens, so this is unlikely to be an issue for typical text files, but chunking strategies (splitting the document into pieces) are the standard solution for very large files.

---

**Q10. What is the API key check `if not os.environ.get("COHERE_API_KEY")`?**

Checks if the key is already set in the environment before prompting. Useful when re-running cells — prevents the user from having to re-enter the key if the session already has it. A small UX improvement in interactive notebooks.

---
---

## 🔶 Program 9 — Web Scraping & Structured Extraction

---

**Q1. What is the purpose of this program?**

Demonstrates two approaches to extract structured information (founder, year, branches, employees, summary) about an institution: (1) directly querying a Gemini LLM, (2) fetching Wikipedia content and parsing it with regex into a Pydantic schema.

---

**Q2. What is Pydantic?**

A Python library for data validation and settings management using type annotations. A `BaseModel` subclass defines a schema — when you create an instance with `InstitutionDetails(**data)`, Pydantic validates that each field matches its declared type and raises a `ValidationError` if not.

---

**Q3. What is the `InstitutionDetails` class in Approach 1 and why is it never used?**

It's defined as a Pydantic schema with `founder`, `founded`, `branches`, `employees`, `summary`. But the chain (`prompt | llm`) is never connected to it with `.with_structured_output(InstitutionDetails)`. The LLM returns plain text, not a validated object. The class is dead code in Approach 1.

---

**Q4. How would you fix Approach 1 to actually use `InstitutionDetails`?**

```python
structured_llm = llm.with_structured_output(InstitutionDetails)
llm_chain = prompt | structured_llm
```
This tells the LLM to return JSON matching the schema, which LangChain then parses and validates into an `InstitutionDetails` object.

---

**Q5. Why was the function `fetch_institution_details()` unnecessary?**

It wraps a single `llm_chain.invoke()` call and is called exactly once. A one-line wrapper used once adds no reusability, error handling, or abstraction. Inlining the `.invoke()` call is simpler.

---

**Q6. What is `ChatPromptTemplate.from_messages()` and how is it different from `from_template()`?**

`from_messages()` explicitly defines the role for each message — e.g. `("human", "...")` or `("system", "...")`. `from_template()` creates a single human message by default. `from_messages()` is needed when you want to add system prompts or multi-turn conversation structure.

---

**Q7. What is the `wikipedia` library?**

A Python wrapper around the Wikipedia API. `wikipedia.page("Bugatti")` fetches the full Wikipedia article for "Bugatti" as a `WikipediaPage` object. `.content` returns the full plain text of the article.

---

**Q8. What is regex and what does `re.search()` do?**

Regular expressions are patterns for matching text. `re.search(pattern, text, flags)` scans through `text` looking for the first location where the pattern produces a match. Returns a match object (with `.group()` to extract matched text) or `None` if no match.

---

**Q9. Explain the `employees_match` logic — why are there 5 `re.search()` calls chained with `or`?**

Different Wikipedia articles express employee count in different ways ("employs approximately 5,000 employees", "over 10,000 staff", "12,000 people", etc.). Each `re.search()` tries a different phrasing pattern. The `or` chain short-circuits at the first match — if the first pattern finds a result, the rest are skipped. It's a prioritized fallback system for flexible text extraction.

---

**Q10. What does `re.IGNORECASE` flag do?**

Makes the pattern case-insensitive — "Founded", "FOUNDED", "founded" all match. Essential for Wikipedia content where capitalization varies.

---

**Q11. What does `re.findall()` do vs `re.search()`?**

`re.search()` returns the first match only. `re.findall()` returns all non-overlapping matches as a list. Used for `branches_match` because an institution may have multiple locations/offices.

---

**Q12. What does `model_dump_json(indent=4)` do?**

A Pydantic v2 method that serializes the model instance to a JSON-formatted string with 4-space indentation. Equivalent to `json.dumps(model.dict(), indent=4)` in Pydantic v1. Makes the output human-readable.

---

**Q13. What is `DisambiguationError` in the wikipedia library?**

Raised when a search term matches multiple Wikipedia articles (e.g. "Mercury" could be the planet, the element, the car brand, or Freddie Mercury). The exception's `.options` attribute lists the possible pages. Handling it prevents an unhandled crash.

---

**Q14. What is the critical security issue in the original pgrm9.ipynb?**

A real Google API key was hardcoded in plain text in Cell 5 (`os.environ["GOOGLE_API_KEY"] = "AIzaSy..."`). If pushed to a public GitHub repo, the key is immediately scraped by bots and can be exploited to run up API charges. It must be revoked in Google AI Studio and replaced with `getpass()` or environment variable injection.

---

**Q15. What is the difference between Approach 1 and Approach 2 conceptually?**

Approach 1 is **knowledge-based** — asks the LLM what it knows about an institution from its training data. Fast but can hallucinate or be outdated. Approach 2 is **retrieval-based** — fetches live Wikipedia data and extracts information programmatically. More accurate and up-to-date but brittle (regex breaks if the article's phrasing changes).

---
---

## 🎯 Cross-Program Questions

---

**Q1. What is the difference between word embeddings (Programs 1-4) and sentence embeddings (Program 5)?**

Word embeddings produce one vector per word — the same word gets the same vector regardless of context. Sentence embeddings encode the entire sentence as one vector, capturing context and meaning of the full phrase. "Bank" in "river bank" and "bank account" gets the same word embedding but different positions in sentence embedding space.

---

**Q2. What is the common thread across all 9 programs?**

All programs deal with converting text into numerical representations that machines can process — either at the word level (GloVe, Word2Vec), sentence level (sentence-transformers), or using LLMs (Gemini, Cohere, GPT-2) to understand or generate text.

---

**Q3. Which programs use pre-trained models and which train from scratch?**

Pre-trained: Programs 1, 2 (GloVe), 5 (all-MiniLM-L6-v2), 6 (distilbert), 7 (GPT-2), 8 (Cohere command-r7b), 9 (Gemini). From scratch: Program 3 (custom Word2Vec on domain corpus). Program 4 uses pre-trained GloVe embeddings + a pre-trained LLM.

---

**Q4. What is the role of LangChain across programs 4, 6, 8, 9?**

LangChain provides a unified interface to different LLMs and prompt management. Programs 4, 6, 9 use `ChatGoogleGenerativeAI`; Program 8 uses `ChatCohere`. The same `prompt | model` pattern works across all of them — swap the model object and everything else stays the same.

---

**Q5. What are the ethical concerns with LLM-based programs (4, 6, 8, 9)?**

API key exposure (P9), data privacy (sending user data to third-party APIs), hallucination (P9 Approach 1), bias in sentiment models (P6 may reflect training data biases), cost (API calls aren't free at scale), and environmental impact (large model inference is energy-intensive).

---

<p align="center"><sub>📅 Viva Prep — 19 June 2026</sub></p>
