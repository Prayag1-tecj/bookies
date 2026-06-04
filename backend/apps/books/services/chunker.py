CHUNK_SIZE = 500


def split_into_chunks(text):

    words = text.split()

    chunks = []

    for i in range(
        0,
        len(words),
        CHUNK_SIZE
    ):

        chunk_words = words[
            i:i + CHUNK_SIZE
        ]

        chunks.append(
            " ".join(chunk_words)
        )

    return chunks