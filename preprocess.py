import json

with open("data/scripts/season1/Pilot.json", "r") as file:
    data = json.load(file)

ep_characters = []
count = 1
scene_characters = []

presentCount = 0
pastCount = 0
for scene in data["scenes"]:

    temp = []

    if scene["tense"] == "Present":
        presentCount = presentCount + 1

    if scene["tense"] == "Past":
        pastCount = pastCount + 1

    for line in scene["dialog"]:

        if line["character"] not in temp:
            temp.append(line["character"])
        if line["character"] not in ep_characters:
            ep_characters.append(line["character"])

    scene_characters.append({count: temp})
    count = count + 1

print(scene_characters)
print(ep_characters)
print(presentCount)
print(pastCount)
