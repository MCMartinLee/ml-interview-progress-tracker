export const BLOCKS = {
  R: { label: "Theory / reading", minutes: 60 },
  C: { label: "Hands-on coding / project", minutes: 90 },
  Q: { label: "Flashcards / recall", minutes: 25 },
  I: { label: "Mock interview", minutes: 60 },
  J: { label: "Job search / application", minutes: 50 },
  LOG: { label: "Log / reflection", minutes: 15 }
};

const day = (id, date, weekday, week, title, tasks) => ({ id, date, weekday, week, title, tasks });

export const PLAN = [
  day(1,"2026-07-16","Thursday",1,"Setup and ML Landscape",{
    R:["Hands-on ML: 01_the_machine_learning_landscape.ipynb","Review ML types, batch vs. online learning, instance vs. model-based learning, and generalization","MLJobSearch2025 questions 1–5"],
    C:["Read docs/day01_detailed_guide.md for exact Day 1 steps","Create your own prep folders: prep/ml, prep/llm, prep/agents, prep/system_design, prep/leetcode, prep/behavioral, prep/job_search","Clone or bookmark approved resources and record them in prep/resources.md","Create prep/ml/notebooks/day01_setup_and_eda.ipynb and inspect one dataset or record the setup blocker","Commit your prep work with message day01_setup_and_eda"],
    Q:["Create 15 flashcards in prep/ml/notes/day01_flashcards.md or Anki: learning types, classification vs. regression, parameters vs. hyperparameters, generalization, leakage, bias, and variance"],
    I:["LeetCode 929 — Unique Email Addresses","Clarify normalization rules and edge cases","Use set-based deduplication","Explain time and space complexity aloud"],
    J:["Search LinkedIn for Applied Scientist, Research Scientist, AI Engineer, and ML Engineer","Save 10 roles","Tailor one résumé variant","Submit one application and log it"],
    LOG:["Record completed files, coding mistakes, cards created, application, and tomorrow's blocker"]
  }),
  day(2,"2026-07-17","Friday",1,"End-to-End ML Pipeline",{
    R:["Hands-on ML: 02_end_to_end_machine_learning_project.ipynb","Review train/test split, stratification, preprocessing pipelines, encoding, scaling, and cross-validation","Simplilearn questions 10–16"],
    C:["Build numeric and categorical preprocessing pipelines using the Hands-on ML repo examples","Combine with ColumnTransformer","Train logistic-regression baseline","Save accuracy, precision, recall, F1, and ROC-AUC","Commit day02_pipeline"],
    Q:["Review Day 1 cards","Add cards for stratification, leakage, imputation, one-hot encoding, scaling, grouped split, and time split"],
    I:["LeetCode 121 — Best Time to Buy and Sell Stock","Derive one-pass minimum-price invariant","Then solve LeetCode 66 — Plus One","Test increasing, decreasing, duplicate, carry, and one-element inputs"],
    J:["Search Lever public postings","Review five AI/ML roles","Reject clear sponsorship, location, or seniority mismatches","Tailor and submit one application"],
    LOG:["Record leakage checks, reusable résumé keywords, application status, and follow-up date"]
  }),
  day(3,"2026-07-18","Saturday",1,"Classification and Evaluation",{
    R:["Hands-on ML: 03_classification.ipynb","Review confusion matrix, precision, recall, F1, thresholds, ROC, PR curves, multiclass classification, and error analysis","Data-Science-Interview-Q&A: first 10 ML questions"],
    C:["Add dummy classifier, logistic regression, and random forest","Plot confusion matrices, ROC curves, and PR curves","Tune threshold for recall and precision","Write five metric-selection bullets"],
    Q:["Review due cards","Add cards for TP, FP, TN, FN, precision, recall, specificity, F1, ROC-AUC, PR-AUC, calibration, and threshold selection"],
    I:["LeetCode 3 — Longest Substring Without Repeating Characters","Implement set and last-index map versions","State sliding-window invariant","Then record Tell me about yourself in 90 seconds"],
    J:["Search Wellfound for voice AI, multimodal AI, generative AI, and agent roles","Save five realistic roles","Submit one application","Identify one networking target"],
    LOG:["Record weakest metric explanation and save revised 90-second introduction"]
  }),
  day(4,"2026-07-19","Sunday",1,"Linear Models and Week 1 Deliverable",{
    R:["Hands-on ML: 04_training_linear_models.ipynb","Review gradient descent, polynomial regression, regularization, logistic regression, and softmax","MLJobSearch questions 1, 15, 19, 25, 39, 43, 47, 48"],
    C:["Compare logistic-regression regularization strengths","Plot validation performance versus C","Add learning-curve interpretation","Clean notebook and write Week 1 README","Tag repository week1"],
    Q:["Review all Week 1 cards","Mark easy, shaky, and failed","Rewrite failed cards","Reach at least 50 total cards"],
    I:["LeetCode 20 — Valid Parentheses","Explain stack invariant","Then solve LeetCode 844 — Backspace String Compare","Answer one ML follow-up aloud after coding"],
    J:["Search YC Startup Job Board","Compare five AI startups","Submit one application","Save one founder or recruiter contact note"],
    LOG:["Verify ML baseline, README, 50 cards, three LeetCode solutions, and four applications"]
  }),
  day(5,"2026-07-20","Monday",1,"Week 1 Review and Buffer",{
    R:["Re-read summaries from notebooks 01–04","Explain supervised learning, bias, variance, regularization, and leakage without notes","Re-answer MLJobSearch questions 1–15","Identify five weak concepts"],
    C:["Finish one incomplete Week 1 task","Restart kernel and run Week 1 notebooks top to bottom","Fix broken imports, paths, and nondeterministic results","Push clean commit"],
    Q:["Review every due card","Repeat failed cards after ten minutes","Create no more than five new cards"],
    I:["Redo one from: Unique Email Addresses, Best Time to Buy and Sell Stock, Longest Substring, Valid Parentheses, or Backspace String Compare","Answer five ML questions in 20 minutes","Score communication for five minutes"],
    J:["Review four submitted applications","Complete missing tracker fields","Shortlist six Week 2 roles","Prepare one résumé variant or catch up one application"],
    LOG:["Record Week 1 completion percentage","Move no more than two tasks into Week 2","Select Monday's top three priorities"]
  }),
  day(6,"2026-07-21","Tuesday",2,"Decision Trees",{
    R:["Hands-on ML: 05_decision_trees.ipynb","Review CART, Gini, entropy, regularization, regression trees, and instability","Simplilearn questions 23–24 and MLJobSearch questions 46, 52, 117, 122"],
    C:["Train unrestricted and regularized decision trees using the Hands-on ML repo examples","Compare train/validation gaps","Plot tree or feature importance","Add overfitting diagnosis section"],
    Q:["Review due cards","Add cards for Gini, entropy, split selection, leaf prediction, pruning, variance, and scaling requirements"],
    I:["LeetCode 53 — Maximum Subarray","Derive brute force, prefix-sum, and Kadane solutions","State Kadane invariant","Then solve LeetCode 152 — Maximum Product Subarray"],
    J:["Review LinkedIn jobs posted in the previous 72 hours","Prioritize PyTorch, transformer, multimodal, conversational, and real-time ML roles","Submit one application"],
    LOG:["Record tree-overfitting explanation, coding invariant, and tracker update"]
  }),
  day(7,"2026-07-22","Wednesday",2,"Ensembles",{
    R:["Hands-on ML: 06_ensemble_learning_and_random_forests.ipynb","Review voting, bagging, random forests, AdaBoost, gradient boosting, and stacking","MLJobSearch questions 8, 46, 104, 108, 132, 133"],
    C:["Train random forest and gradient boosting","Use identical cross-validation splits","Build model-comparison table","Add feature-importance caveat","Select champion model"],
    Q:["Add cards for bagging vs. boosting, bootstrap sampling, feature subsampling, AdaBoost, gradient boosting, and stacking leakage"],
    I:["LeetCode 34 — Find First and Last Position of Element in Sorted Array","Write binary searches for left and right boundaries","Explain loop invariant and termination","Test boundaries and missing targets"],
    J:["Search Lever for ML, Applied Scientist, Research Engineer, and Generative AI roles","Submit one application","Save résumé variant used"],
    LOG:["Record model-selection decision and one ensemble misconception"]
  }),
  day(8,"2026-07-23","Thursday",2,"Dimensionality Reduction",{
    R:["Hands-on ML: 07_dimensionality_reduction.ipynb","Review curse of dimensionality, PCA, explained variance, randomized PCA, and manifold learning","Simplilearn question 6 and 17; MLJobSearch questions 22, 75, 103"],
    C:["Use the Hands-on ML dimensionality-reduction notebook dataset","Standardize features and fit PCA retaining 95% variance","Compare logistic-regression time and accuracy before and after PCA","Save explained-variance plot"],
    Q:["Review due cards","Add cards for PCA objective, covariance, eigenvectors, explained variance, scaling, and interpretability loss"],
    I:["LeetCode 11 — Container With Most Water","Explain two-pointer movement proof","Then solve LeetCode 42 — Trapping Rain Water","Correct weak answers from both problems"],
    J:["Search YC startups using foundation models, multimodal models, agents, or real-time AI","Submit one application","Save one company-specific motivation sentence"],
    LOG:["Record PCA trade-off in three sentences and score mock answers 1–5"]
  }),
  day(9,"2026-07-24","Friday",2,"Unsupervised Learning",{
    R:["Hands-on ML: 08_unsupervised_learning.ipynb","Review K-means, choosing K, silhouette score, GMM, anomaly detection, and limitations","MLJobSearch questions 61, 62, 99, 114, 137, 140"],
    C:["Use the Hands-on ML unsupervised-learning notebook dataset","Standardize features","Compare K-means across K values","Calculate inertia and silhouette score","Fit GMM and visualize after PCA","Write five limitations"],
    Q:["Add cards for K-means objective, initialization, inertia, silhouette, GMM, EM, and cluster evaluation"],
    I:["LeetCode 56 — Merge Intervals","Define overlap condition","Explain sorting requirement","Then solve LeetCode 57 — Insert Interval"],
    J:["Search Wellfound for companies under 500 employees","Submit one application","Save one role with a manageable skills gap"],
    LOG:["Record clustering assumptions, coding edge cases, and tracker update"]
  }),
  day(10,"2026-07-25","Saturday",2,"Artificial Neural Networks",{
    R:["Hands-on ML: 09_artificial_neural_networks.ipynb","Review perceptrons, MLPs, activations, output layers, losses, and backpropagation","MLJobSearch questions 24, 41, 55, 56, 81, 106, 110"],
    C:["Implement a two-layer MLP in PyTorch","Log train and validation losses","Compare ReLU and sigmoid","Add tensor-shape assertions","Commit reusable ml/mlp.py"],
    Q:["Add cards for logits, softmax, cross-entropy, BCE, backpropagation, chain rule, ReLU, dying ReLU, and vanishing gradients"],
    I:["LeetCode 253 — Meeting Rooms II","Use sweep-line or heap solution","Explain resource-count invariant","Then discuss scaling calendar conflict detection"],
    J:["Search LinkedIn for ML Engineer or AI Engineer roles","Submit one application","Add missing skills to a frequency list"],
    LOG:["Draw backpropagation from memory and record one design omission"]
  }),
  day(11,"2026-07-26","Sunday",2,"PyTorch and Week 2 Deliverable",{
    R:["Hands-on ML: 10_neural_nets_with_pytorch.ipynb","Skim 11_training_deep_neural_networks.ipynb for initialization, normalization, optimization, regularization, and transfer learning","MLJobSearch questions 15, 25, 66, 67, 70, 79, 101, 124, 128"],
    C:["Build Dataset/DataLoader skeleton","Implement train_one_epoch and evaluate","Add checkpointing, early stopping, metrics, and seed control","Write README usage example","Tag repository week2"],
    Q:["Review all Week 2 cards","Reach 100+ cumulative cards","Suspend duplicates","Shorten long answers"],
    I:["LeetCode 146 — LRU Cache","Implement with hash map plus doubly linked list","Explain O(1) guarantees","Then record one ownership story under three minutes"],
    J:["Review GitHub Hiring-ML list","Cross-check active postings","Submit one application","Clean duplicate tracker rows and next actions"],
    LOG:["Verify model comparison, PyTorch loop, 100 cards, seven coding solutions, and ten applications"]
  }),
  day(12,"2026-07-27","Monday",2,"Week 2 Review and Buffer",{
    R:["Explain trees, random forests, boosting, PCA, K-means, GMM, MLPs, and backpropagation","Re-answer selected MLJobSearch questions 35–80","Review Simplilearn processing, algorithms, and evaluation sections"],
    C:["Run all classical-ML notebooks","Run PyTorch loop","Verify train/validation separation and seeds","Finish one incomplete chart or README section"],
    Q:["Review all due cards","Run 20-card random recall","Rewrite answers longer than four sentences"],
    I:["Redo one from: Maximum Subarray, Maximum Product Subarray, Find First and Last Position, Merge Intervals, Meeting Rooms II, or LRU Cache","Run ML theory lightning round","Deliver one behavioral story with follow-ups"],
    J:["Audit ten applications","Update statuses","Shortlist six LLM roles","Complete one missed application if needed"],
    LOG:["Score ML fundamentals and coding 1–5","Select three LLM topics needing attention"]
  }),
  day(13,"2026-07-28","Tuesday",3,"Tokenization and Data Loading",{
    R:["LLMs-from-scratch Chapter 2 — Working with Text Data","Read ch02.ipynb or dataloader.ipynb","Review tokenization, vocabulary, IDs, sliding windows, embeddings, and positions","MLJobSearch questions 18 and 127"],
    C:["Run dataloader notebook","Build a tiny corpus","Print input/target windows","Verify next-token offset","Implement a small dataset class","Add tokenization notes and demo"],
    Q:["Add cards for tokenization, BPE, vocabulary trade-offs, special tokens, embeddings, context length, and autoregressive targets"],
    I:["LeetCode 15 — 3Sum","Sort, fix one index, and use two pointers","Handle duplicates","Explain O(n²) complexity"],
    J:["Search LinkedIn for LLM Engineer, Generative AI Engineer, Research Engineer LLM, and Applied Scientist NLP","Submit one application","Record required LLM-stack terms"],
    LOG:["Explain next-token data creation in five lines and record application result"]
  }),
  day(14,"2026-07-29","Wednesday",3,"Attention",{
    R:["LLMs-from-scratch Chapter 3 — Coding Attention Mechanisms","Read ch03.ipynb and multihead-attention.ipynb","Review Q/K/V, scaling, causal masks, dropout, and multi-head attention","MLJobSearch questions 37, 38, 45"],
    C:["Implement single-head self-attention","Add scale factor and causal mask","Extend to multi-head attention","Print tensor shapes","Test that future positions receive zero attention"],
    Q:["Add cards for Q/K/V, scores, scaling, causal mask, padding mask, heads, cross-attention, and complexity"],
    I:["LeetCode 76 — Minimum Window Substring","Use sliding window with need/have counts","Explain shrink condition","Then compare with Longest Substring Without Repeating Characters"],
    J:["Search Lever for LLM, NLP, foundation-model, retrieval, and agent roles","Submit one application","Tailor one transformer or real-time inference bullet"],
    LOG:["Draw attention shapes from memory and record sliding-window mistake"]
  }),
  day(15,"2026-07-30","Thursday",3,"GPT Architecture",{
    R:["LLMs-from-scratch Chapter 4 — Implementing a GPT Model from Scratch","Read ch04.ipynb and gpt.py","Review transformer block, residual paths, layer norm, FFN, parameter count, and generation","MLJobSearch questions 94–98"],
    C:["Assemble GPT components","Run forward pass on dummy IDs","Verify batch/sequence/vocabulary output shape","Calculate parameters","Implement greedy generation","Add architecture diagram"],
    Q:["Add cards for pre-norm vs. post-norm, residuals, FFN expansion, decoder-only models, autoregressive generation, temperature, and top-k"],
    I:["LeetCode 4 — Median of Two Sorted Arrays","Explain partition invariant","Test odd, even, empty-side, and duplicate cases","Then answer one transformer complexity follow-up"],
    J:["Search YC startups for generative AI, agents, voice AI, and multimodal AI","Submit one application","Write two-sentence startup motivation"],
    LOG:["Record weakest transformer answer and add it to tomorrow's card queue"]
  }),
  day(16,"2026-07-31","Friday",3,"Pretraining and nanoChat",{
    R:["LLMs-from-scratch Chapter 5 — Pretraining on Unlabeled Data","Read ch05.ipynb, gpt_train.py, and gpt_generate.py","Review nanoChat README, tokenizer.py, gpt.py, and speedrun pipeline","Focus on loss, validation, checkpoints, optimizer, SFT, and evaluation"],
    C:["Run a short controlled GPT training","Record train/validation loss","Save and reload checkpoint","Generate before and after training","Trace nanoChat speedrun into a pipeline diagram","Use a tiny or CPU configuration"],
    Q:["Add cards for next-token cross-entropy, perplexity, validation loss, checkpoints, weight tying, AdamW, decay, warmup, and clipping"],
    I:["LeetCode 23 — Merge k Sorted Lists","Implement heap-based merge","Explain complexity in terms of total nodes and k","Then compare with Merge Two Sorted Lists"],
    J:["Search Wellfound for LLM application and AI-agent companies","Submit one application","Save one role that can reference the portfolio project"],
    LOG:["Record training observation and write nanoChat pipeline from memory"]
  }),
  day(17,"2026-08-01","Saturday",3,"Fine-Tuning and Research Deep Dive",{
    R:["LLMs-from-scratch Chapter 6 — Finetuning for Text Classification","Read ch06.ipynb and gpt_class_finetune.py","Compare feature extraction, partial fine-tuning, full fine-tuning, and output-head replacement","MLJobSearch questions 13, 14, 65, 107"],
    C:["Run reduced classification fine-tuning","Replace output head","Freeze then unfreeze selected layers","Compare trainable parameter counts","Record validation result and overfitting risk"],
    Q:["Add cards for fine-tuning, feature extraction, freezing, catastrophic forgetting, classification heads, and trainable parameter counts"],
    I:["LeetCode 138 — Copy List with Random Pointer","Implement hash-map and interleaving versions","Explain pointer restoration","Then do a short research deep-dive follow-up"],
    J:["Prioritize Applied Scientist and Research Scientist roles on LinkedIn","Submit one application","Match first research bullet to the posting's scientific problem"],
    LOG:["Record three deep-dive questions that caused hesitation and next actions"]
  }),
  day(18,"2026-08-02","Sunday",3,"Instruction Fine-Tuning and Week 3 Deliverable",{
    R:["LLMs-from-scratch Chapter 7 — Finetuning to Follow Instructions","Read ch07.ipynb and gpt_instruction_finetuning.py","Review nanoChat chat_sft.py, chat_eval.py, chat_cli.py, and chat_web.py","Focus on prompt formatting, masks, SFT data, evaluation, and inference"],
    C:["Format five instruction examples","Build instruction dataset loader","Run a minimal SFT path or inspect chapter outputs","Create LLM README covering full pipeline","Add tests for shapes, causal mask, and generation termination","Tag repository week3"],
    Q:["Review all Week 3 cards","Reach 150+ cumulative cards","Run 25-card no-notes test","Flag answers over 20 seconds"],
    I:["LeetCode 297 — Serialize and Deserialize Binary Tree","Implement preorder or level-order codec","Discuss malformed input and null markers","Then cover one timeline caching follow-up"],
    J:["Review GitHub Hiring-ML and YC board","Submit one application","Prepare one role-specific networking note","Audit 16 cumulative applications"],
    LOG:["Verify LLM code, README, 150 cards, research recording, and 16 applications"]
  }),
  day(19,"2026-08-03","Monday",3,"Week 3 Review and Buffer",{
    R:["Explain tokenizer to logits, loss, and generation","Explain pretraining vs. SFT vs. classification fine-tuning","Re-answer MLJobSearch transformer questions 37, 38, 45, 94–98"],
    C:["Run LLM tests","Verify causal masking and shapes","Reload checkpoint and generate output","Complete one missing README diagram"],
    Q:["Review all due LLM cards","Complete 25-card no-notes test","Move failed cards into Top 20 Before Interview"],
    I:["LeetCode 127 — Word Ladder","Implement BFS over wildcard patterns","Explain visited timing and shortest-path guarantee","Then run 20-minute transformer mock"],
    J:["Audit 16 applications","Follow up where appropriate","Shortlist six agent, RAG, or systems roles","Catch up one application if needed"],
    LOG:["Score LLM knowledge 1–5","List five questions still requiring notes","Choose Week 4's highest-priority output"]
  }),
  day(20,"2026-08-04","Tuesday",4,"Agent Fundamentals and Tool Use",{
    R:["LinkedIn Learning Agentic AI sections 1–4","Microsoft lessons 01 intro, 02 frameworks, 03 design patterns, and 04 tool use","Review agents, goals, state, observations, actions, policies, utilities, and architectures"],
    C:["Create agents/job_fit_agent","Define agent state","Create mock résumé, job-description, skill-extraction, and overlap tools","Implement deterministic tool routing","Add three test job descriptions"],
    Q:["Add cards for agent vs. workflow, goal, state, observation, action, tool, policy, utility, planning, reflection, and guardrails"],
    I:["LeetCode 200 — Number of Islands","Implement DFS and BFS","Explain visited mutation","Add Google-style follow-up: count islands across partitioned machines"],
    J:["Search LinkedIn for AI Agent Engineer, Agentic AI, RAG Engineer, and LLM Applications","Submit one application","Add agent-project relevance sentence"],
    LOG:["Record agent state diagram and rotated-search invariant"]
  }),
  day(21,"2026-08-05","Wednesday",4,"Agentic RAG",{
    R:["Microsoft lesson 05 — Agentic RAG","Review query planning, retrieval, grounding, tool selection, response generation, and evaluation","Revisit decision-making and contextual-understanding sections"],
    C:["Store five job descriptions","Chunk responsibilities and qualifications","Implement simple term-based retrieval","Retrieve top chunks for a résumé section","Output matched skills, missing skills, evidence, and résumé suggestions","Attach sources to recommendations"],
    Q:["Add cards for RAG, chunking, retrieval query, retrieval precision/recall, grounding, hallucination, reranking, agentic RAG, and evaluation"],
    I:["LeetCode 210 — Course Schedule II","Use topological sort","Explain cycle detection","Then cover one web-crawler scaling follow-up"],
    J:["Search Lever and submit one application","Save the job description into the agent test collection","Record role ID and source"],
    LOG:["Record one retrieval failure and define tomorrow's test"]
  }),
  day(22,"2026-08-06","Thursday",4,"Trust, Planning, and Multi-Agent Patterns",{
    R:["Microsoft lessons 06 trustworthy agents, 07 planning, 08 multi-agent, and 09 metacognition","Review guardrails, human approval, planner/executor separation, evaluator loops, and stopping conditions"],
    C:["Add planner, executor, and evaluator steps","Check unsupported claims","Add maximum-step limit","Require human approval before résumé replacement text","Test missing inputs, tool failure, and repeated planning loops"],
    Q:["Add cards for planner/executor, reflection, evaluator, human-in-the-loop, authorization, loop prevention, thresholds, handoffs, and error propagation"],
    I:["LeetCode 399 — Evaluate Division","Build weighted graph and answer queries with DFS or BFS","Explain disconnected components","Test unknown variables and self-division"],
    J:["Search YC Startup Job Board","Submit one application","Use agent output to identify missing terminology","Manually verify every suggested edit"],
    LOG:["Record guardrails added and graph-traversal mistake"]
  }),
  day(23,"2026-08-07","Friday",4,"Protocols, Context, and Memory",{
    R:["Microsoft lessons 11 protocols, 12 context engineering, and 13 memory","Review MCP, A2A, NLWeb, context budgets, short-term memory, long-term memory, and contamination risks"],
    C:["Define context schema","Separate profile, current job, evidence, and temporary state","Add length budget and summary memory","Prevent cross-company contamination","Add memory reset command and tests"],
    Q:["Add cards for MCP, A2A, context engineering, context windows, short- and long-term memory, episodic and semantic memory, contamination, and compression"],
    I:["LeetCode 212 — Word Search II","Use trie plus backtracking","Explain pruning and visited marking","Then discuss state and deduplication for a job-discovery agent"],
    J:["Search Wellfound and submit one application","Compare manual résumé analysis with agent output","Record false positives and missed requirements"],
    LOG:["Record context schema and two memory risks"]
  }),
  day(24,"2026-08-08","Saturday",4,"ML System Design",{
    R:["System-Design Primer: scalability, latency, throughput, availability, consistency, CAP, DNS, CDN, load balancing, databases, replication, sharding, caches, queues, and estimates"],
    C:["Create realtime_ml_inference.md","Define use case, constraints, API, online/batch paths, preprocessing, model service, cache, queue, monitoring, versions, rollback, failure modes, latency budget, and capacity estimates","Draw architecture diagram"],
    Q:["Add cards for latency, throughput, scaling, CAP, consistency, replication, sharding, cache-aside, write-through, queues, back pressure, idempotency, and drift"],
    I:["LeetCode 322 — Coin Change","Define state and recurrence","Compare top-down and bottom-up","Then solve LeetCode 410 — Split Array Largest Sum"],
    J:["Search LinkedIn for deployment, online inference, experimentation, and distributed-system roles","Submit one application","Add a system-design talking point"],
    LOG:["Record the design bottleneck and write DP recurrence from memory"]
  }),
  day(25,"2026-08-09","Sunday",4,"Final Integration and Deliverable",{
    R:["Review Simplilearn advanced and scenario questions","Review MLJobSearch questions 93–145","Review research discussion, timed practice, visible work, networking, and interview setup","Review 20 weakest cards"],
    C:["Run all notebooks top to bottom","Remove large outputs and secrets","Add root README linking ML, LLM, agent, and system-design work","Add screenshots or result tables","Add Interview Talking Points, limitations, and next steps","Tag repository 25-day-final"],
    Q:["Closed-book recall: 10 ML, 10 LLM, and 10 agent/system cards","Score immediate, partial, or failed","Create Top 20 Before Interview deck"],
    I:["LeetCode 973 — K Closest Points to Origin","Then solve one design problem: Min Stack, Logger Rate Limiter, or Insert Delete GetRandom O(1)","Run ML theory and system-design scaling follow-ups","Use no notes"],
    J:["Review all five approved job sources","Submit one or two final high-fit applications","Close dead and duplicate entries","Add follow-up dates","Target 22 quality applications"],
    LOG:["Record hours, applications, responses, coding results, recall rate, strongest area, weakest area, and next seven-day maintenance plan"]
  })
];
