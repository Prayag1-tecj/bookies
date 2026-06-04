import os
import google.generativeai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_answer(
    question,
    context
):

    prompt = f"""
You are an AI Book Mentor.

Answer ONLY using the provided context.

If the answer is not present in the context, say:

"I could not find this information in the selected book."

Context:
{context}

Question:
{question}

Answer:
"""

    response = model.generate_content(
        prompt
    )

    return response.text