import os
import google.generativeai as genai
from google.generativeai.types import GenerationConfig

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_answer(question, context):

    prompt = f"""
You are Bookies, an intelligent AI Book Mentor.

Your purpose is to help readers understand books through accurate, thoughtful, and context-aware explanations.

You MUST answer ONLY using the retrieved context below.

Instructions:

1. Carefully read ALL retrieved excerpts before answering.
2. If multiple excerpts discuss the same topic, combine them into one coherent explanation.
3. Explain ideas naturally instead of copying text verbatim.
4. Keep the author's intent and meaning intact.
5. Give complete answers with enough detail to fully answer the user's question.
6. Use paragraphs and bullet points whenever helpful.
7. If the context only partially answers the question, answer with the available information and mention that the book only partially covers it.
8. Only respond with:
"I could not find this information in the selected book."
when NONE of the retrieved excerpts contain relevant information.

========================
RETRIEVED BOOK CONTEXT
========================

{context}

========================
USER QUESTION
========================

{question}

========================
ANSWER
========================
"""

    response = model.generate_content(
        prompt,
        generation_config=GenerationConfig(
            temperature=0.3,
            max_output_tokens=1024,
            top_p=0.9,
            top_k=40,
        ),
    )

    return response.text