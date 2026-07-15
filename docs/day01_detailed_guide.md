# Day 1 Detailed Guide: Setup and ML Landscape

Use this guide when a tracker item feels too short. The goal of Day 1 is not to build a big model. The goal is to set up your interview workspace, understand the first ML vocabulary set, create your first recall cards, and leave a small commit that proves the workspace exists.

## Where the ML Concepts Come From

Primary source:
- Hands-On ML repo: https://github.com/ageron/handson-mlp
- Day 1 file: `01_the_machine_learning_landscape.ipynb`
- Topic: Chapter 1, "The Machine Learning Landscape"

Important note: the Chapter 1 notebook is mostly support code for figures and data used in the book. The repository README says the main runnable project work starts in later chapters, so Day 1 is mostly reading and vocabulary, not heavy coding.

Read or skim for these exact concepts:
- ML types: supervised, unsupervised, semisupervised, self-supervised, reinforcement learning.
- Batch vs. online learning: retrain periodically on a batch of data vs. update continuously or incrementally as data arrives.
- Instance-based vs. model-based learning: memorize examples and compare new cases vs. learn a general model with parameters.
- Classification vs. regression: predict categories vs. predict numbers.
- Generalization: how well the model works on new data, not just training data.
- Parameters vs. hyperparameters: learned values inside the model vs. settings you choose before training.
- Bias and variance: underfitting from too-simple assumptions vs. overfitting from too much sensitivity to training data.
- Leakage: information from validation/test/future data accidentally entering training.

If you cannot find a phrase inside the notebook, search the book chapter or use the notebook title as the anchor. The tracker link points to the repo because that is the official resource, not because every concept is easy to find by clicking one line.

## Hands-On Coding / Project

### 1. Create repo folders

This means creating your own interview-prep workspace folders. They are not supposed to already exist in the Hands-On ML repo.

Suggested structure:

```text
prep/
|-- ml/
|   |-- notebooks/
|   |-- notes/
|   `-- data/
|-- llm/
|-- agents/
|-- system_design/
|-- leetcode/
|-- behavioral/
`-- job_search/
```

What each folder is for:
- `ml/`: classical machine learning notebooks, summaries, metrics, and charts.
- `llm/`: tokenizer, attention, transformer, training, and fine-tuning practice.
- `agents/`: agent, RAG, tool-use, memory, and evaluation projects.
- `system_design/`: architecture notes and diagrams for ML systems.
- `leetcode/`: coding interview solutions, tests, and explanations.
- `behavioral/`: STAR stories, intro pitch, conflict/failure/leadership examples.
- `job_search/`: job descriptions, resume variants, application logs, networking notes.

Minimal Day 1 output: create the folders and add a tiny `README.md` in each folder explaining what goes there.

### 2. Clone or bookmark approved resources

Do one of these:
- Clone the Hands-On ML repo locally if you plan to run notebooks.
- Bookmark the repo if you only plan to read it today.

Suggested local location:

```powershell
mkdir prep
cd prep
git clone https://github.com/ageron/handson-mlp.git external/handson-mlp
```

If you do not want to clone yet, create `prep/resources.md` and add links to the resources used by the tracker.

### 3. Create Hands-On ML setup notebook and inspect datasets

EDA means exploratory data analysis. It is the early habit of looking at data before modeling: shape, columns, missing values, distributions, target variable, examples, and obvious data issues.

Create a notebook such as:

```text
prep/ml/notebooks/day01_setup_and_eda.ipynb
```

Minimum useful cells:
- Import Python libraries: `pandas`, `numpy`, `matplotlib`, `sklearn`.
- Print Python and package versions.
- Confirm the Hands-On ML repo path exists if cloned.
- Open one small CSV or dataset used by the repo if available.
- Print `df.shape`, `df.head()`, `df.info()`, and `df.describe()`.
- Write 3 bullets: what the rows represent, what the target might be, and one possible data issue.

If you cannot get a dataset working on Day 1, that is okay. Make the notebook a setup check and write a short note saying what blocked you.

### 4. Commit `day01_setup_and_eda`

This means save your Day 1 workspace progress in git with a clear commit message.

Example:

```powershell
git add prep
git commit -m "day01_setup_and_eda"
```

If you are working inside this tracker repo and do not want to mix prep files with app code, create a separate prep repo instead:

```powershell
mkdir ml-interview-prep
cd ml-interview-prep
git init
```

## Flashcards / Recall

Cards are short question-answer prompts for active recall. You can create them in Anki, Quizlet, Notion, a spreadsheet, markdown, or plain text. The tool matters less than reviewing them.

Simple markdown format:

```text
Q: What is supervised learning?
A: Training a model from labeled examples, where each example includes the desired answer.

Q: Classification vs. regression?
A: Classification predicts a category; regression predicts a numeric value.
```

Create 15 cards from Day 1. Use these prompts:

1. What is supervised learning?
2. What is unsupervised learning?
3. What is semisupervised learning?
4. What is self-supervised learning?
5. What is reinforcement learning?
6. Classification vs. regression?
7. Batch learning vs. online learning?
8. Instance-based vs. model-based learning?
9. What is generalization?
10. What is overfitting?
11. What is underfitting?
12. What is a model parameter?
13. What is a hyperparameter?
14. What is data leakage?
15. Bias vs. variance?

Suggested file:

```text
prep/ml/notes/day01_flashcards.md
```

## Done Criteria

Day 1 is done when you have:
- A prep folder structure or a separate prep repo.
- A resource list or cloned Hands-On ML repo.
- A setup/EDA notebook, even if it only verifies environment setup.
- 15 flashcards.
- One short log entry: what you finished, what confused you, and tomorrow's blocker.
- Optional: a commit named `day01_setup_and_eda`.
