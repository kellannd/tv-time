from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import json
import os
from pathlib import Path

# for file in Path("C:/Users/kelly\Desktop/tv-time/data/scripts/season3").iterdir():
#     if file.is_file():
#         print(file.name)

    # with open("data/scripts/season3/" + file.name, 'r') as file:
    #     data = json.load(file)

with open("Ariel.json", "r") as file:
    data = json.load(file)

for scene in data["scenes"]:

    dialogStemmed = []
    for line in scene["dialog"]:
        for word in line["dialogSplit"]:
            # print(word)
            # print(PorterStemmer().stem(word))

            dialogStemmed.append(PorterStemmer().stem(word))

        line["dialogStemmed"] = dialogStemmed
        dialogStemmed = []


with open("Ariel.json", 'w') as file:
    json.dump(data, file)


# ps = PorterStemmer()

# # choose some words to be stemmed
# words = ["program", "programs", "programmer", "programming", "programmers"]

# for w in words:
#     print(w, " : ", ps.stem(w))
