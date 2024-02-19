
def correction_mock(client, file_content):
  return file_content + "\n Gramatically corrected by GitFix."

def generate_gramatically_correct_content(client, file_content):
  if len(file_content) > 4e6:
    raise Exception("File content is too large")
  completion = client.chat.completions.create(
    model="gpt-4-turbo-preview",top_p=1,
    messages=[
      {"role": "system", "content": """
      I want you to fix grammatical errors in an mdx file.
      I will give you the file and you will correct grammatical errors in the text(paragraphs and headers).
      DO NOT alter any of the code blocks, codes, paths or links.
      DO NOT change any of the code blocks.
      Change the errors line by line and do not merge lines.
      DO NOT change the words with their synonyms.
      """},
      #  You should output the integer identifier and the corrected version of the text.
      #  Print all integer identifiers in their correct position.
      #  Example input:
      #  (10) She not ate (101)cake in (11)last gathering.
      #  Example output:
      #  (10)She did not eat (101)the cake in (11)the last gathering.
      {"role": "user", "content": file_content}
    ]
  )
  return completion.choices[0].message.content

